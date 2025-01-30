import { Redis } from '@upstash/redis';
import { nanoid } from 'nanoid';
import { NextApiRequest, NextApiResponse } from 'next';

export class SecurityMiddleware {
  private redis: Redis;

  constructor() {
    this.redis = Redis.fromEnv();
  }

  async csrfProtection(req: NextApiRequest, res: NextApiResponse, next: () => void) {
    if (req.method === 'GET') {
      const token = nanoid();
      await this.redis.set(`csrf:${token}`, true, { ex: 3600 });
      res.setHeader('X-CSRF-Token', token);
      next();
      return;
    }

    const token = req.headers['x-csrf-token'];
    if (!token || Array.isArray(token)) {
      res.status(403).json({ error: 'Invalid CSRF token' });
      return;
    }

    const isValid = await this.redis.get(`csrf:${token}`);
    if (!isValid) {
      res.status(403).json({ error: 'Invalid CSRF token' });
      return;
    }

    next();
  }

  securityHeaders(_req: NextApiRequest, res: NextApiResponse, next: () => void) {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', this.getCSP());
    next();
  }

  private getCSP(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.line-scdn.net",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self'",
      "connect-src 'self' https://api.line.me https://kapi.kakao.com",
      "frame-src 'self' https://static.line-scdn.net",
      "object-src 'none'",
      "base-uri 'self'"
    ].join('; ');
  }
}
