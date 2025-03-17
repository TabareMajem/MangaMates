import { EmotionState } from './emotion';

export interface ConversationContext {
  userMessage: string;
  previousMessages: Array<{
    content: string;
    role: 'user' | 'assistant';
    timestamp: string;
  }>;
  currentEmotion: EmotionState;
  userSentiment: number;
  timestamp: string;
}
