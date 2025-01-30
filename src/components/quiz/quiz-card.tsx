"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { QuizQuestion } from "@/types/quiz";

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (value: number) => void;
  currentAnswer?: number;
}

export function QuizCard({ question, onAnswer, currentAnswer }: QuizCardProps) {
  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-lg font-medium">{question.text}</h3>
      
      <div className="grid gap-3">
        {question.options.map((option) => (
          <Button
            key={option.value}
            variant={currentAnswer === option.value ? "default" : "outline"}
            className="justify-start h-auto py-3 px-4"
            onClick={() => onAnswer(option.value)}
          >
            {option.text}
          </Button>
        ))}
      </div>
    </Card>
  );
}
