"use client";

import { Card } from "@/components/ui/card";

interface TraitSummaryProps {
  title: string;
  traits: {
    name: string;
    score: number;
    description?: string;
  }[];
}

export function TraitSummary({ title, traits }: TraitSummaryProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {traits.map((trait) => (
          <div key={trait.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{trait.name}</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(trait.score * 100)}%
              </span>
            </div>
            {trait.description && (
              <p className="text-sm text-muted-foreground">{trait.description}</p>
            )}
            <div className="h-2 bg-secondary rounded-full">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${trait.score * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
