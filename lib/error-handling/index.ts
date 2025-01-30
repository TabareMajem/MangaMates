import { logError } from '../monitoring';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public context?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    logError(error, { code: error.code, context: error.context });
    return { error: error.message, code: error.code, status: error.statusCode };
  }

  const unknownError = error instanceof Error ? error : new Error('Unknown error');
  logError(unknownError);
  return { error: 'Internal server error', code: 'INTERNAL_ERROR', status: 500 };
}

export function withErrorHandling<T>(fn: () => Promise<T>) {
  return async () => {
    try {
      return await fn();
    } catch (error) {
      return handleApiError(error);
    }
  };
}
