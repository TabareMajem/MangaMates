"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import type { AgentPersonality } from "@/types/agent";

const PRESET_CHARACTERS: AgentPersonality[] = [
  {
    name: "Goku",
    anime: "Dragon Ball",
    traits: ["Determined", "Optimistic", "Competitive"],
    background: "A Saiyan warrior dedicated to becoming stronger and protecting Earth.",
    imageUrl: "https://images.unsplash.com/photo-1635805737707-575885ab0820"
  },
  {
    name: "Kakashi Hatake",
    anime: "Naruto",
    traits: ["Strategic", "Calm", "Wise"],
    background: "A skilled ninja and teacher who values teamwork and loyalty.",
    imageUrl: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586"
  }
];

interface PersonalityStepProps {
  onNext: () => void;
  onSelect: (personality: AgentPersonality) => void;
  selected: AgentPersonality | null;
}

export function PersonalityStep({ onNext, onSelect, selected }: PersonalityStepProps) {
  const [search, setSearch] = useState("");

  const filteredCharacters = PRESET_CHARACTERS.filter(char => 
    char.name.toLowerCase().includes(search.toLowerCase()) ||
    char.anime.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search characters..."
          className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredCharacters.map((char) => (
          <div
            key={char.name}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selected?.name === char.name 
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => onSelect(char)}
          >
            <div className="aspect-square rounded-lg overflow-hidden mb-4">
              <img 
                src={char.imageUrl} 
                alt={char.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-semibold mb-1">{char.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{char.anime}</p>
            <div className="flex flex-wrap gap-2">
              {char.traits.map(trait => (
                <span
                  key={trait}
                  className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!selected}
        >
          Next Step
        </Button>
      </div>
    </div>
  );
}
