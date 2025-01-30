"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { MangaStoryGenerator } from "@/components/manga-story/manga-story-generator";
import { MangaStoryList } from "@/components/manga-story/manga-story-list";
import { useAuth } from "@/lib/auth/context";
import { useSubscriptionModal } from "@/hooks/use-subscription-modal";

export default function MangaStoryPage() {
  const { user } = useAuth();
  const { openModal } = useSubscriptionModal();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCreateStory = () => {
    if (!user?.isPremium) {
      openModal();
      return;
    }
    setIsGenerating(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f3e7ff] to-[#e7d1ff] dark:from-[#1a0f1f] dark:to-[#150c2e] py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Your Manga Story
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Create personalized manga stories based on your psychological profile
          </p>
          <Button 
            onClick={handleCreateStory}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Create New Story
          </Button>
        </div>

        {isGenerating ? (
          <MangaStoryGenerator onClose={() => setIsGenerating(false)} />
        ) : (
          <MangaStoryList />
        )}
      </div>
    </main>
  );
}
