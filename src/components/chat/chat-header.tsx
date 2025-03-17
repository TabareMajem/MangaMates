"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessagingButtons } from "./messaging-buttons";
import type { MangaCharacter } from "@/types/agent";
import { useAuth } from "@/lib/auth/context";

interface ChatHeaderProps {
  character: MangaCharacter;
  onShare: () => void;
  onMessagingClick: (type: 'line' | 'kakao') => void;
}

export function ChatHeader({ character, onShare, onMessagingClick }: ChatHeaderProps) {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={character.imageUrl}
            alt={character.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          {user?.isPremium && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{character.name}</h2>
          <p className="text-sm text-muted-foreground">{character.series}</p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onShare}
          className="hover:bg-primary/10"
        >
          <Share2 className="h-4 w-4" />
        </Button>
        <MessagingButtons 
          characterId={character.id}
          characterName={character.name}
          onMessagingClick={onMessagingClick}
        />
      </div>
    </div>
  );
}
