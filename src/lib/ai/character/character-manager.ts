import { MentalHealthHandler } from './mental-health-handler';
import { CBTSkills } from './cbt-skills';
import { CoachingSkills } from './coaching-skills';
import type { MangaCharacter } from '@/types/agent';

export class CharacterManager {
  private mentalHealth: MentalHealthHandler;
  private cbtSkills: CBTSkills;
  private coachingSkills: CoachingSkills;
  private character: MangaCharacter;

  constructor(character: MangaCharacter) {
    this.character = character;
    this.mentalHealth = new MentalHealthHandler();
    this.cbtSkills = new CBTSkills();
    this.coachingSkills = new CoachingSkills();
  }

  async generateResponse(message: string): Promise<string> {
    // Check for crisis signals first
    if (this.mentalHealth.checkForCrisisSignals(message)) {
      return this.mentalHealth.generateCrisisResponse();
    }

    // Assess mental state
    const mentalState = this.mentalHealth.assessMentalState(message);

    // Identify thought patterns
    const thoughtPatterns = this.cbtSkills.identifyThoughtPatterns(message);

    // Generate character-appropriate response
    let response = await this.generateCharacterResponse(message, mentalState);

    // Add CBT elements if needed
    if (Object.values(thoughtPatterns).some(Boolean)) {
      const cbtResponse = this.cbtSkills.generateCBTResponse(thoughtPatterns);
      response = this.blendWithCharacterVoice(response, cbtResponse);
    }

    // Add coping strategies if appropriate
    if (mentalState.emotionalState !== 'neutral') {
      const strategies = this.cbtSkills.suggestCopingStrategies(mentalState.emotionalState);
      response = this.addCopingStrategies(response, strategies);
    }

    return response;
  }

  private async generateCharacterResponse(message: string, mentalState: any): Promise<string> {
    // Use character's personality and prompt template
    const response = `${this.character.promptTemplate}\n\nIn response to: ${message}`;
    
    // TODO: Implement actual AI response generation
    return response;
  }

  private blendWithCharacterVoice(baseResponse: string, therapeuticResponse: string): string {
    // Adapt therapeutic response to match character's personality
    const characterStyle = this.character.traits.join(', ');
    return `${baseResponse}\n\nIn my experience as someone who is ${characterStyle}, ${therapeuticResponse}`;
  }

  private addCopingStrategies(response: string, strategies: string[]): string {
    if (!strategies.length) return response;

    const suggestion = strategies[Math.floor(Math.random() * strategies.length)];
    return `${response}\n\nYou know, something that helps me is: ${suggestion}`;
  }
}
