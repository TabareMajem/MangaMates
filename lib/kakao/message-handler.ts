import { Logger } from '@/lib/monitoring/logger';
import { Redis } from '@upstash/redis';
import { MessageQueue } from '../queue/message-queue';

interface KakaoMessage {
  type: string;
  content: string;
  attachments?: {
    type: string;
    url: string;
    size?: number;
  }[];
}

interface KakaoMessageTemplate {
  id: string;
  variables: Record<string, string>;
}

export class KakaoMessageHandler {
  private redis: Redis;
  private logger: Logger;
  private messageQueue: MessageQueue;
  private apiUrl: string;

  constructor() {
    this.redis = Redis.fromEnv();
    this.logger = new Logger();
    this.messageQueue = new MessageQueue();
    this.apiUrl = 'https://kapi.kakao.com/v2/api/talk/message';
  }

  async sendMessage(userId: string, message: KakaoMessage): Promise<boolean> {
    try {
      await this.messageQueue.enqueue('kakao_message', {
        userId,
        message,
        timestamp: Date.now()
      });

      return true;
    } catch (error) {
      this.logger.error('Failed to queue Kakao message', error as Error);
      return false;
    }
  }

  async sendTemplate(userId: string, template: KakaoMessageTemplate): Promise<boolean> {
    try {
      const templateData = await this.getTemplate(template.id);
      if (!templateData) {
        throw new Error(`Template not found: ${template.id}`);
      }

      const message = this.processTemplate(templateData, template.variables);
      return this.sendMessage(userId, message);
    } catch (error) {
      this.logger.error('Failed to send template message', error as Error);
      return false;
    }
  }

  private async getTemplate(templateId: string): Promise<string | null> {
    return this.redis.get(`kakao_template:${templateId}`);
  }

  private processTemplate(template: string, variables: Record<string, string>): KakaoMessage {
    let content = template;
    for (const [key, value] of Object.entries(variables)) {
      content = content.replace(`{{${key}}}`, value);
    }

    return {
      type: 'text',
      content
    };
  }

  async handleMessageStatus(messageId: string, status: string): Promise<void> {
    try {
      await this.redis.hset(`kakao_message_status:${messageId}`, {
        status,
        updatedAt: Date.now()
      });

      if (status === 'failed') {
        await this.handleFailedMessage(messageId);
      }
    } catch (error) {
      this.logger.error('Failed to update message status', error as Error);
    }
  }

  private async handleFailedMessage(messageId: string): Promise<void> {
    const message = await this.redis.get(`kakao_message:${messageId}`);
    if (!message) return;

    // Add to retry queue if eligible
    const retryCount = await this.redis.hincrby(`kakao_message_retry:${messageId}`, 'count', 1);
    if (retryCount <= 3) {
      await this.messageQueue.enqueue('kakao_message_retry', {
        messageId,
        retryCount,
        timestamp: Date.now()
      }, 2); // Higher priority for retries
    }
  }
}
