import { Redis } from '@upstash/redis';

interface Interaction {
  characterId: string;
  message: string;
  response: string;
  timestamp: Date;
}

interface MemoryConfig {
  maxHistoryLength?: number;
  ttl?: number;
}

export class ConversationMemory {
  private redis: Redis;
  private readonly maxHistory: number;
  private readonly ttl: number;

  constructor(
    config: MemoryConfig = {},
    redis = Redis.fromEnv()
  ) {
    this.redis = redis;
    this.maxHistory = config.maxHistoryLength ?? 50;
    this.ttl = config.ttl ?? 24 * 60 * 60; // 24 hours default
  }

  async storeInteraction(interaction: Interaction): Promise<void> {
    const key = `memory:${interaction.characterId}:history`;
    
    await this.redis.lpush(key, JSON.stringify({
      ...interaction,
      timestamp: interaction.timestamp.toISOString()
    }));

    // Trim to max length
    await this.redis.ltrim(key, 0, this.maxHistory - 1);
    
    // Set TTL
    await this.redis.expire(key, this.ttl);
  }

  async getRecentHistory(characterId: string): Promise<Interaction[]> {
    const key = `memory:${characterId}:history`;
    const history = await this.redis.lrange(key, 0, this.maxHistory - 1);
    
    return history.map(item => {
      const data = JSON.parse(item);
      return {
        ...data,
        timestamp: new Date(data.timestamp)
      };
    });
  }

  async clearHistory(characterId: string): Promise<void> {
    const key = `memory:${characterId}:history`;
    await this.redis.del(key);
  }
}
