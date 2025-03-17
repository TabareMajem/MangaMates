import { useChatContext } from "@/lib/chat/chat-context";
import type { ChatMessage } from "@/types/chat";

export function useChat() {
  const { state, dispatch } = useChatContext();

  const addMessage = (message: ChatMessage) => {
    dispatch({ type: 'ADD_MESSAGE', payload: message });
  };

  const setTyping = (isTyping: boolean) => {
    dispatch({ type: 'SET_TYPING', payload: isTyping });
  };

  const clearChat = () => {
    dispatch({ type: 'CLEAR_CHAT' });
  };

  const sendMessage = async (content: string): Promise<string> => {
    try {
      setTyping(true);
      // Here you would typically make an API call to your backend
      // For now, we'll just echo the message back
      const response = await new Promise<string>(resolve => 
        setTimeout(() => resolve(content), 1000)
      );
      
      return response;
    } finally {
      setTyping(false);
    }
  };

  return {
    messages: state.messages,
    isTyping: state.isTyping,
    addMessage,
    setTyping,
    clearChat,
    sendMessage,
  };
} 