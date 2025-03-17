"use client";

import { Card } from "@/components/ui/card";
import { Trophy, Star, Award } from "lucide-react";
import { useJournalStats } from "@/hooks/use-journal-stats";

export function StreakCard() {
  const { streak, achievements } = useJournalStats();

  return (
    <Card className="glass-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Achievements</h2>
        <Trophy className="h-5 w-5 text-primary" />
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Star className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-medium">{streak} Day Streak</p>
            <p className="text-sm text-muted-foreground">Keep it going!</p>
          </div>
        </div>
        {achievements?.map((achievement) => (
          <div key={achievement.id} className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
              achievement.unlocked ? 'bg-primary/10' : 'bg-secondary'
            }`}>
              <Award className={`h-6 w-6 ${
                achievement.unlocked ? 'text-primary' : 'text-secondary-foreground'
              }`} />
            </div>
            <div>
              <p className="font-medium">{achievement.title}</p>
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
