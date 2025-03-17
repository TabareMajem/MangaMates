import type { MangaCharacter } from '@/types/agent';
import { ResponseGenerator } from './response-generator';

export class CharacterFactory {
  private static instances: Map<string, ResponseGenerator> = new Map();

  static getCharacterInstance(character: MangaCharacter): ResponseGenerator {
    if (!this.instances.has(character.id)) {
      this.instances.set(character.id, new ResponseGenerator(character));
    }
    return this.instances.get(character.id)!;
  }

  static clearInstance(characterId: string): void {
    this.instances.delete(characterId);
  }
}
