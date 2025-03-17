"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth/context";
import { useSubscriptionModal } from "@/hooks/use-subscription-modal";
import type { MangaStory } from "@/types/manga";

interface MangaStorySectionProps {
  stories: MangaStory[];
}

export function MangaStorySection({ stories }: MangaStorySectionProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openModal } = useSubscriptionModal();

  const handleCreateStory = () => {
    if (!user?.isPremium) {
      openModal();
      return;
    }
    navigate('/manga-story');
  };

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-sm border-none">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Your Manga Stories</h3>
        <Button 
          onClick={handleCreateStory}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Create Story
        </Button>
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            No stories yet. Create your first manga story based on your personality!
          </p>
          <Button 
            variant="outline" 
            onClick={handleCreateStory}
          >
            Get Started
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stories.slice(0, 2).map((story) => (
            <Card 
              key={story.id} 
              className="overflow-hidden bg-black/20 backdrop-blur-sm border-none"
            >
              <img 
                src={story.panels[0].imageUrl} 
                alt={story.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="font-semibold mb-2">{story.title}</h4>
                <p className="text-sm text-muted-foreground">
                  Created on {new Date(story.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {stories.length > 2 && (
        <Button 
          variant="link" 
          onClick={() => navigate('/manga-story')}
          className="w-full mt-4"
        >
          View All Stories
        </Button>
      )}
    </Card>
  );
}
