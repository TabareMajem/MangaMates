import { Redis } from '@upstash/redis';

export class RedisCache {
  private redis: Redis;
  private prefix: string;

  constructor(prefix = 'app:') {
    this.redis = Redis.fromEnv();
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(this.getKey(key));
    return data as T;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const fullKey = this.getKey(key);
    if (ttl) {
      await this.redis.set(fullKey, value, { ex: ttl });
    } else {
      await this.redis.set(fullKey, value);
    }
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(this.getKey(key));
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(this.getKey(pattern));
    if (keys.length > 0) {
      await this.redis.del(keys);
    }
  }
}

// Create cache instances for different purposes
export const journalCache = new RedisCache('journal:');
export const analyticsCache = new RedisCache('analytics:');
export const userCache = new RedisCache('user:');
