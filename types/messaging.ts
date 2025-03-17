export type MessagePriority = 'high' | 'normal' | 'low';
export type MessageStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Message {
  id: string;
  type: string;
  data: any;
  priority: MessagePriority;
  status: MessageStatus;
  createdAt: string;
  processedAt: string | null;
}

export interface QueuedMessage extends Message {
  queue: string;
  retryCount: number;
  processingStartedAt: string | null;
  updatedAt: string;
}

export interface MessageMetrics {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  avgProcessingTime: number;
}
