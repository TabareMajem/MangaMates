import { supabase } from '@/lib/supabase';
import { Character } from '@/types/agent';

export async function getCharacter(characterId: string): Promise<Character> {
  const { data, error } = await supabase
    .from('character_instances')
    .select('*, character_templates(*)')
    .eq('id', characterId)
    .single();
    
  if (error) throw error;
  
  // Transform the data into the Character type
  return {
    id: data.id,
    name: data.name || data.character_templates?.name || '',
    description: data.description || data.character_templates?.description || '',
    personality: data.personality || data.character_templates?.personality || '',
    background: data.background || data.character_templates?.background || '',
    appearance: data.appearance || data.character_templates?.appearance || {},
    voiceStyle: data.voice_style || data.character_templates?.voice_style || '',
    goals: data.goals || [],
    traits: data.traits || {},
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function getUserCharacters(userId: string): Promise<Character[]> {
  const { data, error } = await supabase
    .from('character_instances')
    .select('*, character_templates(*)')
    .eq('user_id', userId);
    
  if (error) throw error;
  
  if (!data || data.length === 0) return [];
  
  // Transform the data into Character[] type
  return data.map(item => ({
    id: item.id,
    name: item.name || item.character_templates?.name || '',
    description: item.description || item.character_templates?.description || '',
    personality: item.personality || item.character_templates?.personality || '',
    background: item.background || item.character_templates?.background || '',
    appearance: item.appearance || item.character_templates?.appearance || {},
    voiceStyle: item.voice_style || item.character_templates?.voice_style || '',
    goals: item.goals || [],
    traits: item.traits || {},
    createdAt: item.created_at,
    updatedAt: item.updated_at
  }));
}

export async function createCharacter(userId: string, character: Partial<Character>): Promise<Character> {
  const { data, error } = await supabase
    .from('character_instances')
    .insert({
      user_id: userId,
      character_template_id: character.templateId,
      name: character.name,
      description: character.description,
      personality: character.personality,
      background: character.background,
      appearance: character.appearance,
      voice_style: character.voiceStyle,
      goals: character.goals,
      traits: character.traits
    })
    .select()
    .single();
    
  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name || '',
    description: data.description || '',
    personality: data.personality || '',
    background: data.background || '',
    appearance: data.appearance || {},
    voiceStyle: data.voice_style || '',
    goals: data.goals || [],
    traits: data.traits || {},
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
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
