"use client";

import { useState } from "react";
import { startQuizSession, saveQuizAnswer, completeQuizSession } from "@/lib/api/quiz";
import type { QuizSession, QuizAnswer, QuizResult, QuizState } from "@/types/quiz";
import { useAuth } from "@/lib/auth/context";

export function useQuizSession(category: string) {
  const [state, setState] = useState<QuizState>({
    session: null,
    currentQuestionIndex: 0,
    answers: [],
    isComplete: false
  });

  const { user } = useAuth();

  const startSession = async () => {
    if (!user) throw new Error("User not authenticated");
    
    const session = await startQuizSession(user.id, category);
    setState(prev => ({ ...prev, session }));
    return session;
  };

  const submitAnswer = async (questionId: string, answerValue: number) => {
    if (!state.session) throw new Error("No active session");

    await saveQuizAnswer(state.session.id, questionId, answerValue);
    
    const answer: QuizAnswer = {
      sessionId: state.session.id,
      questionId,
      answerValue
    };

    setState(prev => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex + 1,
      answers: [...prev.answers, answer]
    }));
  };

  const completeSession = async (results: QuizResult) => {
    if (!state.session) throw new Error("No active session");
    
    await completeQuizSession(state.session.id, results);
    setState(prev => ({ ...prev, isComplete: true }));
  };

  return {
    state,
    startSession,
    submitAnswer,
    completeSession
  };
}
