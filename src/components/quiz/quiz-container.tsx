"use client";

import { useState } from "react";
import { QuestionCard } from "./question-card";
import { QuizProgress } from "./quiz-progress";
import { QuizNavigation } from "./quiz-navigation";
import type { Assessment } from "@/types/quiz";

interface QuizContainerProps {
  assessment: Assessment;
  onComplete: (results: Record<string, number>) => void;
}

export function QuizContainer({ assessment, onComplete }: QuizContainerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === assessment.questions.length - 1;

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const results = assessment.calculateScore(answers);
      onComplete(results);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="space-y-8">
      <QuizProgress
        current={currentQuestionIndex + 1}
        total={assessment.questions.length}
        title={assessment.title}
      />

      <QuestionCard
        question={currentQuestion}
        selectedOption={answers[currentQuestion.id]}
        onSelect={handleAnswer}
      />

      <QuizNavigation
        onPrevious={currentQuestionIndex > 0 ? handlePrevious : undefined}
        onNext={handleNext}
        canGoNext={!!answers[currentQuestion.id]}
        isLastQuestion={isLastQuestion}
      />
    </div>
  );
}
