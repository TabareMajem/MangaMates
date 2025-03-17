import { logError } from '@/lib/monitoring';
import { withPerformanceTracking } from '@/lib/monitoring/performance';
import { Redis } from '@upstash/redis';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const redis = Redis.fromEnv();

export class AIService {
  static async analyzeJournalEntry(content: string, userId: string) {
    const cacheKey = `analysis:${userId}:${Buffer.from(content).toString('base64')}`;
    
    // Check cache first
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are an empathetic AI therapist analyzing journal entries."
          },
          {
            role: "user",
            content: `Analyze this journal entry and provide insights about emotional state, recurring themes, and potential areas for growth: ${content}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const analysis = {
        emotions: await this.extractEmotions(content),
        themes: await this.identifyThemes(content),
        insights: response.choices[0].message.content,
        timestamp: new Date().toISOString()
      };

      // Cache the result
      await redis.set(cacheKey, JSON.stringify(analysis), { ex: 86400 }); // 24 hours
      return analysis;
    } catch (error) {
      logError(error as Error, { userId, contentLength: content.length });
      throw error;
    }
  }

  private static async extractEmotions(content: string) {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "Extract and rate emotions from the text on a scale of 0-1."
        },
        {
          role: "user",
          content
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content!);
  }

  private static async identifyThemes(content: string) {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "Identify key themes and topics from the text."
        },
        {
          role: "user",
          content
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content!);
  }
}

// Add performance tracking
export const analyzeJournalEntry = withPerformanceTracking(
  'analyzeJournalEntry',
  AIService.analyzeJournalEntry
);
