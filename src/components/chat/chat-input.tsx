"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useChatContext } from "@/lib/chat/chat-context";

interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const { state: { isTyping } } = useChatContext();

  const handleSend = async () => {
    if (!message.trim() || disabled || isTyping) return;
    
    const currentMessage = message;
    setMessage(""); // Clear input immediately
    
    try {
      await onSend(currentMessage);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessage(currentMessage); // Restore message if send fails
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
        disabled={disabled || isTyping}
        className="bg-white/5 focus:ring-primary/50"
      />
      <Button 
        onClick={handleSend}
        disabled={disabled || isTyping || !message.trim()}
        className="bg-primary hover:bg-primary/90 transition-colors"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
