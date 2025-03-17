import { supabase } from '@/lib/supabase/client';
import { Character } from '@/types/agent';

export async function getAllAgentsWithTasks(): Promise<Character[]> {
  const { data: agents, error } = await supabase
    .from('agents')
    .select(`
      *,
      agent_tasks!inner (
        id
      )
    `)
    .eq('agent_tasks.is_active', true);

  if (error) throw error;
  return agents;
}
