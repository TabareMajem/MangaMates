import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const mockCharacters = [
  {
    id: 1,
    name: "Maki Shijo",
    image: "/images/image-14.png",
    match: 95
  },
  {
    id: 2,
    name: "Yu Takasaki",
    image: "/images/image-15.png",
    match: 90
  },
  {
    id: 3,
    name: "Anna",
    image: "/images/image-16.png",
    match: 85
  }
];

export function CharacterChat() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Talk With Characters</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockCharacters.map(character => (
          <Card key={character.id} className="relative overflow-hidden bg-white/10 backdrop-blur-sm border-none">
            <div className="aspect-square relative">
              <img 
                src={character.image} 
                alt={character.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 px-2 py-1 bg-primary/90 rounded-full text-xs font-medium">
                {character.match}% Match
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-white mb-2">{character.name}</h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Start Chat
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
