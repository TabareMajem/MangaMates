import { Logger } from '@/lib/monitoring/logger';
import { supabase } from '@/lib/supabase';
import { NextApiRequest, NextApiResponse } from 'next';
import { ApiError } from '../api/error-response';

export interface AuthenticatedRequest extends NextApiRequest {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export function withAuth(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const logger = new Logger();

    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        throw new ApiError(401, 'Missing authorization header');
      }

      const token = authHeader.split(' ')[1];
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        throw new ApiError(401, 'Invalid or expired token');
      }

      (req as AuthenticatedRequest).user = {
        id: user.id,
        email: user.email!,
        role: user.role!
      };

      return handler(req as AuthenticatedRequest, res);
    } catch (error) {
      logger.error('Authentication failed', error as Error);
      
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          error: { message: error.message }
        });
      }

      return res.status(500).json({
        error: { message: 'Internal server error' }
      });
    }
  };
}
