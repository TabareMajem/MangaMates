"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { MangaCharacter } from "@/types/agent";

interface CharacterGridProps {
  characters: MangaCharacter[];
}

export function CharacterGrid({ characters }: CharacterGridProps) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {characters.map((character) => (
        <Card key={character.id} className="p-6 bg-white/10 backdrop-blur-sm border-none">
          <img
            src={character.imageUrl}
            alt={character.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h3 className="text-xl font-semibold mb-2">{character.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{character.series}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {character.personalityTraits.map((trait) => (
              <span
                key={trait}
                className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
              >
                {trait}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {character.background}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/character/${character.id}`)}
              className="flex-1"
            >
              View Profile
            </Button>
            <Button
              onClick={() => navigate(`/talk-with-character/${character.id}`)}
              className="flex-1"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
