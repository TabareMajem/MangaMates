"use client";

import { createContext, useContext, useReducer } from 'react';
import type { ChatMessage } from '@/types/chat';

interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
}

type ChatAction = 
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'CLEAR_CHAT' };

const ChatContext = createContext<{
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
} | null>(null);

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload
      };
    case 'CLEAR_CHAT':
      return {
        messages: [],
        isTyping: false
      };
    default:
      return state;
  }
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, {
    messages: [],
    isTyping: false
  });

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
