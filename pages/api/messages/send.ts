import { ApiError, handleApiError } from '@/lib/api/error-response';
import { AuthenticatedRequest, withAuth } from '@/lib/middleware/auth-middleware';
import { RateLimiter } from '@/lib/middleware/rate-limiter';
import { MessageQueue } from '@/lib/queue/message-queue';
import { NextApiResponse } from 'next';
import { z } from 'zod';

const messageSchema = z.object({
  platform: z.enum(['line', 'kakao']),
  recipientId: z.string(),
  content: z.string().max(2000),
  type: z.enum(['text', 'image', 'video']),
});

const rateLimiter = new RateLimiter({
  windowMs: 60000, // 1 minute
  max: 30 // 30 requests per minute
});

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    throw new ApiError(405, 'Method not allowed');
  }

  try {
    const data = messageSchema.parse(req.body);
    const messageQueue = new MessageQueue();

    const messageId = await messageQueue.enqueue(
      `${data.platform}_message`,
      {
        userId: req.user.id,
        recipientId: data.recipientId,
        content: data.content,
        type: data.type,
        timestamp: Date.now()
      }
    );

    return res.status(202).json({
      messageId,
      status: 'queued'
    });
  } catch (error) {
    return handleApiError(error, res);
  }
}

export default withAuth(rateLimiter.middleware()(handler));
