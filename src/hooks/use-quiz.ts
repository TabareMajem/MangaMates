"use client";

import { useState } from "react";
import { calculateCategoryScore } from "@/lib/quiz/scoring";
import type { QuizAnswer, QuizQuestion, QuizResult, QuizCategory } from "@/types/quiz";
import { useAuth } from "@/lib/auth/context";

export function useQuiz(questions: QuizQuestion[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const { user } = useAuth();

  const currentQuestion = questions[currentIndex];
  const isComplete = currentIndex >= questions.length;

  const handleAnswer = (value: number) => {
    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      answer: value,
      category: currentQuestion.category,
      weight: currentQuestion.weight
    };

    setAnswers([...answers, answer]);
    setCurrentIndex(currentIndex + 1);
  };

  const calculateResult = (): QuizResult => {
    if (!user) throw new Error("User not authenticated");

    const categories = [...new Set(questions.map(q => q.category))];
    const categoryScores = categories.reduce((acc, category) => ({
      ...acc,
      [category]: calculateCategoryScore(answers, category as QuizCategory)
    }), {});

    return {
      userId: user.id,
      categoryScores,
      completedAt: new Date()
    };
  };

  return {
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
    isComplete,
    handleAnswer,
    calculateResult
  };
}
