import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import type { MangaCharacter } from "@/types/agent";

interface ChatMessageProps {
  content: string;
  role: 'user' | 'assistant';
  character?: MangaCharacter;
  isTyping?: boolean;
}

export function ChatMessage({ content, role, character, isTyping }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex w-full gap-2 py-2",
        role === 'user' ? "justify-end" : "justify-start"
      )}
    >
      {role === 'assistant' && character && (
        <Avatar className="h-8 w-8">
          <img 
            src={character.imageUrl} 
            alt={character.name} 
            className="h-full w-full object-cover"
          />
        </Avatar>
      )}

      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2",
          role === 'user' 
            ? "bg-primary text-primary-foreground" 
            : "bg-secondary"
        )}
      >
        {isTyping ? (
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{content}</p>
        )}
      </div>

      {role === 'user' && (
        <Avatar className="h-8 w-8">
          <img 
            src="/images/default-avatar.png" 
            alt="User" 
            className="h-full w-full object-cover"
          />
        </Avatar>
      )}
    </div>
  );
}
