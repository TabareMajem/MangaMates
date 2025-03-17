import { create } from 'zustand';
import type { Assessment, BaseQuestion } from '@/types/quiz';

interface QuizState {
  currentAssessment: Assessment | null;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  setAssessment: (assessment: Assessment) => void;
  setAnswer: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  reset: () => void;
}

export const useQuizState = create<QuizState>((set) => ({
  currentAssessment: null,
  currentQuestionIndex: 0,
  answers: {},

  setAssessment: (assessment) => set({ 
    currentAssessment: assessment,
    currentQuestionIndex: 0,
    answers: {}
  }),

  setAnswer: (questionId, answer) => set((state) => ({
    answers: { ...state.answers, [questionId]: answer }
  })),

  nextQuestion: () => set((state) => ({
    currentQuestionIndex: Math.min(
      state.currentQuestionIndex + 1,
      (state.currentAssessment?.questions.length || 0) - 1
    )
  })),

  previousQuestion: () => set((state) => ({
    currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0)
  })),

  reset: () => set({
    currentAssessment: null,
    currentQuestionIndex: 0,
    answers: {}
  })
}));
