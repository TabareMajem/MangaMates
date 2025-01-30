import type { Character, Task } from '@/types';
import { supabase } from '../supabase';

export class TaskManager {
  constructor(private character: Character) {}

  async getTasks(status?: Task['status']): Promise<Task[]> {
    const query = supabase
      .from('character_tasks')
      .select('*')
      .eq('character_id', this.character.id);

    if (status) {
      query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data.map(task => ({
      id: task.id,
      description: task.description,
      status: task.status,
      platform: task.platform,
      scheduledFor: task.scheduled_for ? new Date(task.scheduled_for) : undefined,
      completedAt: task.completed_at ? new Date(task.completed_at) : undefined
    }));
  }

  async updateTaskStatus(taskId: string, status: Task['status']): Promise<void> {
    const { error } = await supabase
      .from('character_tasks')
      .update({ 
        status,
        completed_at: status === 'completed' ? new Date().toISOString() : null
      })
      .eq('id', taskId)
      .eq('character_id', this.character.id);

    if (error) throw error;
  }

  async deleteTask(taskId: string): Promise<void> {
    const { error } = await supabase
      .from('character_tasks')
      .delete()
      .eq('id', taskId)
      .eq('character_id', this.character.id);

    if (error) throw error;
  }
}
