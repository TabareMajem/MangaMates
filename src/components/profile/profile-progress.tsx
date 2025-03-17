"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { PersonalityProfile } from "@/types/profile";

interface ProfileProgressProps {
  profile: PersonalityProfile;
}

export function ProfileProgress({ profile }: ProfileProgressProps) {
  const assessments = [
    { name: "Values Assessment", progress: calculateProgress(profile.valueAssessments) },
    { name: "Strengths Finder", progress: calculateProgress(profile.strengthFinders) },
    { name: "Bartle Test", progress: calculateProgress(profile.bartleTests) },
    { name: "Big Five Personality", progress: calculateProgress(profile.bigFivePersonalities) },
    { name: "Mental Health", progress: calculateProgress(profile.mentalHealths) },
  ];

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-sm border-none">
      <h3 className="text-lg font-semibold text-white mb-6">Assessment Progress</h3>
      <div className="space-y-4">
        {assessments.map((assessment) => (
          <div key={assessment.name} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white">{assessment.name}</span>
              <span className="text-gray-300">{assessment.progress}%</span>
            </div>
            <Progress value={assessment.progress} className="h-2" />
          </div>
        ))}
      </div>
    </Card>
  );
}

function calculateProgress(assessments: any[]): number {
  if (!assessments.length) return 0;
  const completed = assessments.filter(a => Object.values(a).some(v => v !== null)).length;
  return (completed / assessments.length) * 100;
}
