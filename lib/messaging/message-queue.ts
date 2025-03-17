import type { Message, MessagePriority, MessageStatus } from '@/types/messaging';
import { nanoid } from 'nanoid';
import { ErrorHandler } from '../error/error-handler';
import { supabase } from '../supabase';

export class MessageQueue {
  constructor(
    private queueName: string,
    private errorHandler = new ErrorHandler()
  ) {}

  async enqueue(
    message: Omit<Message, 'id' | 'status' | 'createdAt' | 'processedAt'>,
    priority: MessagePriority = 'normal'
  ): Promise<string> {
    try {
      const messageId = nanoid();
      const timestamp = new Date().toISOString();

      const { error } = await supabase
        .from('message_queue')
        .insert({
          id: messageId,
          queue: this.queueName,
          priority,
          status: 'pending',
          payload: message,
          created_at: timestamp,
          updated_at: timestamp
        });

      if (error) throw error;

      return messageId;
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'messageQueue.enqueue',
        queueName: this.queueName,
        message
      });
      throw error;
    }
  }

  async dequeue(batchSize = 10): Promise<Message[]> {
    try {
      // First, get messages ordered by priority and creation time
      const { data: messages, error: selectError } = await supabase
        .from('message_queue')
        .select('*')
        .eq('queue', this.queueName)
        .eq('status', 'pending')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(batchSize);

      if (selectError) throw selectError;
      if (!messages?.length) return [];

      // Update status to 'processing'
      const messageIds = messages.map(m => m.id);
      const timestamp = new Date().toISOString();

      const { error: updateError } = await supabase
        .from('message_queue')
        .update({
          status: 'processing',
          updated_at: timestamp,
          processing_started_at: timestamp
        })
        .in('id', messageIds);

      if (updateError) throw updateError;

      return messages.map(msg => ({
        id: msg.id,
        type: msg.payload.type,
        data: msg.payload.data,
        priority: msg.priority,
        status: 'processing',
        createdAt: msg.created_at,
        processedAt: null
      }));
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'messageQueue.dequeue',
        queueName: this.queueName,
        batchSize
      });
      throw error;
    }
  }

  async complete(messageId: string, success: boolean): Promise<void> {
    try {
      const status: MessageStatus = success ? 'completed' : 'failed';
      const timestamp = new Date().toISOString();

      const { error } = await supabase
        .from('message_queue')
        .update({
          status,
          updated_at: timestamp,
          processed_at: timestamp
        })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'messageQueue.complete',
        queueName: this.queueName,
        messageId,
        success
      });
      throw error;
    }
  }

  async retry(messageId: string): Promise<void> {
    try {
      const timestamp = new Date().toISOString();

      const { error } = await supabase
        .from('message_queue')
        .update({
          status: 'pending',
          retry_count: supabase.sql`retry_count + 1`,
          updated_at: timestamp,
          processing_started_at: null,
          processed_at: null
        })
        .eq('id', messageId)
        .eq('status', 'failed');

      if (error) throw error;
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'messageQueue.retry',
        queueName: this.queueName,
        messageId
      });
      throw error;
    }
  }

  async getQueueStats(): Promise<{
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    avgProcessingTime: number;
  }> {
    try {
      const { data: stats, error } = await supabase
        .from('message_queue')
        .select('status, processing_started_at, processed_at')
        .eq('queue', this.queueName);

      if (error) throw error;

      const counts = stats.reduce(
        (acc, msg) => {
          acc[msg.status]++;
          if (msg.processing_started_at && msg.processed_at) {
            const processingTime = new Date(msg.processed_at).getTime() - 
              new Date(msg.processing_started_at).getTime();
            acc.totalProcessingTime += processingTime;
            acc.processedCount++;
          }
          return acc;
        },
        {
          pending: 0,
          processing: 0,
          completed: 0,
          failed: 0,
          totalProcessingTime: 0,
          processedCount: 0
        }
      );

      return {
        pending: counts.pending,
        processing: counts.processing,
        completed: counts.completed,
        failed: counts.failed,
        avgProcessingTime: counts.processedCount ? 
          counts.totalProcessingTime / counts.processedCount : 
          0
      };
    } catch (error) {
      await this.errorHandler.handleError(error as Error, {
        context: 'messageQueue.getStats',
        queueName: this.queueName
      });
      throw error;
    }
  }
}
