import type { Character, CharacterResponse, CharacterState } from '@/types';
import { Redis } from '@upstash/redis';
import OpenAI from 'openai';
import { ErrorHandler } from '../../error/error-handler';
import { RateLimiter } from '../../middleware/rate-limiter';

interface GenerateConfig {
  character: Character;
  state: CharacterState;
  history: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
}

export class AIServiceManager {
  private openai: OpenAI;
  private rateLimiter: RateLimiter;
  private errorHandler: ErrorHandler;
  private redis: Redis;

  constructor(
    openai = new OpenAI(),
    rateLimiter = new RateLimiter({ redis: Redis.fromEnv() }),
    errorHandler = new ErrorHandler(),
    redis = Redis.fromEnv()
  ) {
    this.openai = openai;
    this.rateLimiter = rateLimiter;
    this.errorHandler = errorHandler;
    this.redis = redis;
  }

  async generateResponse(
    message: string,
    config: GenerateConfig
  ): Promise<CharacterResponse> {
    try {
      await this.rateLimiter.checkLimit(config.character.id);
      
      const cacheKey = this.generateCacheKey(message, config);
      const cached = await this.getCachedResponse(cacheKey);
      
      if (cached) {
        return JSON.parse(cached);
      }

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: this.generateSystemPrompt(config) },
          ...this.formatHistory(config.history),
          { role: 'user', content: message }
        ]
      });

      const result: CharacterResponse = {
        content: response.choices[0].message.content || '',
        mood: this.analyzeMood(response.choices[0].message.content || ''),
        actions: this.extractActions(response.choices[0].message.content || '')
      };

      await this.cacheResponse(cacheKey, JSON.stringify(result));
      return result;
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'ai.generate',
        message,
        character: config.character.id
      });
      throw error;
    }
  }

  private generateSystemPrompt(config: GenerateConfig): string {
    return `You are ${config.character.name} from ${config.character.series}.
      Personality: ${config.character.personality.traits.join(', ')}
      Background: ${config.character.personality.background}
      Speaking Style: ${config.character.personality.speakingStyle}
      Current Mood: ${config.state.mood}
      Energy Level: ${config.state.energy}
      Respond in character, maintaining consistent personality and style.`;
  }

  private formatHistory(history: any[]): { role: 'user' | 'assistant', content: string }[] {
    return history.map((item, index) => ({
      role: index % 2 === 0 ? 'user' : 'assistant',
      content: item.message || item.response
    }));
  }

  private analyzeMood(_response: string): string {
    // Implementation coming soon
    return 'neutral';
  }

  private extractActions(_response: string): CharacterResponse['actions'] {
    // Implementation coming soon
    return [];
  }

  private generateCacheKey(message: string, config: GenerateConfig): string {
    return `ai:response:${config.character.id}:${Buffer.from(message).toString('base64')}`;
  }

  private async getCachedResponse(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  private async cacheResponse(key: string, response: string): Promise<void> {
    await this.redis.set(key, response, { ex: 3600 }); // Cache for 1 hour
  }
}
