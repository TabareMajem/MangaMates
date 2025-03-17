"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Search, Filter } from "lucide-react";
import { allCharacters, searchCharacters } from "@/lib/data/characters";

export default function CharacterListPage() {
  const navigate = useNavigate();
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Characters</h1>
          
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search characters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="all">All Types</option>
              <option value="anime">Anime</option>
              <option value="manhwa">Manhwa</option>
              <option value="idol">K-pop</option>
            </select>
          </div>

          {/* Character Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCharacters.map((character) => (
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
                <p className="text-sm text-muted-foreground mb-4">
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
        </div>
      </div>
    </main>
  );
}
