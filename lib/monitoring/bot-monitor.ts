import { supabase } from '@/lib/supabase';
import { Redis } from '@upstash/redis';

interface BotMetrics {
  messageCount: number;
  responseTime: number;
  errorCount: number;
  uniqueUsers: number;
}

export class BotMonitor {
  private redis: Redis;

  constructor() {
    this.redis = Redis.fromEnv();
  }

  async trackInteraction(userId: string, platform: string, responseTime: number) {
    const date = new Date().toISOString().split('T')[0];
    const key = `bot:metrics:${date}`;

    // Update Redis metrics
    await Promise.all([
      this.redis.hincrby(key, 'messageCount', 1),
      this.redis.hset(key, 'lastResponseTime', responseTime),
      this.redis.sadd(`bot:users:${date}`, userId)
    ]);

    // Update database analytics
    await this.updateAnalytics(userId, platform, responseTime);
  }

  async updateAnalytics(userId: string, platform: string, responseTime: number) {
    const date = new Date().toISOString().split('T')[0];

    const { data: existing } = await supabase
      .from('conversation_analytics')
      .select()
      .eq('user_id', userId)
      .eq('date', date)
      .single();

    if (existing) {
      await supabase
        .from('conversation_analytics')
        .update({
          message_count: existing.message_count + 1,
          average_response_time: (existing.average_response_time * existing.message_count + responseTime) / (existing.message_count + 1)
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('conversation_analytics')
        .insert({
          user_id: userId,
          platform,
          message_count: 1,
          average_response_time: responseTime,
          date
        });
    }
  }

  async getDailyMetrics(date: string): Promise<BotMetrics> {
    const key = `bot:metrics:${date}`;
    const [metrics, uniqueUsers] = await Promise.all([
      this.redis.hgetall<Record<string, string>>(key),
      this.redis.scard(`bot:users:${date}`)
    ]);

    return {
      messageCount: parseInt(metrics.messageCount || '0'),
      responseTime: parseFloat(metrics.lastResponseTime || '0'),
      errorCount: parseInt(metrics.errorCount || '0'),
      uniqueUsers
    };
  }

  async trackError(error: Error) {
    const date = new Date().toISOString().split('T')[0];
    await this.redis.hincrby(`bot:metrics:${date}`, 'errorCount', 1);
    
    // Log error details
    await this.redis.lpush('bot:errors', JSON.stringify({
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack
    }));
  }
}
