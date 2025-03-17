"use client";

import { AnalysisResults } from "@/components/social/analysis-results";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth/context";
import { InstagramService } from "@/lib/services/instagram-service";
import { TwitterService } from "@/lib/services/twitter-service";
import type { ContentAnalysis, PersonalityInsight, EmotionalPattern } from "@/types/social-media";
import { Instagram, Twitter } from "lucide-react";
import { useState } from 'react';

interface SocialMediaAnalysis {
  contentAnalysis: ContentAnalysis;
  personalityInsights: PersonalityInsight[];
  emotionalPatterns: EmotionalPattern[];
}

function transformAnalysisData(analysis: SocialMediaAnalysis) {
  return {
    personality: analysis.personalityInsights.map(insight => ({
      trait: insight.trait,
      score: insight.score
    })),
    emotions: analysis.emotionalPatterns.map(pattern => ({
      date: new Date().toISOString(),
      joy: pattern.emotion === 'joy' ? pattern.intensity : 0,
      sadness: pattern.emotion === 'sadness' ? pattern.intensity : 0,
      anxiety: pattern.emotion === 'anxiety' ? pattern.intensity : 0
    })),
    interests: analysis.contentAnalysis.topics,
    recommendations: {
      manga: [],
      characters: []
    }
  };
}

export default function SocialMediaAnalyzerPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPlatform, setSelectedPlatform] = useState<'instagram' | 'twitter' | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SocialMediaAnalysis | null>(null);
  
  const handleConnect = async (platform: 'instagram' | 'twitter') => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use this feature",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      if (platform === 'instagram') {
        const { authUrl } = await InstagramService.authorize();
        window.location.href = authUrl;
      } else {
        const { authUrl } = await TwitterService.authorize();
        window.location.href = authUrl;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to platform",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f3e7ff] to-[#e7d1ff] dark:from-[#1a0f1f] dark:to-[#150c2e] py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Social Media Analyzer
          </h1>
          <p className="text-lg text-white/80">
            Connect your social media accounts to discover your online personality
          </p>
        </div>

        <Card className="p-8 bg-white/10 backdrop-blur-sm border-none">
          <div className="flex gap-4 justify-center mb-8">
            <Button
              variant={selectedPlatform === 'instagram' ? 'default' : 'outline'}
              className="gap-2"
              onClick={() => setSelectedPlatform('instagram')}
            >
              <Instagram className="h-5 w-5" />
              Instagram
            </Button>
            <Button
              variant={selectedPlatform === 'twitter' ? 'default' : 'outline'}
              className="gap-2"
              onClick={() => setSelectedPlatform('twitter')}
            >
              <Twitter className="h-5 w-5" />
              Twitter/X
            </Button>
          </div>

          {selectedPlatform && (
            <div className="space-y-4">
              <Button 
                className="w-full"
                onClick={() => handleConnect(selectedPlatform)}
                disabled={loading}
              >
                {loading ? "Connecting..." : `Connect ${selectedPlatform}`}
              </Button>
            </div>
          )}
        </Card>

        {analysis && <AnalysisResults data={transformAnalysisData(analysis)} />}
      </div>
    </main>
  );
}
