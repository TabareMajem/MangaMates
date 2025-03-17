import { KakaoMessageHandler } from '@/lib/kakao/message-handler';
import { MessageDeliveryTracker } from '@/lib/messaging/delivery-tracker';
import { MessageQueue } from '@/lib/queue/message-queue';
import { Redis } from '@upstash/redis';

jest.mock('@upstash/redis');

describe('Message Flow Integration', () => {
  let messageQueue: MessageQueue;
  let kakaoHandler: KakaoMessageHandler;
  let deliveryTracker: MessageDeliveryTracker;

  beforeEach(() => {
    jest.clearAllMocks();
    messageQueue = new MessageQueue();
    kakaoHandler = new KakaoMessageHandler();
    deliveryTracker = new MessageDeliveryTracker();
  });

  it('should process message through the entire flow', async () => {
    // Queue message
    const messageId = await messageQueue.enqueue('kakao_message', {
      userId: 'test-user',
      recipientId: 'recipient-id',
      content: 'Test message',
      type: 'text'
    });

    // Verify message queued
    expect(messageId).toBeDefined();

    // Process message
    const result = await kakaoHandler.sendMessage('recipient-id', {
      type: 'text',
      content: 'Test message'
    });

    expect(result).toBe(true);

    // Track delivery
    await deliveryTracker.trackDelivery(messageId, 'kakao', 'delivered');

    // Verify final status
    const status = await deliveryTracker.getDeliveryStatus(messageId);
    expect(status?.status).toBe('delivered');
  });

  it('should handle failed messages appropriately', async () => {
    // Mock failure
    (Redis.prototype.incr as jest.Mock).mockRejectedValue(new Error('Redis error'));

    const messageId = await messageQueue.enqueue('kakao_message', {
      userId: 'test-user',
      recipientId: 'recipient-id',
      content: 'Test message',
      type: 'text'
    });

    await deliveryTracker.trackDelivery(messageId, 'kakao', 'failed');

    const status = await deliveryTracker.getDeliveryStatus(messageId);
    expect(status?.status).toBe('failed');
  });
});
