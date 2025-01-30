"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { mangaStoryService } from "@/lib/services/manga-story";
import type { MangaStory } from "@/types/manga";

export function MangaStoryList() {
  const [stories, setStories] = useState<MangaStory[]>([]);

  useEffect(() => {
    const loadStories = async () => {
      const userStories = await mangaStoryService.getUserStories();
      setStories(userStories);
    };

    loadStories();
  }, []);

  if (!stories.length) {
    return (
      <Card className="p-8 text-center bg-white/10 backdrop-blur-sm border-none">
        <p className="text-muted-foreground">No stories yet. Create your first manga story!</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map((story) => (
        <Card key={story.id} className="overflow-hidden bg-white/10 backdrop-blur-sm border-none">
          <div className="aspect-[3/4] relative">
            <img 
              src={story.panels[0].imageUrl} 
              alt={story.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-xl font-bold text-white mb-2">{story.title}</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/80">
                  {new Date(story.createdAt).toLocaleDateString()}
                </span>
                <Button variant="ghost" size="icon" className="text-white hover:text-primary">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
