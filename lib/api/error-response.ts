import { Logger } from '@/lib/monitoring/logger';
import { NextApiResponse } from 'next';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown, res: NextApiResponse) {
  const logger = new Logger();

  if (error instanceof ApiError) {
    logger.error('API Error', error);
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: error.code
      }
    });
  }

  logger.error('Unexpected Error', error as Error);
  return res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }
  });
}
