import { __test__ } from '@/lib/services/assessment-service';
import { QuestionResponse } from '@/types/assessment';

const {
  getEmotionMappings,
  calculatePersonalityScores,
  calculateMentalHealthScores,
  normalizeScores
} = __test__;

describe('Assessment Service', () => {
  describe('getEmotionMappings', () => {
    it('should return correct mappings for known questions', () => {
      const mapping = getEmotionMappings('q1');
      expect(mapping).toEqual({ joy: 0.8, trust: 0.2 });
    });

    it('should return empty object for unknown questions', () => {
      const mapping = getEmotionMappings('unknown');
      expect(mapping).toEqual({});
    });
  });

  describe('calculatePersonalityScores', () => {
    it('should calculate Big Five scores correctly', () => {
      const responses: QuestionResponse[] = [
        { questionId: 'p1', answer: 'Strongly Agree', score: 5 },
        { questionId: 'p2', answer: 'Agree', score: 4 },
        { questionId: 'p3', answer: 'Neutral', score: 3 }
      ];

      const scores = calculatePersonalityScores(responses);
      
      expect(scores.openness).toBeGreaterThan(0);
      expect(scores.conscientiousness).toBeGreaterThan(0);
      expect(scores.extraversion).toBeGreaterThan(0);
      expect(Object.values(scores).every(v => v >= 0 && v <= 1)).toBe(true);
    });
  });

  describe('calculateMentalHealthScores', () => {
    it('should calculate mental health scores correctly', () => {
      const responses: QuestionResponse[] = [
        { questionId: 'm1', answer: 'Often', score: 4 },
        { questionId: 'm2', answer: 'Sometimes', score: 3 },
        { questionId: 'm3', answer: 'Rarely', score: 2 }
      ];

      const scores = calculateMentalHealthScores(responses);
      
      expect(scores.anxiety).toBeGreaterThan(0);
      expect(scores.depression).toBeGreaterThan(0);
      expect(scores.stress).toBeDefined();
      expect(Object.values(scores).every(v => v >= 0 && v <= 1)).toBe(true);
    });
  });

  describe('normalizeScores', () => {
    it('should normalize scores to 0-1 range', () => {
      const rawScores = {
        score1: 10,
        score2: 5,
        score3: 0
      };

      const normalized = normalizeScores(rawScores);
      
      expect(normalized.score1).toBe(1);
      expect(normalized.score2).toBe(0.5);
      expect(normalized.score3).toBe(0);
    });

    it('should handle single value scores', () => {
      const scores = { single: 5 };
      const normalized = normalizeScores(scores);
      expect(normalized.single).toBe(1);
    });

    it('should handle zero range scores', () => {
      const scores = { same: 5, alsoSame: 5 };
      const normalized = normalizeScores(scores);
      expect(normalized.same).toBe(0);
      expect(normalized.alsoSame).toBe(0);
    });
  });
});
