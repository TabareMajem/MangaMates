import { CharacterManager } from './character-manager';
import type { MangaCharacter } from '@/types/agent';

export class ResponseGenerator {
  private characterManager: CharacterManager;
  private conversationHistory: string[] = [];

  constructor(character: MangaCharacter) {
    this.characterManager = new CharacterManager(character);
  }

  async generateResponse(message: string): Promise<string> {
    // Add message to history
    this.conversationHistory.push(message);

    // Generate response
    const response = await this.characterManager.generateResponse(message);

    // Add response to history
    this.conversationHistory.push(response);

    // Trim history if too long
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }

    return response;
  }

  getConversationHistory(): string[] {
    return [...this.conversationHistory];
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }
}
