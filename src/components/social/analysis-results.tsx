"use client";

import { Card } from "@/components/ui/card";
import { PersonalityRadar } from "@/components/visualizations/personality-radar";
import { EmotionTimeline } from "@/components/visualizations/emotion-timeline";

interface AnalysisResultsProps {
  data: {
    personality: {
      trait: string;
      score: number;
    }[];
    emotions: {
      date: string;
      joy: number;
      sadness: number;
      anxiety: number;
    }[];
    interests: string[];
    recommendations: {
      manga: string[];
      characters: string[];
    };
  };
}

export function AnalysisResults({ data }: AnalysisResultsProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Personality Profile</h2>
        <PersonalityRadar data={data.personality} />
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Emotional Journey</h2>
        <EmotionTimeline data={data.emotions} />
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {data.interests.map((interest) => (
              <span
                key={interest}
                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Manga & Anime</h3>
              <ul className="list-disc list-inside text-muted-foreground">
                {data.recommendations.manga.map((title) => (
                  <li key={title}>{title}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Characters</h3>
              <ul className="list-disc list-inside text-muted-foreground">
                {data.recommendations.characters.map((character) => (
                  <li key={character}>{character}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
