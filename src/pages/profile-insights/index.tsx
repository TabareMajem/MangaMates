"use client";

import { useState, useEffect } from 'react';
import { ProfileSidebar } from "@/components/profile/profile-sidebar";
import { AssessmentCards } from "@/components/profile/assessment-cards";
import { InsightsDashboard } from "@/components/profile/insights-dashboard";
import { MangaStorySection } from "@/components/profile/manga-story-section";
import { MangaRecommendations } from "@/components/profile/manga-recommendations";
import { CharacterChat } from "@/components/profile/character-chat";
import type { MangaStory } from "@/types/manga";
import { mangaStoryService } from "@/lib/services/manga-story";

export default function ProfileInsightsPage() {
  const [stories, setStories] = useState<MangaStory[]>([]);

  useEffect(() => {
    const loadStories = async () => {
      const userStories = await mangaStoryService.getUserStories();
      setStories(userStories);
    };

    loadStories();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a0f1f] to-[#150c2e] py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          <ProfileSidebar />
          <div className="space-y-8">
            <AssessmentCards />
            <InsightsDashboard />
            <MangaStorySection stories={stories} />
            <MangaRecommendations />
            <CharacterChat />
          </div>
        </div>
      </div>
    </main>
  );
}
