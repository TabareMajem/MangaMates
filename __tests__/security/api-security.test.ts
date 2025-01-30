import { RateLimiter } from '@/lib/middleware/rate-limiter';
import handler from '@/pages/api/messages/send';
import { createMocks } from 'node-mocks-http';

describe('API Security', () => {
  it('should prevent SQL injection attempts', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: { authorization: 'Bearer valid-token' },
      body: {
        platform: 'line',
        recipientId: "'; DROP TABLE users; --",
        content: 'Malicious content',
        type: 'text'
      }
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });

  it('should prevent XSS attempts', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: { authorization: 'Bearer valid-token' },
      body: {
        platform: 'line',
        recipientId: 'recipient',
        content: '<script>alert("XSS")</script>',
        type: 'text'
      }
    });

    await handler(req, res);
    const data = JSON.parse(res._getData());
    expect(data.content).not.toContain('<script>');
  });

  it('should enforce rate limits', async () => {
    const rateLimiter = new RateLimiter({
      windowMs: 1000,
      max: 5
    });

    const requests = Array.from({ length: 10 }, () =>
      createMocks({
        method: 'POST',
        headers: { authorization: 'Bearer valid-token' }
      })
    );

    for (const [index, { req, res }] of requests.entries()) {
      await rateLimiter.middleware()(req, res, () => {});
      if (index < 5) {
        expect(res._getStatusCode()).not.toBe(429);
      } else {
        expect(res._getStatusCode()).toBe(429);
      }
    }
  });
});
