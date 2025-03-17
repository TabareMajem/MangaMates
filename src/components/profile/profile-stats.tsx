"use client";

import { Card } from "@/components/ui/card";
import { RadarChart } from "../charts/radar-chart";
import { Speedometer } from "../charts/speedometer";
import type { PersonalityProfile } from "@/types/profile";

interface ProfileStatsProps {
  profile: PersonalityProfile;
}

export function ProfileStats({ profile }: ProfileStatsProps) {
  const radarData = {
    labels: ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism"],
    datasets: [
      {
        data: [
          profile.bigFivePersonalities[0]?.openness || 0,
          profile.bigFivePersonalities[0]?.conscientiousness || 0,
          profile.bigFivePersonalities[0]?.extraversion || 0,
          profile.bigFivePersonalities[0]?.agreeableness || 0,
          profile.bigFivePersonalities[0]?.neuroticism || 0,
        ],
      },
    ],
  };

  const mentalHealthScore = profile.mentalHealths[0]?.overallScore || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6 bg-white/10 backdrop-blur-sm border-none">
        <h3 className="text-lg font-semibold text-white mb-4">Personality Profile</h3>
        <RadarChart data={radarData} />
      </Card>

      <Card className="p-6 bg-white/10 backdrop-blur-sm border-none">
        <h3 className="text-lg font-semibold text-white mb-4">Mental Health Status</h3>
        <Speedometer value={mentalHealthScore} />
      </Card>
    </div>
  );
}
