import type { MessagingProvider } from '@/types/messaging';

export class KakaoMessagingClient {
  private apiKey: string;

  constructor(config: MessagingProvider['config']) {
    this.apiKey = config.apiKey!;
  }

  async sendMessage(userId: string, message: string) {
    const response = await fetch('https://kapi.kakao.com/v2/api/talk/memo/default/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        template_object: JSON.stringify({
          object_type: 'text',
          text: message,
          link: {}
        })
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send Kakao message');
    }

    return response.json();
  }

  async handleWebhook(event: any) {
    const { user_key, type, content } = event;
    
    if (type !== 'text') return;

    // Process message with AI character
    const response = await this.processMessage(content);

    return this.sendMessage(user_key, response);
  }

  private async processMessage(text: string) {
    // TODO: Implement AI processing
    return `Received: ${text}`;
  }
}
