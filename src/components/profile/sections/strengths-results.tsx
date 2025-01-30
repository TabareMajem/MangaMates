"use client";

import { Card } from "@/components/ui/card";
import { ProfileProgressBar } from "../visualization/progress-bar";

interface StrengthsResultsProps {
  scores: Record<string, number>;
}

export function StrengthsResults({ scores }: StrengthsResultsProps) {
  const strengthDescriptions = {
    'Strategic-Thinking': "Ability to analyze situations and develop effective plans",
    'Leadership': "Capacity to guide and inspire others",
    'Empathy': "Understanding and sharing others' feelings",
    'Innovation': "Creating new solutions and approaches",
    'Resilience': "Ability to overcome challenges and adapt",
    'Communication': "Effectively expressing ideas and connecting with others"
  };

  const sortedStrengths = Object.entries(scores)
    .sort(([, a], [, b]) => b - a);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Core Strengths Profile</h3>
      
      <div className="space-y-6">
        {sortedStrengths.map(([strength, score]) => (
          <div key={strength} className="space-y-2">
            <ProfileProgressBar
              label={strength}
              value={score}
            />
            <p className="text-sm text-muted-foreground pl-1">
              {strengthDescriptions[strength]}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
