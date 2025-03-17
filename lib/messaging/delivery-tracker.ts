import { Logger } from '@/lib/monitoring/logger';
import { Redis } from '@upstash/redis';
import { WebhookRetryManager } from '../webhooks/retry-manager';

interface DeliveryStatus {
  messageId: string;
  platform: 'line' | 'kakao';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: number;
  attempts: number;
  error?: string;
}

export class MessageDeliveryTracker {
  private redis: Redis;
  private logger: Logger;
  private retryManager: WebhookRetryManager;

  constructor() {
    this.redis = Redis.fromEnv();
    this.logger = new Logger();
    this.retryManager = new WebhookRetryManager();
  }

  async trackDelivery(messageId: string, platform: 'line' | 'kakao', status: DeliveryStatus['status']): Promise<void> {
    try {
      const deliveryStatus: DeliveryStatus = {
        messageId,
        platform,
        status,
        timestamp: Date.now(),
        attempts: await this.getDeliveryAttempts(messageId)
      };

      await this.redis.hset(
        `message_delivery:${messageId}`,
        deliveryStatus
      );

      if (status === 'failed') {
        await this.handleFailedDelivery(messageId, platform);
      }

      // Store for analytics
      await this.storeDeliveryMetrics(deliveryStatus);
    } catch (error) {
      this.logger.error('Failed to track message delivery', error as Error);
    }
  }

  private async handleFailedDelivery(messageId: string, platform: 'line' | 'kakao'): Promise<void> {
    const attempts = await this.incrementDeliveryAttempts(messageId);
    
    if (attempts <= 3) {
      // Schedule retry
      await this.retryManager.scheduleRetry(
        messageId,
        `${platform}_message_retry`,
        { messageId },
        new Error('Delivery failed')
      );
    } else {
      // Mark as permanently failed
      await this.markDeliveryFailed(messageId, 'Max retry attempts exceeded');
    }
  }

  private async getDeliveryAttempts(messageId: string): Promise<number> {
    const attempts = await this.redis.get(`message_delivery_attempts:${messageId}`);
    return parseInt(attempts || '0');
  }

  private async incrementDeliveryAttempts(messageId: string): Promise<number> {
    return this.redis.incr(`message_delivery_attempts:${messageId}`);
  }

  private async markDeliveryFailed(messageId: string, reason: string): Promise<void> {
    await this.redis.hset(`message_delivery:${messageId}`, {
      status: 'failed',
      error: reason,
      updatedAt: Date.now()
    });
  }

  private async storeDeliveryMetrics(status: DeliveryStatus): Promise<void> {
    const key = `delivery_metrics:${status.platform}:${new Date().toISOString().split('T')[0]}`;
    
    await this.redis.hincrby(key, status.status, 1);
    await this.redis.expire(key, 30 * 24 * 60 * 60); // 30 days retention
  }

  async getDeliveryStatus(messageId: string): Promise<DeliveryStatus | null> {
    const status = await this.redis.hgetall(`message_delivery:${messageId}`);
    return status ? status as DeliveryStatus : null;
  }

  async getDeliveryMetrics(platform: 'line' | 'kakao', date: string): Promise<Record<string, number>> {
    return this.redis.hgetall(`delivery_metrics:${platform}:${date}`);
  }
}
