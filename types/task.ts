export interface Task {
  id: string;
  characterId: string;
  type: TaskType;
  title: string;
  description: string;
  priority: number; // 1-5, where 1 is highest
  status: TaskStatus;
  schedule: TaskSchedule;
  dependencies?: string[]; // IDs of tasks that must be completed first
  metadata: TaskMetadata;
  progress: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  failedAt?: Date;
  nextRunAt?: Date;
  lastRunAt?: Date;
  error?: string;
}

export type TaskType = 
  | 'message'
  | 'content_creation'
  | 'social_interaction'
  | 'data_analysis'
  | 'maintenance'
  | 'custom';

export type TaskStatus =
  | 'pending'
  | 'scheduled'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'blocked';

export interface TaskSchedule {
  type: 'one_time' | 'recurring';
  startAt?: Date;
  endAt?: Date;
  cronExpression?: string;
  timezone?: string;
}

export interface TaskMetadata {
  platform?: 'line' | 'kakao' | 'all';
  targetAudience?: string[];
  requiredResources?: string[];
  estimatedDuration?: number;
  maxRetries?: number;
  retryCount?: number;
  tags?: string[];
  analytics?: TaskAnalytics;
  content?: string;
}

export interface TaskAnalytics {
  successRate?: number;
  averageDuration?: number;
  lastOutcomes?: TaskOutcome[];
  impactMetrics?: Record<string, number>;
}

export interface TaskOutcome {
  timestamp: Date;
  status: TaskStatus;
  duration: number;
  error?: string;
  metrics?: Record<string, number>;
}
