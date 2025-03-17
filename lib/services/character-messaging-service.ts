import { supabase } from '@/lib/supabase';
import { lineClient } from '@/lib/messaging/line-client';
import { getCharacter } from '@/lib/services/character-service';
import { generateResponse } from '@/lib/ai/character-ai';

export const characterMessagingService = {
  // Send a message from a character to a LINE user
  async sendCharacterMessage(
    characterId: string,
    recipientId: string,
    prompt?: string
  ) {
    try {
      // Get the character
      const character = await getCharacter(characterId);
      
      if (!character) {
        throw new Error(`Character not found: ${characterId}`);
      }
      
      // Generate a message from the character
      const defaultPrompt = `Send a friendly message to your friend. Be in character as ${character.name}.`;
      const content = await generateResponse(character, {
        type: 'message',
        content: prompt || defaultPrompt
      });
      
      // Send the message via LINE
      await lineClient.pushMessage(recipientId, {
        type: 'text',
        text: content
      });
      
      // Log the message
      await supabase
        .from('character_messages')
        .insert({
          character_id: characterId,
          recipient_id: recipientId,
          content,
          sent_at: new Date().toISOString()
        });
      
      return { success: true, message: content };
    } catch (error) {
      console.error('Error sending character message:', error);
      throw error;
    }
  },
  
  // Send a scheduled message
  async sendScheduledMessage(messageId: string) {
    try {
      // Get the scheduled message
      const { data: message, error } = await supabase
        .from('scheduled_messages')
        .select(`
          id,
          recipient_id,
          content,
          schedule_id,
          character_schedules(
            character_id
          )
        `)
        .eq('id', messageId)
        .single();
      
      if (error || !message) {
        throw new Error(`Scheduled message not found: ${messageId}`);
      }
      
      // If content is already generated, send it
      if (message.content) {
        await lineClient.pushMessage(message.recipient_id, {
          type: 'text',
          text: message.content
        });
      } else {
        // Generate content and send
        const characterId = message.character_schedules.character_id;
        await this.sendCharacterMessage(
          characterId,
          message.recipient_id,
          `Send a scheduled message to your friend. Consider the time of day (${new Date().toLocaleTimeString()}).`
        );
      }
      
      // Update message status
      await supabase
        .from('scheduled_messages')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', messageId);
      
      return { success: true };
    } catch (error) {
      console.error('Error sending scheduled message:', error);
      
      // Update message status to failed
      await supabase
        .from('scheduled_messages')
        .update({
          status: 'failed',
          error: error.message || 'Failed to send message'
        })
        .eq('id', messageId);
      
      throw error;
    }
  },
  
  // Get message history for a character and recipient
  async getMessageHistory(characterId: string, recipientId: string) {
    try {
      const { data, error } = await supabase
        .from('character_messages')
        .select('*')
        .eq('character_id', characterId)
        .eq('recipient_id', recipientId)
        .order('sent_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error getting message history:', error);
      throw error;
    }
  }
}; 