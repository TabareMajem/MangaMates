import { supabase } from '@/lib/supabase/client';
import type { AIAgent, AgentPersonality, AgentGoal } from '@/types/agent';
import type { MessagingProvider } from '@/types/messaging';

export async function createAgent(
  userId: string,
  personality: AgentPersonality,
  goals: AgentGoal[],
  messaging?: MessagingProvider | null
): Promise<AIAgent> {
  // Create agent
  const { data: agent, error: agentError } = await supabase
    .from('ai_agents')
    .insert({
      user_id: userId,
      personality,
      goals,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (agentError) throw agentError;

  // Add messaging integration if provided
  if (messaging?.enabled) {
    const { error: msgError } = await supabase
      .from('messaging_integrations')
      .insert({
        user_id: userId,
        character_id: agent.id,
        provider: messaging.type,
        config: messaging.config,
        webhook_url: `${window.location.origin}/api/messaging/${messaging.type}/${agent.id}`,
        status: 'active'
      });

    if (msgError) throw msgError;
  }

  return agent;
}

export async function getUserAgents(userId: string): Promise<AIAgent[]> {
  const { data, error } = await supabase
    .from('ai_agents')
    .select('*, messaging_integrations(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAgentById(id: string): Promise<AIAgent | null> {
  const { data, error } = await supabase
    .from('ai_agents')
    .select('*, messaging_integrations(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}
