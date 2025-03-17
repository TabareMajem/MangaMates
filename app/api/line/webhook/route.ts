import { NextRequest, NextResponse } from 'next/server';
import { WebhookRequestBody, validateSignature } from '@line/bot-sdk';
import { lineClient } from '@/lib/messaging/line-client';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  // Get the LINE signature from the request headers
  const signature = request.headers.get('x-line-signature');
  
  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 401 });
  }
  
  try {
    // Get the request body as text
    const body = await request.text();
    
    // Validate the signature
    const isValid = validateSignature(
      body,
      process.env.LINE_CHANNEL_SECRET || '',
      signature
    );
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    // Parse the webhook events
    const webhookData: WebhookRequestBody = JSON.parse(body);
    
    // Process each event
    for (const event of webhookData.events) {
      // Handle message events
      if (event.type === 'message' && event.message.type === 'text') {
        const userId = event.source.userId;
        const messageText = event.message.text;
        const replyToken = event.replyToken;
        
        // Find a character associated with this LINE user
        const { data: characterConnection } = await supabase
          .from('character_connections')
          .select('character_id')
          .eq('line_user_id', userId)
          .eq('is_active', true)
          .limit(1)
          .single();
        
        if (characterConnection) {
          // Get the character
          const { data: character } = await supabase
            .from('character_instances')
            .select('*')
            .eq('id', characterConnection.character_id)
            .single();
          
          if (character) {
            // Generate a response from the character
            // In a real implementation, you would call your AI service here
            const response = `Hi! I'm ${character.name}. Thanks for your message: "${messageText}"`;
            
            // Reply to the user
            await lineClient.replyMessage(replyToken, {
              type: 'text',
              text: response
            });
            
            // Log the interaction
            await supabase
              .from('character_messages')
              .insert([
                {
                  character_id: character.id,
                  recipient_id: userId,
                  content: response,
                  sent_at: new Date().toISOString()
                }
              ]);
          }
        } else {
          // No character connected, send a default response
          await lineClient.replyMessage(replyToken, {
            type: 'text',
            text: 'Hello! To chat with a character, please connect one first.'
          });
        }
      }
      
      // Handle follow/unfollow events
      if (event.type === 'follow') {
        const userId = event.source.userId;
        
        // Get user profile
        const profile = await lineClient.getProfile(userId);
        
        // Store LINE user info
        await supabase
          .from('line_users')
          .upsert({
            id: userId,
            display_name: profile.displayName,
            picture_url: profile.pictureUrl,
            status_message: profile.statusMessage,
            is_following: true,
            last_interaction: new Date().toISOString()
          });
        
        // Send welcome message
        await lineClient.pushMessage(userId, {
          type: 'text',
          text: `Welcome, ${profile.displayName}! Connect with your favorite characters and start chatting.`
        });
      }
      
      if (event.type === 'unfollow') {
        const userId = event.source.userId;
        
        // Update LINE user status
        await supabase
          .from('line_users')
          .update({
            is_following: false,
            unfollowed_at: new Date().toISOString()
          })
          .eq('id', userId);
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('LINE webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 