"use client";

import { Card } from "../ui/card";

interface StatsDisplayProps {
  streak: number;
  totalEntries: number;
}

export function StatsDisplay({ streak, totalEntries }: StatsDisplayProps) {
  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
            <span className="text-sm font-medium text-primary">{streak}</span>
          </div>
          <div>
            <p className="text-sm font-medium">Day Streak</p>
            <p className="text-xs text-muted-foreground">Keep writing!</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
            <span className="text-sm font-medium">{totalEntries}</span>
          </div>
          <div>
            <p className="text-sm font-medium">Total Entries</p>
            <p className="text-xs text-muted-foreground">Your journey so far</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
