"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { useToast } from '@/hooks/use-toast';
import { assessmentService } from '@/lib/services/assessment-service';
import type { Assessment, QuizResult } from '@/types/quiz';

export function useAssessment(assessment: Assessment) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const startAssessment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to take assessments",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const session = await assessmentService.startAssessment(user.id, assessment.id);
      setSessionId(session.id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start assessment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (questionId: string, answer: string) => {
    if (!sessionId) return;

    try {
      await assessmentService.saveAnswer(sessionId, questionId, answer);
      setAnswers(prev => ({ ...prev, [questionId]: answer }));
      setCurrentQuestionIndex(prev => prev + 1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save answer",
        variant: "destructive"
      });
    }
  };

  const completeAssessment = async () => {
    if (!sessionId) return;

    try {
      setLoading(true);
      const results = assessment.calculateScore(answers);
      await assessmentService.completeAssessment(sessionId, results);
      return results;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete assessment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    currentQuestionIndex,
    answers,
    loading,
    startAssessment,
    submitAnswer,
    completeAssessment
  };
}
