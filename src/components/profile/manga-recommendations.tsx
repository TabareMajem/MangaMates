import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

const mockRecommendations = [
  {
    id: 1,
    title: "Solo Leveling",
    image: "/images/solo-leveling.png",
    match: 95
  },
  {
    id: 2,
    title: "Nano Machine",
    image: "/images/nano-machine.png",
    match: 90
  },
  {
    id: 3,
    title: "Volcanic Age",
    image: "/images/volcanic-age.png",
    match: 85
  }
];

export function MangaRecommendations() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Manga Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockRecommendations.map(manga => (
          <Card key={manga.id} className="relative overflow-hidden bg-white/10 backdrop-blur-sm border-none">
            <div className="aspect-[3/4] relative">
              <img 
                src={manga.image} 
                alt={manga.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 px-2 py-1 bg-primary/90 rounded-full text-xs font-medium">
                {manga.match}% Match
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-white mb-2">{manga.title}</h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full gap-2"
              >
                <Info className="w-4 h-4" />
                Why it matches?
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
