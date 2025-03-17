"use client";

import { useEffect, useRef } from "react";
import { ChatMessage } from "./chat-message";
import { useChatContext } from "@/lib/chat/chat-context";
import type { MangaCharacter } from "@/types/agent";

interface MessageListProps {
  character: MangaCharacter;
}

export function MessageList({ character }: MessageListProps) {
  const { state: { messages, isTyping } } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="h-[500px] mb-4 overflow-y-auto space-y-4 custom-scrollbar">
      {messages.map((msg, i) => (
        <ChatMessage
          key={i}
          content={msg.content}
          role={msg.role}
          character={msg.role === 'assistant' ? character : undefined}
        />
      ))}
      {isTyping && (
        <ChatMessage
          content=""
          role="assistant"
          character={character}
          isTyping
        />
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
