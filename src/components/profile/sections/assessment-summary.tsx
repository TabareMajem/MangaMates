"use client";

import { Card } from "@/components/ui/card";
import { ProfileProgressBar } from "../visualization/progress-bar";
import type { PersonalityProfile } from "@/types/profile";

interface AssessmentSummaryProps {
  profile: PersonalityProfile;
}

export function AssessmentSummary({ profile }: AssessmentSummaryProps) {
  const assessments = [
    {
      name: "Values Assessment",
      progress: calculateProgress(profile.valueAssessments),
    },
    {
      name: "Strengths Finder",
      progress: calculateProgress(profile.strengthFinders),
    },
    {
      name: "Bartle Test",
      progress: calculateProgress(profile.bartleTests),
    },
    {
      name: "Big Five Personality",
      progress: calculateProgress(profile.bigFivePersonalities),
    },
    {
      name: "Mental Health",
      progress: calculateProgress(profile.mentalHealths),
    },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Assessment Progress</h3>
      <div className="space-y-4">
        {assessments.map((assessment) => (
          <ProfileProgressBar
            key={assessment.name}
            label={assessment.name}
            value={assessment.progress}
          />
        ))}
      </div>
    </Card>
  );
}

function calculateProgress(assessments: any[]): number {
  if (!assessments.length) return 0;
  const completed = assessments.filter(a => 
    Object.values(a).some(v => v !== null)
  ).length;
  return (completed / assessments.length) * 100;
}
