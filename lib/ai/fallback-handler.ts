import { logError } from '@/lib/monitoring';
import { OpenAI } from 'openai';

interface FallbackStrategy {
  name: string;
  handler: (prompt: string, error: Error) => Promise<string>;
  priority: number;
}

export class AIFallbackHandler {
  private strategies: FallbackStrategy[] = [];
  private openai = new OpenAI();

  constructor() {
    this.registerDefaultStrategies();
  }

  registerStrategy(strategy: FallbackStrategy) {
    this.strategies.push(strategy);
    // Sort by priority
    this.strategies.sort((a, b) => a.priority - b.priority);
  }

  async handleWithFallback(prompt: string): Promise<string> {
    let lastError: Error | null = null;

    for (const strategy of this.strategies) {
      try {
        const result = await strategy.handler(prompt, lastError!);
        return result;
      } catch (error) {
        lastError = error as Error;
        logError(error as Error, {
          context: 'AI Fallback',
          strategy: strategy.name,
          prompt
        });
        continue;
      }
    }

    throw new Error('All fallback strategies failed');
  }

  private registerDefaultStrategies() {
    // Strategy 1: Try with GPT-4
    this.registerStrategy({
      name: 'gpt4',
      priority: 1,
      handler: async (prompt) => {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }]
        });
        return response.choices[0].message.content || '';
      }
    });

    // Strategy 2: Try with GPT-3.5-turbo
    this.registerStrategy({
      name: 'gpt35',
      priority: 2,
      handler: async (prompt) => {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }]
        });
        return response.choices[0].message.content || '';
      }
    });

    // Strategy 3: Use cached response if available
    this.registerStrategy({
      name: 'cached',
      priority: 3,
      handler: async (prompt) => {
        const cache = new AIResponseCache();
        const cached = await cache.getCachedResponse(prompt);
        if (cached) return cached.response;
        throw new Error('No cached response available');
      }
    });

    // Strategy 4: Basic fallback response
    this.registerStrategy({
      name: 'basic',
      priority: 4,
      handler: async () => {
        return "I'm having trouble processing your request right now. Please try again later.";
      }
    });
  }
}
