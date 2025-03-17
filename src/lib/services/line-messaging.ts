import { supabase } from '@/lib/supabase/client';

class LineMessagingService {
  private readonly LINE_CONFIG = {
    channelId: '2006299064',
    channelSecret: '1615a8e1f00864a93817450c627efa14',
    baseUrl: 'https://access.line.me/oauth2/v2.1',
    botChannelId: '2006299140',
    botChannelSecret: '22a9381107ec5da3127e70609b93f881',
    botChannelToken: 'LJWxqwC0zVNmPdfV6d9NF5x1ZBkJ4wYrDMHXOjPkIz0pumc+Pf9Un7ZJ9yiM6vnWxzgLXs42TVBVbnfA+9Mv9rsU8V7VSmHF0HO3vVl0/E9t0kMOi+oLB5cWnycYHQE2OG8R3zg+VsxXdGPaZQ1q+wdB04t89/1O/w1cDnyilFU='
  };

  async createIntegration(characterId: string, userId: string, characterName: string) {
    // Generate state parameter for security
    const state = crypto.randomUUID();
    
    // Store integration request
    const { error } = await supabase
      .from('messaging_integrations')
      .insert({
        user_id: userId,
        character_id: characterId,
        provider: 'line',
        status: 'pending',
        config: {
          state,
          character_name: characterName
        }
      });

    if (error) throw error;

    // Generate LINE login URL
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.LINE_CONFIG.channelId,
      redirect_uri: `${window.location.origin}/line/callback`,
      state,
      scope: 'profile openid',
      bot_prompt: 'aggressive'
    });

    return {
      authUrl: `${this.LINE_CONFIG.baseUrl}/authorize?${params.toString()}`
    };
  }

  async handleCallback(code: string, state: string) {
    // Verify state and exchange code for access token
    const integration = await supabase
      .from('messaging_integrations')
      .select()
      .eq('config->state', state)
      .single();

    if (!integration.data) throw new Error('Invalid state parameter');

    // Exchange code for access token (this would be done on the backend)
    // For now, we'll simulate success
    await supabase
      .from('messaging_integrations')
      .update({
        status: 'active',
        config: {
          ...integration.data.config,
          bot_user_id: 'Ud51a75b1538e87d3e7cca5e335b14fb9'
        }
      })
      .eq('id', integration.data.id);

    return {
      success: true,
      characterName: integration.data.config.character_name
    };
  }
}

export const lineMessagingService = new LineMessagingService();
