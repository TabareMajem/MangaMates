"use client";

import { Progress } from "@/components/ui/progress";

interface QuizProgressProps {
  current: number;
  total: number;
  title: string;
}

export function QuizProgress({ current, total, title }: QuizProgressProps) {
  const progress = (current / total) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-white/80">
        <span>{title}</span>
        <span>Question {current} of {total}</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
