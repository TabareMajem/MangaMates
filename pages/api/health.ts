import { HealthCheckSystem } from '@/lib/monitoring/health-checks';
import { rateLimit } from '@/lib/security/rate-limiter';
import { NextApiRequest, NextApiResponse } from 'next';

const healthCheck = new HealthCheckSystem();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Apply rate limiting
    const rateLimited = await rateLimit(req);
    if (rateLimited) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    const status = await healthCheck.runHealthChecks();
    const statusCode = status.status === 'healthy' ? 200 : 
                      status.status === 'degraded' ? 200 : 503;

    res.status(statusCode).json(status);
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: 'Health check system failure'
    });
  }
}
