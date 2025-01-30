import { lineAgent } from '@/lib/ai/line-agent';
import { errorLogger } from '@/lib/error/error-logger';
import { withApiMiddleware } from '@/lib/middleware/api-middleware';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { events } = req.body;

    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        await lineAgent.handleMessage(
          event.source.userId,
          event.message.text
        );
      }
    }

    res.status(200).json({ message: 'OK' });
  } catch (error) {
    errorLogger.error(error as Error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export default withApiMiddleware(handler);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
