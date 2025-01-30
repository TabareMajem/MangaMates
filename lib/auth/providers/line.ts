import { Client } from '@line/bot-sdk';
import { createHash } from 'crypto';

interface LineConfig {
  channelAccessToken: string;
  channelSecret: string;
  loginChannelId: string;
  loginChannelSecret: string;
  liffId: string;
}

export class LineService {
  private client: Client;
  private config: LineConfig;

  constructor() {
    this.config = {
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
      channelSecret: process.env.LINE_CHANNEL_SECRET!,
      loginChannelId: process.env.LINE_LOGIN_CHANNEL_ID!,
      loginChannelSecret: process.env.LINE_LOGIN_CHANNEL_SECRET!,
      liffId: process.env.LINE_LIFF_ID!
    };

    this.client = new Client({
      channelAccessToken: this.config.channelAccessToken,
      channelSecret: this.config.channelSecret
    });
  }

  async verifyLineSignature(body: string, signature: string): Promise<boolean> {
    const hash = createHash('sha256')
      .update(this.config.channelSecret + body)
      .digest('base64');
    return hash === signature;
  }

  async handleWebhook(event: Line.WebhookEvent) {
    if (event.type === 'message' && event.message.type === 'text') {
      await this.handleMessage(event);
    }
  }

  private async handleMessage(event: Line.MessageEvent) {
    // Process message with AI and generate response
    const response = await this.generateAIResponse(event.message.text);
    
    await this.client.replyMessage(event.replyToken, {
      type: 'text',
      text: response
    });
  }

  private async generateAIResponse(message: string): Promise<string> {
    // Implement AI response generation
    return "AI response here";
  }
}
