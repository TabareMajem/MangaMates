import { supabase } from '@/lib/supabase';
import { lineClient } from '@/lib/messaging/line-client';

// This would be run by a cron job or serverless function
export async function processScheduledMessages() {
  const now = new Date();
  
  try {
    // Get pending messages that are due
    const { data: messages, error } = await supabase
      .from('scheduled_messages')
      .select(`
        id,
        recipient_id,
        content,
        schedule_id,
        character_schedules(
          character_id,
          character_instances(
            name,
            personality
          )
        )
      `)
      .eq('status', 'pending')
      .lte('scheduled_for', now.toISOString());
      
    if (error) throw error;
    
    if (!messages || messages.length === 0) {
      console.log('No scheduled messages to process');
      return;
    }
    
    console.log(`Processing ${messages.length} scheduled messages`);
    
    // Process each message
    for (const message of messages) {
      try {
        // Send the message via LINE
        await lineClient.pushMessage(message.recipient_id, {
          type: 'text',
          text: message.content
        });
        
        // Update the message status to sent
        await supabase
          .from('scheduled_messages')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', message.id);
          
      } catch (sendError) {
        console.error(`Error sending message ${message.id}:`, sendError);
        
        // Update the message status to failed
        await supabase
          .from('scheduled_messages')
          .update({
            status: 'failed',
            error: sendError.message || 'Failed to send message',
            updated_at: new Date().toISOString()
          })
          .eq('id', message.id);
      }
    }
    
    return messages.length;
  } catch (error) {
    console.error('Error processing scheduled messages:', error);
    throw error;
  }
} 