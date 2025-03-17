"use client";

import { Card } from "../ui/card";
import { Trophy, Star } from "lucide-react";
import { useState } from "react";

const mockData = {
  streak: 5,
  achievements: [
    {
      id: 'first-entry',
      title: 'First Entry',
      description: 'Started your journaling journey',
      unlocked: true
    },
    {
      id: 'three-day-streak',
      title: '3 Day Streak',
      description: 'Wrote for three consecutive days',
      unlocked: true
    }
  ]
};

export function StreakCard() {
  const [data] = useState(mockData);

  return (
    <Card className="p-6">
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
            <p className="font-medium">{data.streak} Day Streak</p>
            <p className="text-sm text-muted-foreground">Keep it going!</p>
          </div>
        </div>
        {data.achievements.map((achievement) => (
          <div key={achievement.id} className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Trophy className="h-6 w-6 text-primary" />
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
