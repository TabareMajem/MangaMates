"use client";

import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  label: string;
  value: number;
  showPercentage?: boolean;
}

export function ProfileProgressBar({
  label,
  value,
  showPercentage = true
}: ProgressBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        {showPercentage && (
          <span className="text-muted-foreground">{Math.round(value)}%</span>
        )}
      </div>
      <Progress value={value} className="h-2" />
    </div>
  );
}
