import { Client } from '@line/bot-sdk';
import type { MessagingProvider } from '@/types/messaging';

export class LineMessagingClient {
  private client: Client;

  constructor(config: MessagingProvider['config']) {
    this.client = new Client({
      channelAccessToken: config.accessToken,
      channelSecret: config.channelId!
    });
  }

  async sendMessage(userId: string, message: string) {
    return this.client.pushMessage(userId, {
      type: 'text',
      text: message
    });
  }

  async handleWebhook(event: any) {
    const { replyToken, message, source } = event;
    
    if (message.type !== 'text') return;

    // Process message with AI character
    const response = await this.processMessage(message.text);

    return this.client.replyMessage(replyToken, {
      type: 'text',
      text: response
    });
  }

  private async processMessage(text: string) {
    // TODO: Implement AI processing
    return `Received: ${text}`;
  }
}
