import { __test__ } from '@/lib/services/social-analyzer';

const { parseAnalysisResponse } = __test__;

describe('Social Analyzer', () => {
  describe('parseAnalysisResponse', () => {
    it('should parse well-formatted responses', () => {
      const response = `
        Overall sentiment: 0.8
        Joy: 0.9
        Sadness: 0.1
        Anger: 0.2
        Fear: 0.3
        Surprise: 0.4
        Trust: 0.7
      `;

      const scores = parseAnalysisResponse(response);
      
      expect(scores.sentiment).toBe(0.8);
      expect(scores.joy).toBe(0.9);
      expect(scores.sadness).toBe(0.1);
      expect(scores.anger).toBe(0.2);
      expect(scores.fear).toBe(0.3);
      expect(scores.surprise).toBe(0.4);
      expect(scores.trust).toBe(0.7);
    });

    it('should handle missing values', () => {
      const response = `
        Overall sentiment: 0.8
        Joy: 0.9
        // Missing some emotions
        Trust: 0.7
      `;

      const scores = parseAnalysisResponse(response);
      
      expect(scores.sentiment).toBe(0.8);
      expect(scores.joy).toBe(0.9);
      expect(scores.sadness).toBe(0.5); // Default value
      expect(scores.trust).toBe(0.7);
    });

    it('should clamp values to 0-1 range', () => {
      const response = `
        Overall sentiment: 1.2
        Joy: -0.1
        Sadness: 2.0
      `;

      const scores = parseAnalysisResponse(response);
      
      expect(scores.sentiment).toBe(1.0);
      expect(scores.joy).toBe(0.0);
      expect(scores.sadness).toBe(1.0);
    });

    it('should handle malformed input gracefully', () => {
      const response = 'completely invalid response';
      const scores = parseAnalysisResponse(response);
      
      expect(scores.sentiment).toBe(0.5);
      expect(Object.values(scores).every(v => v === 0.5)).toBe(true);
    });
  });
});
