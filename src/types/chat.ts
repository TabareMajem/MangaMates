
export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
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

export interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
}

export interface ChatContextType {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
}

export type ChatAction = 
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'CLEAR_CHAT' };
