import type { Character } from '@/types';
import { CharacterAgent } from './character-agent';
import { ConversationMemory } from './memory/conversation-memory';
import { AIServiceManager } from './service/ai-service-manager';

export class LineAgent extends CharacterAgent {
  constructor(
    character: Character,
    memory: ConversationMemory,
    aiService: AIServiceManager,
    private lineClient: any // Replace with proper LINE client type
  ) {
    super(character, memory, aiService);
  }

  async handleLineMessage(message: string): Promise<void> {
    try {
      const response = await this.processMessage(message);
      await this.lineClient.replyMessage(response.content);
    } catch (error) {
      console.error('Line agent error:', error);
      throw error;
    }
  }
}

export const lineAgent = new LineAgent();
