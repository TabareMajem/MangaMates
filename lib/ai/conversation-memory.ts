interface Memory {
  userId: string;
  context: string[];
  lastInteraction: Date;
}

export class ConversationMemory {
  private redis: Redis;

  constructor() {
    this.redis = Redis.fromEnv();
  }

  async addToMemory(userId: string, interaction: string) {
    const key = `memory:${userId}`;
    const memory = await this.getMemory(userId);

    memory.context.push(interaction);
    memory.lastInteraction = new Date();

    // Keep only last N interactions
    if (memory.context.length > 10) {
      memory.context = memory.context.slice(-10);
    }

    await this.redis.set(key, JSON.stringify(memory), {
      ex: 24 * 60 * 60 // 24 hours
    });
  }

  async getMemory(userId: string): Promise<Memory> {
    const key = `memory:${userId}`;
    const stored = await this.redis.get(key);

    return stored ? JSON.parse(stored) : {
      userId,
      context: [],
      lastInteraction: new Date()
    };
  }
}
