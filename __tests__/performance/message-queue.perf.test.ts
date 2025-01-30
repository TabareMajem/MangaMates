import { MessageQueue } from '@/lib/queue/message-queue';
import { performance } from 'perf_hooks';

describe('Message Queue Performance', () => {
  let messageQueue: MessageQueue;

  beforeEach(() => {
    messageQueue = new MessageQueue();
  });

  it('should handle high throughput message enqueueing', async () => {
    const messageCount = 1000;
    const messages = Array.from({ length: messageCount }, (_, i) => ({
      userId: 'test-user',
      recipientId: `recipient-${i}`,
      content: 'Test message',
      type: 'text'
    }));

    const startTime = performance.now();
    
    await Promise.all(
      messages.map(msg => 
        messageQueue.enqueue('test_message', msg)
      )
    );

    const endTime = performance.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    expect(duration / messageCount).toBeLessThan(5); // Average < 5ms per message
  });

  it('should maintain performance under concurrent load', async () => {
    const concurrentUsers = 50;
    const messagesPerUser = 20;

    const startTime = performance.now();

    await Promise.all(
      Array.from({ length: concurrentUsers }, async (_, userId) => {
        for (let i = 0; i < messagesPerUser; i++) {
          await messageQueue.enqueue('test_message', {
            userId: `user-${userId}`,
            recipientId: `recipient-${i}`,
            content: 'Test message',
            type: 'text'
          });
        }
      })
    );

    const endTime = performance.now();
    const totalMessages = concurrentUsers * messagesPerUser;
    const avgTimePerMessage = (endTime - startTime) / totalMessages;

    expect(avgTimePerMessage).toBeLessThan(10); // Average < 10ms per message
  });
});
