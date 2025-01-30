import type { NextApiRequest, NextApiResponse } from 'next';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export type ApiHandler<T = any> = (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<T>>
) => Promise<void> | void;

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}
