"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ResultsChart } from "./results-chart";
import { TraitsList } from "./traits-list";
import { RecommendedCharacters } from "./recommended-characters";
import type { Quiz } from "@/types/quiz";

interface QuizResultsProps {
  quiz: Quiz;
}

export function QuizResults({ quiz }: QuizResultsProps) {
  const router = useRouter();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Your {quiz.on} Results</h2>
        
        <div className="space-y-8">
          <ResultsChart scores={quiz.scores} />
          <TraitsList traits={quiz.traits} />
          <RecommendedCharacters traits={quiz.traits} />
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.push("/profile-insights")}
            >
              Back to Insights
            </Button>
            <Button onClick={() => router.push("/talk-with-character")}>
              Talk with Characters
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
