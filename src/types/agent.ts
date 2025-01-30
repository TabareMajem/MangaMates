export interface AgentTrigger {
  id: string;
  type: 'schedule' | 'emotion' | 'keyword' | 'time';
  condition: string;
  action: string;
  enabled: boolean;
}

export interface AgentTask {
  id: string;
  title: string;
  description: string;
  schedule?: string; // Cron expression
  lastRun?: Date;
  nextRun?: Date;
  enabled: boolean;
}

export interface AgentPersonality {
  name: string;
  series: string;
  traits: string[];
  background: string;
  imageUrl: string;
  aiPrompt: string;
  voiceStyle?: string;
  responseStyle?: {
    tone: string;
    formality: 'casual' | 'formal';
    verbosity: 'concise' | 'detailed';
  };
}

export interface AgentGoal {
  id: string;
  title: string;
  description: string;
  metrics: string[];
  progress: number;
}

export interface AIAgent {
  id: string;
  userId: string;
  personality: AgentPersonality;
  goals: AgentGoal[];
  triggers: AgentTrigger[];
  tasks: AgentTask[];
  shareToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CharacterMatch {
  character: AgentPersonality;
  matchScore: number;
  matchReasons: string[];
}
