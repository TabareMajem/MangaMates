import type { MangaCharacter } from './agent';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  character?: MangaCharacter;
}

export interface ChatSession {
  id: string;
  characterId: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CharacterShare {
  id: string;
  characterId: string;
  sharedBy: string;
  shareToken: string;
  expiresAt: Date;
  createdAt: Date;
}