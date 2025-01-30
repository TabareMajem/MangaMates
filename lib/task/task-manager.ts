import type { Task, TaskStatus } from '@/types/task';
import { Redis } from '@upstash/redis';
import { CronJob } from 'cron';
import { ErrorHandler } from '../error/error-handler';
import { MessagingService } from '../messaging/messaging-service';
import { supabase } from '../supabase';

export class TaskManager {
  private scheduledTasks: Map<string, CronJob> = new Map();
  private isRunning = false;
  private readonly lockKey = 'task:lock';
  private readonly lockTTL = 60; // 60 seconds

  constructor(
    private redis: Redis = Redis.fromEnv(),
    private messagingService: MessagingService,
    private errorHandler: ErrorHandler = new ErrorHandler()
  ) {}

  async initialize() {
    await this.loadScheduledTasks();
    await this.startTaskProcessor();
  }

  async shutdown() {
    this.isRunning = false;
    for (const job of this.scheduledTasks.values()) {
      job.stop();
    }
    this.scheduledTasks.clear();
  }

  private async loadScheduledTasks() {
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .in('status', ['pending', 'scheduled'])
        .order('priority');

      if (error) throw error;

      for (const task of tasks) {
        await this.scheduleTask(task);
      }
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'TaskManager.loadScheduledTasks'
      });
    }
  }

  private async startTaskProcessor() {
    if (this.isRunning) return;
    this.isRunning = true;

    while (this.isRunning) {
      try {
        const lock = await this.acquireLock();
        if (!lock) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }

        const task = await this.getNextTask();
        if (task) {
          await this.processTask(task);
        }

        await this.releaseLock();
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        await this.errorHandler.handleError(error as Error, {
          context: 'TaskManager.startTaskProcessor'
        });
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  private async scheduleTask(task: Task) {
    if (task.schedule.type === 'recurring' && task.schedule.cronExpression) {
      const job = new CronJob(
        task.schedule.cronExpression,
        () => this.processTask(task),
        null,
        true,
        task.schedule.timezone
      );

      this.scheduledTasks.set(task.id, job);
    } else if (task.schedule.type === 'one_time' && task.schedule.startAt) {
      const delay = new Date(task.schedule.startAt).getTime() - Date.now();
      if (delay > 0) {
        setTimeout(() => this.processTask(task), delay);
      }
    }
  }

  private async getNextTask(): Promise<Task | null> {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select(`
        *,
        dependencies:tasks!tasks_dependencies_fkey (
          id,
          status
        )
      `)
      .in('status', ['pending', 'scheduled'])
      .order('priority')
      .limit(1);

    if (error || !tasks?.length) return null;

    const task = tasks[0];
    const dependencies = task.dependencies as Task[];
    
    // Check if all dependencies are completed
    const isBlocked = dependencies.some(d => d.status !== 'completed');
    if (isBlocked) {
      await this.updateTaskStatus(task.id, 'blocked');
      return null;
    }

    return task;
  }

  private async processTask(task: Task) {
    const startTime = Date.now();
    try {
      await this.updateTaskStatus(task.id, 'running');

      switch (task.type) {
        case 'message':
          await this.processMessageTask(task);
          break;
        // Add other task type handlers
        default:
          throw new Error(`Unknown task type: ${task.type}`);
      }

      await this.completeTask(task.id, startTime);
    } catch (error) {
      await this.handleTaskFailure(task.id, error as Error, startTime);
    }
  }

  private async processMessageTask(task: Task) {
    if (!task.metadata.platform || !task.metadata.content) {
      throw new Error('Invalid message task configuration');
    }

    await this.messagingService.sendMessage({
      platform: task.metadata.platform === 'all' ? 'line' : task.metadata.platform,
      channelId: task.characterId,
      userId: task.metadata.targetAudience?.[0] || 'broadcast',
      content: task.metadata.content,
      priority: task.priority
    });

    if (task.metadata.platform === 'all') {
      await this.messagingService.sendMessage({
        platform: 'kakao',
        channelId: task.characterId,
        userId: task.metadata.targetAudience?.[0] || 'broadcast',
        content: task.metadata.content,
        priority: task.priority
      });
    }
  }

  private async updateTaskStatus(taskId: string, status: TaskStatus) {
    const { error } = await supabase
      .from('tasks')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', taskId);

    if (error) throw error;
  }

  private async completeTask(taskId: string, startTime: number) {
    const duration = Date.now() - startTime;
    
    await Promise.all([
      supabase
        .from('tasks')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          progress: 100,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId),
      
      supabase
        .from('task_executions')
        .insert({
          task_id: taskId,
          status: 'completed',
          started_at: new Date(startTime).toISOString(),
          completed_at: new Date().toISOString(),
          duration: duration
        })
    ]);
  }

  private async handleTaskFailure(taskId: string, error: Error, startTime: number) {
    const duration = Date.now() - startTime;
    
    await Promise.all([
      supabase
        .from('tasks')
        .update({
          status: 'failed',
          failed_at: new Date().toISOString(),
          error: error.message,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId),
      
      supabase
        .from('task_executions')
        .insert({
          task_id: taskId,
          status: 'failed',
          started_at: new Date(startTime).toISOString(),
          completed_at: new Date().toISOString(),
          duration: duration,
          error: error.message
        })
    ]);

    await this.errorHandler.handleError(error, {
      context: 'TaskManager.processTask',
      taskId
    });
  }

  private async acquireLock(): Promise<boolean> {
    const token = Math.random().toString(36).substring(7);
    const acquired = await this.redis.set(
      this.lockKey,
      token,
      { nx: true, ex: this.lockTTL }
    );
    return !!acquired;
  }

  private async releaseLock() {
    await this.redis.del(this.lockKey);
  }
}
