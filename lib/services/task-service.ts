import { supabase } from '@/lib/supabase/client';
import { AgentTask } from '@/types/agent';

export async function createTask(task: Omit<AgentTask, 'id'>): Promise<AgentTask> {
  const { data, error } = await supabase
    .from('agent_tasks')
    .insert(task)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAgentTasks(agentId: string): Promise<AgentTask[]> {
  const { data, error } = await supabase
    .from('agent_tasks')
    .select('*')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateTask(
  id: string,
  updates: Partial<AgentTask>
): Promise<AgentTask> {
  const { data, error } = await supabase
    .from('agent_tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase
    .from('agent_tasks')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
