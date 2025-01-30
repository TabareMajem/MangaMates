import { CharacterBehavior } from '@/lib/ai/character-behavior';
import { MemoryManager } from '@/lib/ai/memory-manager';
import { ConversationContext } from '@/types/conversation';
import { EmotionState } from '@/types/emotion';
import { PersonalityTraits } from '@/types/personality';
import { mockDeep } from 'jest-mock-extended';

describe('CharacterBehavior', () => {
  let behavior: CharacterBehavior;
  let mockMemoryManager: jest.Mocked<MemoryManager>;
  
  const defaultTraits: PersonalityTraits = {
    openness: 0.7,
    conscientiousness: 0.8,
    extraversion: 0.6,
    agreeableness: 0.9,
    neuroticism: 0.3,
    empathy: 0.85
  };

  const defaultEmotions: EmotionState = {
    joy: 0.6,
    sadness: 0.1,
    anger: 0.1,
    fear: 0.1,
    surprise: 0.3,
    trust: 0.8
  };

  beforeEach(() => {
    mockMemoryManager = mockDeep<MemoryManager>();
    behavior = new CharacterBehavior(defaultTraits, mockMemoryManager);
  });

  describe('evaluateResponse', () => {
    it('should adjust emotions based on conversation context', async () => {
      const context: ConversationContext = {
        userMessage: "I'm feeling really sad today",
        previousMessages: [],
        currentEmotion: defaultEmotions,
        userSentiment: -0.7,
        timestamp: new Date().toISOString()
      };

      const result = await behavior.evaluateResponse(context);

      expect(result.emotions.empathy).toBeGreaterThan(defaultEmotions.empathy);
      expect(result.emotions.joy).toBeLessThan(defaultEmotions.joy);
      expect(result.response).toContain('understand');
    });

    it('should maintain personality consistency across interactions', async () => {
      const contexts = [
        {
          userMessage: "Let's try something new!",
          previousMessages: [],
          currentEmotion: defaultEmotions,
          userSentiment: 0.8,
          timestamp: new Date().toISOString()
        },
        {
          userMessage: "I'm not sure about this...",
          previousMessages: [],
          currentEmotion: defaultEmotions,
          userSentiment: -0.2,
          timestamp: new Date().toISOString()
        }
      ];

      const responses = await Promise.all(
        contexts.map(context => behavior.evaluateResponse(context))
      );

      // High openness should lead to encouraging responses for new experiences
      expect(responses[0].response).toMatch(/exciting|interesting|explore/i);
      expect(responses[0].emotions.joy).toBeGreaterThan(defaultEmotions.joy);

      // High conscientiousness should show in careful consideration
      expect(responses[1].response).toMatch(/consider|think|plan/i);
      expect(responses[1].emotions.trust).toBeGreaterThan(0.5);
    });
  });

  describe('updateEmotionalState', () => {
    it('should gradually change emotions based on interaction', () => {
      const positiveInteraction = {
        message: "That's wonderful news!",
        sentiment: 0.9
      };

      const newState = behavior.updateEmotionalState(defaultEmotions, positiveInteraction);

      expect(newState.joy).toBeGreaterThan(defaultEmotions.joy);
      expect(newState.trust).toBeGreaterThan(defaultEmotions.trust);
      expect(newState.sadness).toBeLessThan(defaultEmotions.sadness);
    });

    it('should maintain emotional stability within reasonable bounds', () => {
      const extremeInteraction = {
        message: "This is absolutely terrible!",
        sentiment: -1.0
      };

      const newState = behavior.updateEmotionalState(defaultEmotions, extremeInteraction);

      // Even with extreme input, emotions shouldn't swing wildly
      Object.values(newState).forEach(value => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('memory integration', () => {
    it('should use past interactions to inform responses', async () => {
      const pastMemory = {
        content: "User previously mentioned their love for hiking",
        sentiment: 0.8,
        timestamp: new Date().toISOString()
      };

      mockMemoryManager.getRelevantMemories.mockResolvedValue([pastMemory]);

      const context: ConversationContext = {
        userMessage: "What should we do this weekend?",
        previousMessages: [],
        currentEmotion: defaultEmotions,
        userSentiment: 0.2,
        timestamp: new Date().toISOString()
      };

      const result = await behavior.evaluateResponse(context);

      expect(result.response.toLowerCase()).toContain('hik');
      expect(mockMemoryManager.getRelevantMemories).toHaveBeenCalled();
    });

    it('should store new interactions as memories', async () => {
      const context: ConversationContext = {
        userMessage: "I just got promoted at work!",
        previousMessages: [],
        currentEmotion: defaultEmotions,
        userSentiment: 0.9,
        timestamp: new Date().toISOString()
      };

      await behavior.evaluateResponse(context);

      expect(mockMemoryManager.storeMemory).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.stringContaining('promoted'),
          sentiment: expect.any(Number)
        })
      );
    });
  });

  describe('personality influence', () => {
    it('should reflect personality traits in response style', async () => {
      const introverted = new CharacterBehavior(
        { ...defaultTraits, extraversion: 0.2 },
        mockMemoryManager
      );

      const extroverted = new CharacterBehavior(
        { ...defaultTraits, extraversion: 0.9 },
        mockMemoryManager
      );

      const context: ConversationContext = {
        userMessage: "Let's go to a party!",
        previousMessages: [],
        currentEmotion: defaultEmotions,
        userSentiment: 0.8,
        timestamp: new Date().toISOString()
      };

      const introResponse = await introverted.evaluateResponse(context);
      const extroResponse = await extroverted.evaluateResponse(context);

      expect(introResponse.response).toMatch(/careful|quiet|small/i);
      expect(extroResponse.response).toMatch(/exciting|fun|together/i);
    });
  });
});
