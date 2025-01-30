import { ErrorHandler } from '../error/error-handler';
import { KakaoClient } from '../kakao/client';
import { LineClient } from '../line/client';
import { MessageProcessor } from './message-processor';
import { MessageQueue } from './message-queue';

export class MessagingService {
  private queue: MessageQueue;
  private processor: MessageProcessor;
  private errorHandler: ErrorHandler;

  constructor(
    lineClient: LineClient,
    kakaoClient: KakaoClient,
    errorHandler = new ErrorHandler()
  ) {
    this.queue = new MessageQueue();
    this.processor = new MessageProcessor(
      this.queue,
      lineClient,
      kakaoClient,
      errorHandler
    );
    this.errorHandler = errorHandler;
  }

  async initialize() {
    await this.processor.startProcessing();
  }

  async shutdown() {
    await this.processor.stopProcessing();
  }

  async sendMessage(params: {
    platform: 'line' | 'kakao';
    channelId: string;
    userId: string;
    content: string;
    priority?: number;
    scheduledFor?: number;
    metadata?: Record<string, any>;
  }) {
    try {
      return await this.queue.enqueue({
        ...params,
        priority: params.priority || 5,
        maxRetries: 3
      });
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'MessagingService.sendMessage',
        params
      });
      throw error;
    }
  }

  async getMessageStatus(messageId: string) {
    // Implementation for checking message status
  }

  async cancelMessage(messageId: string) {
    // Implementation for canceling scheduled messages
  }
}
