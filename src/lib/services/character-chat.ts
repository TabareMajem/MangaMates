import { supabase } from '@/lib/supabase/client';
import { CharacterFactory } from '@/lib/ai/character/character-factory';
import type { MangaCharacter } from '@/types/agent';
import type { ChatMessage } from '@/types/chat';

class CharacterChatService {
  async sendMessage(characterId: string, userId: string, message: string): Promise<ChatMessage> {
    // Get character data
    const character = await this.getCharacter(characterId);
    if (!character) {
      throw new Error('Character not found');
    }

    // Get or create character instance
    const characterInstance = CharacterFactory.getCharacterInstance(character);

    // Generate response
    const response = await characterInstance.generateResponse(message);

    // Save to chat history
    await supabase.from('chat_messages').insert({
      character_id: characterId,
      user_id: userId,
      content: message,
      response,
      created_at: new Date().toISOString()
    });

    return {
      role: 'assistant',
      content: response,
      character
    };
  }

  private async getCharacter(characterId: string): Promise<MangaCharacter | null> {
    const { data, error } = await supabase
      .from('character_templates')
      .select('*')
      .eq('id', characterId)
      .single();

    if (error) throw error;
    return data;
  }
}

export const characterChatService = new CharacterChatService();
