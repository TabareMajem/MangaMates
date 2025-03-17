"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGoalAnalysis } from "@/hooks/use-goal-analysis";

export function GoalTracker() {
  const { goals } = useGoalAnalysis();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Goal Progress</h3>
      <div className="space-y-6">
        {goals.map((goal) => (
          <div key={goal.id} className="space-y-2">
            <div className="flex justify-between">
              <p className="font-medium">{goal.title}</p>
              <span className="text-sm text-muted-foreground">
                {Math.round(goal.progress)}%
              </span>
            </div>
            <Progress value={goal.progress} className="h-2" />
            <p className="text-sm text-muted-foreground">{goal.status}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
