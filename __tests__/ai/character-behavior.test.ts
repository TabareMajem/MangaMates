import { CharacterAgent } from '@/lib/ai/character-agent';
import { ConversationMemory } from '@/lib/ai/memory/conversation-memory';
import { AIServiceManager } from '@/lib/ai/service/ai-service-manager';
import { Character } from '@/types/agent';

describe('Character Behavior Tests', () => {
  let character: Character;
  let agent: CharacterAgent;
  let memory: ConversationMemory;
  let aiService: AIServiceManager;

  beforeEach(() => {
    character = {
      id: 'test-character',
      name: 'Test Character',
      series: 'Test Series',
      personality: {
        traits: ['friendly', 'helpful'],
        background: 'Test background',
        speakingStyle: 'casual',
        interests: ['testing'],
        values: ['accuracy']
      },
      goals: [
        {
          id: 'goal-1',
          description: 'Help with testing',
          priority: 1,
          status: 'active',
          progress: 0,
          tasks: []
        }
      ]
    };

    memory = new ConversationMemory();
    aiService = new AIServiceManager();
    agent = new CharacterAgent(character, memory, aiService);
  });

  test('maintains consistent personality', async () => {
    const responses = await Promise.all([
      agent.generateResponse('Hello!'),
      agent.generateResponse('How are you?'),
      agent.generateResponse('What do you like to do?')
    ]);

    // Check response consistency
    responses.forEach(response => {
      expect(response).toMatch(/casual/i);
      expect(response).toMatch(/friendly/i);
    });
  });

  test('remembers previous interactions', async () => {
    await agent.generateResponse('My name is Alice');
    const response = await agent.generateResponse('Do you remember my name?');
    
    expect(response).toMatch(/Alice/i);
  });

  test('pursues active goals', async () => {
    const response = await agent.generateResponse('Can you help me with testing?');
    
    expect(response).toMatch(/help|assist|test/i);
    expect(agent.getActiveGoals()).toContainEqual(
      expect.objectContaining({ id: 'goal-1' })
    );
  });

  test('handles errors gracefully', async () => {
    // Simulate AI service failure
    jest.spyOn(aiService, 'generateResponse').mockRejectedValueOnce(new Error());
    
    const response = await agent.generateResponse('Hello');
    expect(response).toBeTruthy(); // Should use fallback response
  });

  test('respects rate limits', async () => {
    const responses = await Promise.all(
      Array(10).fill(null).map(() => agent.generateResponse('Hi'))
    );

    expect(responses).toHaveLength(10);
    responses.forEach(response => {
      expect(response).toBeTruthy();
    });
  });
});
