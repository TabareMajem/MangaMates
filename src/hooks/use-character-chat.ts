"use client";

import { useCallback } from 'react';
import { characterChatService } from '@/lib/services/character-chat';
import { useAuth } from '@/lib/auth/context';
import { useToast } from './use-toast';
import { useChatContext } from '@/lib/chat/chat-context';

export function useCharacterChat(characterId: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { state, dispatch } = useChatContext();

  const sendMessage = useCallback(async (content: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to chat",
        variant: "destructive"
      });
      return;
    }

    try {
      // Add user message immediately
      dispatch({ 
        type: 'ADD_MESSAGE', 
        payload: { role: 'user', content } 
      });
      
      // Show typing indicator
      dispatch({ type: 'SET_TYPING', payload: true });

      // Get AI response
      const response = await characterChatService.sendMessage(characterId, user.id, content);
      
      // Add AI response
      dispatch({ 
        type: 'ADD_MESSAGE', 
        payload: response 
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      dispatch({ type: 'SET_TYPING', payload: false });
    }
  }, [characterId, user, toast, dispatch]);

  return {
    messages: state.messages,
    isTyping: state.isTyping,
    sendMessage
  };
}
