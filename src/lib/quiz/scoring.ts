import type { Assessment, QuizResult } from '@/types/quiz';

export function calculateQuizResult(
  assessment: Assessment,
  answers: Record<string, string>
): QuizResult {
  const scores = assessment.calculateScore(answers);
  
  // Get dominant traits (top 3 scores)
  const dominantTraits = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([trait]) => trait);

  return {
    assessmentId: assessment.id,
    scores,
    dominantTraits,
    timestamp: new Date()
  };
}

export function normalizeScore(score: number, max = 100): number {
  return Math.min(Math.max((score / max) * 100, 0), 100);
}
