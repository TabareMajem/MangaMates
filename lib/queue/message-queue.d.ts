export interface QueueMessage {
  userId: string;
  recipientId: string;
  content: string;
  type: string;
  timestamp: number;
}

export interface MessageQueue {
  enqueue(queue: string, message: QueueMessage, priority?: number): Promise<string>;
  dequeue(queue: string): Promise<QueueMessage | null>;
}
