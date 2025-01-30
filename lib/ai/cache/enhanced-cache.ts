import { logError } from '@/lib/monitoring';
import { Redis } from '@upstash/redis';
import { createHash } from 'crypto';
import { ResponseAnalytics } from './response-analytics';

interface CacheConfig {
  ttl: number;
  maxSize: number;
  minHitRate: number;
}

interface CachedItem {
  value: any;
  timestamp: number;
  hits: number;
  lastAccessed: number;
  metadata: Record<string, any>;
}

export class EnhancedCache {
  private redis: Redis;
  private analytics: ResponseAnalytics;
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.redis = Redis.fromEnv();
    this.analytics = new ResponseAnalytics();
    this.config = {
      ttl: 24 * 60 * 60, // 24 hours
      maxSize: 10000,
      minHitRate: 0.1, // 10% hit rate minimum
      ...config
    };
  }

  async get<T>(key: string): Promise<T | null> {
    const start = Date.now();
    const cacheKey = this.generateKey(key);
    
    try {
      const item = await this.redis.get<CachedItem>(cacheKey);
      
      if (!item) {
        await this.analytics.recordMiss();
        return null;
      }

      // Update access patterns
      await this.updateAccessPattern(cacheKey, item);
      
      // Record analytics
      await this.analytics.recordHit(Date.now() - start);
      
      return item.value as T;
    } catch (error) {
      logError(error as Error, { context: 'Cache Get', key });
      return null;
    }
  }

  async set(key: string, value: any, metadata: Record<string, any> = {}): Promise<void> {
    const cacheKey = this.generateKey(key);
    const now = Date.now();

    const item: CachedItem = {
      value,
      timestamp: now,
      hits: 0,
      lastAccessed: now,
      metadata
    };

    try {
      // Check cache size before adding
      await this.ensureCacheSize();

      // Store the item
      await this.redis.set(cacheKey, item, { ex: this.config.ttl });
      
      // Update analytics
      await this.analytics.updateCacheSize(await this.getCacheSize());
      await this.analytics.updateEntryTimestamps(now);
    } catch (error) {
      logError(error as Error, { context: 'Cache Set', key });
    }
  }

  private async updateAccessPattern(key: string, item: CachedItem): Promise<void> {
    item.hits++;
    item.lastAccessed = Date.now();
    await this.redis.set(key, item, { ex: this.config.ttl });
  }

  private async ensureCacheSize(): Promise<void> {
    const size = await this.getCacheSize();
    if (size >= this.config.maxSize) {
      await this.evictItems();
    }
  }

  private async evictItems(): Promise<void> {
    const keys = await this.redis.keys('cache:*');
    const items = await Promise.all(
      keys.map(async key => {
        const item = await this.redis.get<CachedItem>(key);
        return { key, item };
      })
    );

    // Sort by hit rate and last accessed
    items.sort((a, b) => {
      if (!a.item || !b.item) return 0;
      const aScore = (a.item.hits / (Date.now() - a.item.timestamp)) * 
                    Math.log(Date.now() - a.item.lastAccessed);
      const bScore = (b.item.hits / (Date.now() - b.item.timestamp)) * 
                    Math.log(Date.now() - b.item.lastAccessed);
      return aScore - bScore;
    });

    // Remove bottom 10%
    const toRemove = items.slice(0, Math.ceil(items.length * 0.1));
    await Promise.all(
      toRemove.map(({ key }) => this.redis.del(key))
    );
  }

  private generateKey(key: string): string {
    const hash = createHash('md5').update(key).digest('hex');
    return `cache:${hash}`;
  }

  private async getCacheSize(): Promise<number> {
    const keys = await this.redis.keys('cache:*');
    return keys.length;
  }

  async getAnalytics() {
    return this.analytics.getAnalytics();
  }
}
