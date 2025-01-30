"use client";

import { useEffect } from "react";
import { useQuiz } from "@/hooks/use-quiz";
import { QuizCard } from "./quiz-card";
import { QuizProgress } from "./quiz-progress";
import { QuizResults } from "./quiz-results";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { Quiz, QuizQuestion } from "@/types/quiz";

interface QuestionBoardProps {
  quiz: Quiz;
  assessmentQuestions: QuizQuestion[];
}

export default function QuestionBoard({ quiz, assessmentQuestions }: QuestionBoardProps) {
  const router = useRouter();
  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    isComplete,
    handleAnswer,
    calculateResult
  } = useQuiz(assessmentQuestions);

  useEffect(() => {
    if (isComplete) {
      const result = calculateResult();
      // Save result and redirect
      router.push(`/profile-insights/${quiz.on}/results`);
    }
  }, [isComplete, quiz.on, calculateResult, router]);

  if (!currentQuestion) {
    return <QuizResults quiz={quiz} />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <QuizProgress 
        current={currentIndex + 1} 
        total={totalQuestions}
        category={quiz.on}
      />

      <QuizCard
        question={currentQuestion}
        onAnswer={handleAnswer}
      />

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => router.push("/profile-insights")}
        >
          Save & Exit
        </Button>
      </div>
    </div>
  );
}
