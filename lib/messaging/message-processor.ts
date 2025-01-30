import { sleep } from '@/lib/utils';
import type { Message } from '@/types/messaging';
import { ErrorHandler } from '../error/error-handler';
import { MessageQueue } from './message-queue';

interface MessageHandler {
  handleMessage(message: Message): Promise<void>;
}

interface ProcessorConfig {
  queueName: string;
  batchSize?: number;
  pollInterval?: number;
  maxRetries?: number;
  retryDelay?: number;
}

export class MessageProcessor {
  private isRunning = false;
  private readonly queue: MessageQueue;
  private readonly errorHandler: ErrorHandler;
  private readonly handlers: Map<string, MessageHandler>;
  private readonly config: Required<ProcessorConfig>;

  constructor(
    config: ProcessorConfig,
    errorHandler = new ErrorHandler()
  ) {
    this.config = {
      batchSize: 10,
      pollInterval: 1000,
      maxRetries: 3,
      retryDelay: 5000,
      ...config
    };
    this.queue = new MessageQueue(config.queueName, errorHandler);
    this.errorHandler = errorHandler;
    this.handlers = new Map();
  }

  registerHandler(messageType: string, handler: MessageHandler): void {
    this.handlers.set(messageType, handler);
  }

  async start(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;

    try {
      while (this.isRunning) {
        const messages = await this.queue.dequeue(this.config.batchSize);
        
        if (messages.length === 0) {
          await sleep(this.config.pollInterval);
          continue;
        }

        await Promise.all(messages.map(msg => this.processMessage(msg)));
      }
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'messageProcessor.start',
        queueName: this.config.queueName
      });
      this.stop();
    }
  }

  stop(): void {
    this.isRunning = false;
  }

  private async processMessage(message: Message): Promise<void> {
    try {
      const handler = this.handlers.get(message.type);
      if (!handler) {
        throw new Error(`No handler registered for message type: ${message.type}`);
      }

      await handler.handleMessage(message);
      await this.queue.complete(message.id, true);
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'messageProcessor.processMessage',
        messageId: message.id,
        messageType: message.type
      });

      // Get current retry count
      const retryCount = await this.getRetryCount(message.id);
      
      if (retryCount < this.config.maxRetries) {
        await sleep(this.config.retryDelay);
        await this.queue.retry(message.id);
      } else {
        await this.queue.complete(message.id, false);
      }
    }
  }

  private async getRetryCount(messageId: string): Promise<number> {
    try {
      const { data, error } = await this.queue['supabase']
        .from('message_queue')
        .select('retry_count')
        .eq('id', messageId)
        .single();

      if (error) throw error;
      return data?.retry_count || 0;
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'messageProcessor.getRetryCount',
        messageId
      });
      return 0;
    }
  }

  async getProcessingStats(): Promise<{
    activeHandlers: number;
    queueStats: {
      pending: number;
      processing: number;
      completed: number;
      failed: number;
      avgProcessingTime: number;
    };
  }> {
    try {
      const queueStats = await this.queue.getQueueStats();
      
      return {
        activeHandlers: this.handlers.size,
        queueStats
      };
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'messageProcessor.getStats'
      });
      throw error;
    }
  }
}
