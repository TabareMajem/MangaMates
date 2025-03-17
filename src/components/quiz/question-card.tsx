"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BaseQuestion } from "@/types/quiz";

interface QuestionCardProps {
  question: BaseQuestion;
  selectedOption?: string;
  onSelect: (value: string) => void;
}

export function QuestionCard({ question, selectedOption, onSelect }: QuestionCardProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-center text-white">
        {question.title}
      </h2>

      <Card className="bg-white/10 backdrop-blur-sm border-none p-6">
        <h3 className="text-xl font-medium mb-4 text-center">Scenario</h3>
        <p className="text-white/80 text-center mb-6">
          {question.scenario}
        </p>

        <div className="aspect-video rounded-lg overflow-hidden mb-8 bg-black/20">
          {/* TODO: Replace with actual image once generated */}
          <div className="w-full h-full flex items-center justify-center text-white/50">
            Image will be generated based on scenario
          </div>
        </div>

        <div className="space-y-3">
          {question.options.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              className={cn(
                "w-full justify-start text-left p-4 h-auto hover:bg-white/10",
                selectedOption === option.value && "bg-white/20 hover:bg-white/20"
              )}
              onClick={() => onSelect(option.value)}
            >
              <span className="text-white/90">{option.text}</span>
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
