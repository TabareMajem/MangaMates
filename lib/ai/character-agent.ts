import type { Character, CharacterResponse, CharacterState, Goal, Task } from '@/types';
import { ConversationMemory } from './memory/conversation-memory';
import { AIServiceManager } from './service/ai-service-manager';

export class CharacterAgent {
  private state: CharacterState;

  constructor(
    private character: Character,
    private memory: ConversationMemory,
    private aiService: AIServiceManager
  ) {
    this.state = {
      mood: 'neutral',
      energy: 100,
      context: {},
      lastInteraction: new Date()
    };
  }

  async processMessage(message: string): Promise<CharacterResponse> {
    try {
      const history = await this.memory.getRecentHistory(this.character.id);
      
      const response = await this.aiService.generateResponse(
        message,
        {
          character: this.character,
          state: this.state,
          history
        }
      );

      this.updateState(message, response);

      await this.memory.storeInteraction({
        characterId: this.character.id,
        message,
        response: response.content,
        timestamp: new Date()
      });

      return response;
    } catch (error) {
      console.error('Character agent error:', error);
      throw error;
    }
  }

  private updateState(_message: string, response: CharacterResponse) {
    this.state = {
      ...this.state,
      mood: response.mood || this.state.mood,
      lastInteraction: new Date()
    };
  }

  async assignTask(task: Omit<Task, 'id'>): Promise<Task> {
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...task,
      status: 'pending'
    };

    const goal = this.findRelevantGoal(task.description);
    if (goal) {
      goal.tasks.push(newTask);
    }

    return newTask;
  }

  private findRelevantGoal(taskDescription: string): Goal | undefined {
    return this.character.goals.find(goal => 
      goal.status === 'active' && 
      this.isTaskRelevantToGoal(taskDescription, goal)
    );
  }

  private isTaskRelevantToGoal(_taskDescription: string, _goal: Goal): boolean {
    // Implementation will use these parameters later
    return true;
  }
}
