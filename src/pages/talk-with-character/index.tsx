"use client";

import { CharacterFilters } from "@/components/character/character-filters";
import { CharacterGrid } from "@/components/character/character-grid";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { allCharacters, searchCharacters } from "@/lib/data/characters";
import { Search } from "lucide-react";
import { useState } from "react";

export default function TalkWithCharacterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Filter characters based on search and type
  const filteredCharacters = allCharacters.filter(char => {
    const matchesSearch = searchQuery === "" || 
      searchCharacters(searchQuery).includes(char);
    const matchesType = selectedType === "all" || char.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a0f1f] to-[#150c2e] py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Talk with Characters
          </h1>
          <p className="text-lg text-white/80">
            Have meaningful conversations with your favorite characters
          </p>
        </div>

        <Card className="p-6 bg-black/20 backdrop-blur-sm border-none mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search characters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <CharacterFilters
              selectedType={selectedType}
              onTypeChange={setSelectedType}
            />
          </div>
        </Card>

        <CharacterGrid characters={filteredCharacters} />
      </div>
    </main>
  );
}
