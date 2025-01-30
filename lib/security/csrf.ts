import { Redis } from '@upstash/redis';
import { createHash, randomBytes } from 'crypto';

export class CSRFProtection {
  private redis: Redis;
  private readonly TOKEN_LENGTH = 32;
  private readonly TOKEN_EXPIRY = 3600; // 1 hour

  constructor() {
    this.redis = Redis.fromEnv();
  }

  async generateToken(sessionId: string): Promise<string> {
    const token = randomBytes(this.TOKEN_LENGTH).toString('hex');
    const hash = this.hashToken(token);
    
    await this.redis.set(
      `csrf:${sessionId}`,
      hash,
      { ex: this.TOKEN_EXPIRY }
    );

    return token;
  }

  async validateToken(sessionId: string, token: string): Promise<boolean> {
    const storedHash = await this.redis.get<string>(`csrf:${sessionId}`);
    if (!storedHash) return false;

    const hash = this.hashToken(token);
    return hash === storedHash;
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
