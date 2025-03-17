import { logError } from '@/lib/monitoring';
import { Redis } from '@upstash/redis';

interface CacheAnalytics {
  hits: number;
  misses: number;
  hitRate: number;
  avgLatency: number;
  totalRequests: number;
  cacheSize: number;
  oldestEntry: Date;
  newestEntry: Date;
}

export class ResponseAnalytics {
  private redis: Redis;
  private readonly ANALYTICS_KEY = 'ai:cache:analytics';

  constructor() {
    this.redis = Redis.fromEnv();
  }

  async recordHit(latency: number) {
    await this.redis.hincrby(this.ANALYTICS_KEY, 'hits', 1);
    await this.updateLatencyStats(latency);
  }

  async recordMiss() {
    await this.redis.hincrby(this.ANALYTICS_KEY, 'misses', 1);
  }

  async getAnalytics(): Promise<CacheAnalytics> {
    const data = await this.redis.hgetall<Record<string, string>>(this.ANALYTICS_KEY);
    const hits = parseInt(data.hits || '0');
    const misses = parseInt(data.misses || '0');
    const totalRequests = hits + misses;

    return {
      hits,
      misses,
      hitRate: totalRequests > 0 ? hits / totalRequests : 0,
      avgLatency: parseFloat(data.avgLatency || '0'),
      totalRequests,
      cacheSize: parseInt(data.cacheSize || '0'),
      oldestEntry: new Date(parseInt(data.oldestEntry || Date.now().toString())),
      newestEntry: new Date(parseInt(data.newestEntry || Date.now().toString()))
    };
  }

  private async updateLatencyStats(latency: number) {
    try {
      const current = await this.redis.hget<string>(this.ANALYTICS_KEY, 'avgLatency');
      const currentAvg = parseFloat(current || '0');
      const totalHits = await this.redis.hget<string>(this.ANALYTICS_KEY, 'hits');
      const hits = parseInt(totalHits || '1');

      const newAvg = ((currentAvg * (hits - 1)) + latency) / hits;
      await this.redis.hset(this.ANALYTICS_KEY, { avgLatency: newAvg.toString() });
    } catch (error) {
      logError(error as Error, { context: 'Cache Analytics' });
    }
  }

  async updateCacheSize(size: number) {
    await this.redis.hset(this.ANALYTICS_KEY, { cacheSize: size.toString() });
  }

  async updateEntryTimestamps(timestamp: number) {
    const current = await this.redis.hgetall<Record<string, string>>(this.ANALYTICS_KEY);
    
    if (!current.oldestEntry || timestamp < parseInt(current.oldestEntry)) {
      await this.redis.hset(this.ANALYTICS_KEY, { oldestEntry: timestamp.toString() });
    }
    
    if (!current.newestEntry || timestamp > parseInt(current.newestEntry)) {
      await this.redis.hset(this.ANALYTICS_KEY, { newestEntry: timestamp.toString() });
    }
  }
}
