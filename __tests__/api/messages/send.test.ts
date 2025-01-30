import { MessageQueue } from '@/lib/queue/message-queue';
import { supabase } from '@/lib/supabase';
import handler from '@/pages/api/messages/send';
import { createMocks } from 'node-mocks-http';

jest.mock('@/lib/queue/message-queue');
jest.mock('@/lib/supabase');

describe('Message Send API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          role: 'user'
        }
      },
      error: null
    });
  });

  it('should return 401 without auth header', async () => {
    const { req, res } = createMocks({
      method: 'POST',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual({
      error: { message: 'Missing authorization header' }
    });
  });

  it('should return 405 for non-POST requests', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      headers: {
        authorization: 'Bearer valid-token'
      }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });

  it('should queue valid message and return 202', async () => {
    const mockMessageId = 'test-message-id';
    (MessageQueue.prototype.enqueue as jest.Mock).mockResolvedValue(mockMessageId);

    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        authorization: 'Bearer valid-token'
      },
      body: {
        platform: 'line',
        recipientId: 'recipient-id',
        content: 'Hello!',
        type: 'text'
      }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(202);
    expect(JSON.parse(res._getData())).toEqual({
      messageId: mockMessageId,
      status: 'queued'
    });
  });

  it('should validate message content', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        authorization: 'Bearer valid-token'
      },
      body: {
        platform: 'invalid',
        recipientId: '',
        content: 'x'.repeat(3000),
        type: 'unknown'
      }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
  });
});
