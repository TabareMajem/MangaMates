import { supabase } from '@/lib/supabase/client';
import { Character } from '@/types/agent';

export async function getCharacter(id: string): Promise<Character | null> {
  const { data, error } = await supabase
    .from('agents')
    .select(`
      id,
      name,
      series,
      personality,
      goals,
      line_channel_id,
      kakao_channel_id
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data ? {
    ...data,
    lineChannelId: data.line_channel_id,
    kakaoChannelId: data.kakao_channel_id,
    personality: {
      traits: data.personality.traits || [],
      background: data.personality.background || '',
      speakingStyle: data.personality.speaking_style || '',
      interests: data.personality.interests || [],
      values: data.personality.values || []
    }
  } : null;
}

export async function saveAgent(agent: Partial<Character>): Promise<Character> {
  const { data, error } = await supabase
    .from('agents')
    .upsert({
      id: agent.id,
      name: agent.name,
      series: agent.series,
      personality: {
        traits: agent.personality?.traits || [],
        background: agent.personality?.background || '',
        speaking_style: agent.personality?.speakingStyle || '',
        interests: agent.personality?.interests || [],
        values: agent.personality?.values || []
      },
      goals: agent.goals || [],
      line_channel_id: agent.lineChannelId,
      kakao_channel_id: agent.kakaoChannelId
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
