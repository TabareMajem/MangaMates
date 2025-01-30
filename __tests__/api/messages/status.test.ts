import { MessageDeliveryTracker } from '@/lib/messaging/delivery-tracker';
import { supabase } from '@/lib/supabase';
import handler from '@/pages/api/messages/status';
import { createMocks } from 'node-mocks-http';

jest.mock('@/lib/supabase');
jest.mock('@/lib/messaging/delivery-tracker');

describe('Message Status API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'test-user' } },
      error: null
    });
  });

  it('should return message status', async () => {
    const mockStatus = {
      messageId: 'test-id',
      status: 'delivered',
      timestamp: Date.now()
    };

    (MessageDeliveryTracker.prototype.getDeliveryStatus as jest.Mock)
      .mockResolvedValue(mockStatus);

    const { req, res } = createMocks({
      method: 'GET',
      headers: { authorization: 'Bearer token' },
      query: { id: 'test-id' }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(mockStatus);
  });

  it('should handle non-existent messages', async () => {
    (MessageDeliveryTracker.prototype.getDeliveryStatus as jest.Mock)
      .mockResolvedValue(null);

    const { req, res } = createMocks({
      method: 'GET',
      headers: { authorization: 'Bearer token' },
      query: { id: 'non-existent' }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);
  });
});
