import { errorLogger } from '@/lib/error/error-logger';
import { rateLimit } from '@/lib/security/rate-limiter';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export function withApiMiddleware(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Rate limiting
      await rateLimit(req);

      // CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      if (req.method === 'OPTIONS') {
        return res.status(200).end();
      }

      // Validate authentication if needed
      // await validateAuth(req);

      return await handler(req, res);
    } catch (error) {
      errorLogger.error(error as Error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
