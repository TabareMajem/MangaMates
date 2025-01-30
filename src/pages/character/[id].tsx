"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { PRESET_CHARACTERS } from "@/data/preset-characters";
import { MessageCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function CharacterProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const character = PRESET_CHARACTERS.find(char => char.id === id);

  if (!character) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#1a0f1f] to-[#150c2e] py-16">
        <div className="container mx-auto px-4">
          <Card className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Character Not Found</h2>
            <p className="text-muted-foreground">This character doesn't exist or has been removed.</p>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a0f1f] to-[#150c2e] py-16">
      <div className="container mx-auto px-4">
        <Card className="p-8 bg-black/20 backdrop-blur-sm border-none">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <Image
                src={character.imageUrl}
                alt={character.name}
                width={300}
                height={300}
                className="w-full rounded-lg object-cover aspect-square"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{character.name}</h1>
              <p className="text-lg text-muted-foreground mb-4">{character.series}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {character.personalityTraits.map((trait) => (
                  <span
                    key={trait}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                  >
                    {trait}
                  </span>
                ))}
              </div>

              <p className="text-muted-foreground mb-8">{character.background}</p>

              <Button 
                onClick={() => navigate(`/talk-with-character/${character.id}`)}
                className="w-full md:w-auto"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Conversation
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
