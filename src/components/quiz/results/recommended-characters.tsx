"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PRESET_CHARACTERS } from "@/data/preset-characters";
import type { AgentPersonality } from "@/types/agent";

interface RecommendedCharactersProps {
  traits: string[];
}

export function RecommendedCharacters({ traits }: RecommendedCharactersProps) {
  const recommendedCharacters = PRESET_CHARACTERS.filter(char =>
    char.traits.some(trait => traits.includes(trait))
  ).slice(0, 3);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recommended Characters</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendedCharacters.map((char) => (
          <CharacterCard key={char.name} character={char} />
        ))}
      </div>
    </Card>
  );
}

function CharacterCard({ character }: { character: AgentPersonality }) {
  return (
    <div className="p-4 rounded-lg border border-border">
      <img
        src={character.imageUrl}
        alt={character.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h4 className="font-medium mb-1">{character.name}</h4>
      <p className="text-sm text-muted-foreground mb-2">{character.anime}</p>
      <div className="flex flex-wrap gap-1">
        {character.traits.map(trait => (
          <span
            key={trait}
            className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
          >
            {trait}
          </span>
        ))}
      </div>
    </div>
  );
}
