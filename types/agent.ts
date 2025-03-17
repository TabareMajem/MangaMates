// Core Character Types
export interface Character {
  id: string;
  name: string;
  description: string;
  personality: string;
  background: string;
  appearance: any;
  voiceStyle: string;
  goals: string[];
  traits: any;
  createdAt: string;
  updatedAt: string;
  templateId?: string;
  series?: string;
}

export interface CharacterState {
  mood: string;
  energy: number;
  context: Record<string, any>;
  lastInteraction?: Date;
}

export interface CharacterResponse {
  content: string;
  mood?: string;
  actions?: CharacterAction[];
}

export interface CharacterAction {
  type: 'message' | 'reaction' | 'task';
  payload: Record<string, any>;
}

// Task Management Types
export interface Goal {
  id: string;
  description: string;
  priority: number;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  tasks: Task[];
}

export interface Task {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  platform?: 'line' | 'kakao' | 'all';
  scheduledFor?: Date;
  completedAt?: Date;
}

// AI Service Types
export interface AIServiceConfig {
  provider: 'openai' | 'anthropic';
  model: string;
  maxTokens?: number;
  temperature?: number;
  contextWindow?: number;
}

export interface ConversationContext {
  character: Character;
  state: CharacterState;
  history: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
}

interface AgentTask {
  id: string;
  agentId: string;
  type: 'daily' | 'weekly' | 'custom';
  action: string;
  schedule: {
    time?: string;
    days?: string[];
    conditions?: {
      when: string;
      then: string;
    }[];
  };
  isActive: boolean;
  lastRun?: string;
  nextRun?: string;
}

// Make sure all types are exported
export type {
    AIServiceConfig, Character, CharacterAction, CharacterResponse, CharacterState, ConversationContext, Goal,
    Task
};
