import { Logger } from '@/lib/monitoring/logger';
import { Redis } from '@upstash/redis';

interface CacheConfig {
  defaultTTL: number;
  maxKeys: number;
  invalidationBatchSize: number;
}

interface CachePattern {
  pattern: string;
  ttl: number;
}

export class CacheManager {
  private redis: Redis;
  private logger: Logger;
  private config: CacheConfig;
  private patterns: CachePattern[];

  constructor() {
    this.redis = Redis.fromEnv();
    this.logger = new Logger();
    this.config = {
      defaultTTL: 3600, // 1 hour
      maxKeys: 10000,
      invalidationBatchSize: 100
    };

    this.patterns = [
      { pattern: 'user:*', ttl: 3600 },
      { pattern: 'conversation:*', ttl: 1800 },
      { pattern: 'message:*', ttl: 900 },
      { pattern: 'analytics:*', ttl: 7200 }
    ];
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      await this.redis.set(key, JSON.stringify(value), {
        ex: ttl || this.getPatternTTL(key)
      });

      await this.enforceKeyLimit();
    } catch (error) {
      this.logger.error('Cache set failed', error as Error);
      throw error;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get<string>(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error('Cache get failed', error as Error);
      return null;
    }
  }

  async invalidate(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      
      // Process in batches to avoid blocking
      for (let i = 0; i < keys.length; i += this.config.invalidationBatchSize) {
        const batch = keys.slice(i, i + this.config.invalidationBatchSize);
        await Promise.all(batch.map(key => this.redis.del(key)));
      }

      this.logger.info('Cache invalidation complete', {
        pattern,
        keysInvalidated: keys.length
      });
    } catch (error) {
      this.logger.error('Cache invalidation failed', error as Error);
      throw error;
    }
  }

  async invalidateAll(): Promise<void> {
    try {
      await this.redis.flushall();
      this.logger.info('Complete cache invalidation');
    } catch (error) {
      this.logger.error('Complete cache invalidation failed', error as Error);
      throw error;
    }
  }

  private getPatternTTL(key: string): number {
    const pattern = this.patterns.find(p => 
      new RegExp(p.pattern.replace('*', '.*')).test(key)
    );
    return pattern?.ttl || this.config.defaultTTL;
  }

  private async enforceKeyLimit(): Promise<void> {
    const keyCount = await this.redis.dbsize();
    
    if (keyCount > this.config.maxKeys) {
      const keysToRemove = keyCount - this.config.maxKeys;
      const keys = await this.redis.keys('*');
      
      // Sort by TTL and remove keys closest to expiration
      const keysByTTL = await Promise.all(
        keys.map(async key => ({
          key,
          ttl: await this.redis.ttl(key)
        }))
      );

      const keysToDelete = keysByTTL
        .sort((a, b) => a.ttl - b.ttl)
        .slice(0, keysToRemove)
        .map(k => k.key);

      await Promise.all(keysToDelete.map(key => this.redis.del(key)));
    }
  }
}
