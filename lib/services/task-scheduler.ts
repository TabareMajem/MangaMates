import { executeAgentAction } from '@/lib/ai/agent-executor';
import { parseSchedule } from '@/lib/utils/schedule-parser';
import { AgentTask } from '@/types/agent';
import { getAgentTasks, updateTask } from './task-service';

export class TaskScheduler {
  private scheduledTasks: Map<string, NodeJS.Timeout> = new Map();

  async scheduleAgentTasks(agentId: string) {
    // Clear existing schedules for this agent
    this.clearAgentSchedules(agentId);

    // Get all active tasks
    const tasks = await getAgentTasks(agentId);
    const activeTasks = tasks.filter(task => task.isActive);

    // Schedule each task
    activeTasks.forEach(task => this.scheduleTask(task));
  }

  private scheduleTask(task: AgentTask) {
    const schedule = parseSchedule(task.schedule);
    const nextRun = this.calculateNextRun(schedule);
    
    if (!nextRun) return;

    // Update next_run in database
    updateTask(task.id, { next_run: nextRun.toISOString() });

    // Schedule task execution
    const timeout = setTimeout(
      () => this.executeTask(task),
      nextRun.getTime() - Date.now()
    );

    this.scheduledTasks.set(task.id, timeout);
  }

  private async executeTask(task: AgentTask) {
    const maxRetries = 3;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        // Execute the task action
        await executeAgentAction(task.agentId, task.action);

        // Update last_run time
        await updateTask(task.id, {
          last_run: new Date().toISOString(),
          error_count: 0,
          last_error: null
        });

        // Reschedule the task
        this.scheduleTask(task);
        return;

      } catch (error) {
        retries++;
        console.error(`Failed to execute task ${task.id} (attempt ${retries}):`, error);

        // Update error stats
        await updateTask(task.id, {
          error_count: (task.error_count || 0) + 1,
          last_error: error.message
        });

        if (retries < maxRetries) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => 
            setTimeout(resolve, Math.pow(2, retries) * 1000)
          );
        }
      }
    }

    // After all retries failed
    console.error(`Task ${task.id} failed after ${maxRetries} attempts`);
    
    // Optionally disable the task or notify admin
    if (task.error_count >= 10) {
      await updateTask(task.id, { is_active: false });
    }
  }

  private clearAgentSchedules(agentId: string) {
    this.scheduledTasks.forEach((timeout, taskId) => {
      clearTimeout(timeout);
      this.scheduledTasks.delete(taskId);
    });
  }

  private calculateNextRun(schedule: TaskSchedule): Date | null {
    const now = new Date();
    
    switch (schedule.type) {
      case 'daily':
        return this.getNextDailyRun(schedule.time);
        
      case 'weekly':
        return this.getNextWeeklyRun(schedule.days, schedule.time);
        
      case 'custom':
        return this.evaluateCustomSchedule(schedule.conditions);
        
      default:
        return null;
    }
  }

  private evaluateCustomSchedule(conditions: Array<{ when: string; then: string }> = []): Date | null {
    const now = new Date();
    let nextRun: Date | null = null;

    for (const condition of conditions) {
      const evaluatedTime = this.evaluateCondition(condition.when);
      if (evaluatedTime && (!nextRun || evaluatedTime < nextRun)) {
        nextRun = evaluatedTime;
      }
    }

    return nextRun;
  }

  private evaluateCondition(whenClause: string): Date | null {
    // Basic time patterns
    const timePattern = /^at (\d{1,2}):(\d{2})(am|pm)?$/i;
    const relativePattern = /^in (\d+) (minutes?|hours?|days?)$/i;
    
    let match;

    if ((match = timePattern.exec(whenClause))) {
      const [_, hours, minutes, meridiem] = match;
      let hour = parseInt(hours);
      
      if (meridiem) {
        if (meridiem.toLowerCase() === 'pm' && hour < 12) hour += 12;
        if (meridiem.toLowerCase() === 'am' && hour === 12) hour = 0;
      }

      const next = new Date();
      next.setHours(hour, parseInt(minutes), 0, 0);
      
      if (next <= new Date()) {
        next.setDate(next.getDate() + 1);
      }
      
      return next;
    }
    
    if ((match = relativePattern.exec(whenClause))) {
      const [_, amount, unit] = match;
      const value = parseInt(amount);
      const next = new Date();
      
      switch (unit.toLowerCase().replace(/s$/, '')) {
        case 'minute':
          next.setMinutes(next.getMinutes() + value);
          break;
        case 'hour':
          next.setHours(next.getHours() + value);
          break;
        case 'day':
          next.setDate(next.getDate() + value);
          break;
      }
      
      return next;
    }

    return null;
  }

  private getNextDailyRun(timeStr?: string): Date | null {
    if (!timeStr) return null;
    return getNextDailyRun(timeStr);
  }

  private getNextWeeklyRun(days?: string[], timeStr?: string): Date | null {
    if (!days?.length || !timeStr) return null;
    return getNextWeeklyRun(days, timeStr);
  }
}
