import { Logger } from '@/lib/monitoring/logger';
import { Redis } from '@upstash/redis';
import { createHash } from 'crypto';
import { sign, verify } from 'jsonwebtoken';

interface SessionConfig {
  accessTokenExpiry: number;  // in seconds
  refreshTokenExpiry: number; // in seconds
  maxSessions: number;
}

interface TokenPayload {
  userId: string;
  sessionId: string;
  type: 'access' | 'refresh';
}

export class SessionManager {
  private redis: Redis;
  private logger: Logger;
  private config: SessionConfig;

  constructor() {
    this.redis = Redis.fromEnv();
    this.logger = new Logger();
    this.config = {
      accessTokenExpiry: 15 * 60, // 15 minutes
      refreshTokenExpiry: 7 * 24 * 60 * 60, // 7 days
      maxSessions: 5
    };
  }

  async createSession(userId: string, deviceInfo: any): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const sessionId = createHash('sha256')
      .update(`${userId}:${Date.now()}:${Math.random()}`)
      .digest('hex');

    // Check and enforce max sessions
    await this.enforceMaxSessions(userId);

    // Store session info
    await this.redis.hset(`sessions:${userId}`, {
      [sessionId]: JSON.stringify({
        createdAt: Date.now(),
        deviceInfo,
        lastUsed: Date.now()
      })
    });

    const accessToken = this.generateToken(userId, sessionId, 'access');
    const refreshToken = this.generateToken(userId, sessionId, 'refresh');

    // Store refresh token hash
    const refreshTokenHash = this.hashToken(refreshToken);
    await this.redis.set(
      `refresh_token:${refreshTokenHash}`,
      userId,
      { ex: this.config.refreshTokenExpiry }
    );

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  } | null> {
    try {
      const payload = verify(refreshToken, process.env.JWT_SECRET!) as TokenPayload;
      const refreshTokenHash = this.hashToken(refreshToken);
      
      // Verify refresh token is valid and not reused
      const storedUserId = await this.redis.get(`refresh_token:${refreshTokenHash}`);
      if (!storedUserId || storedUserId !== payload.userId) {
        await this.revokeUserSessions(payload.userId);
        return null;
      }

      // Delete used refresh token
      await this.redis.del(`refresh_token:${refreshTokenHash}`);

      // Generate new tokens
      const newAccessToken = this.generateToken(payload.userId, payload.sessionId, 'access');
      const newRefreshToken = this.generateToken(payload.userId, payload.sessionId, 'refresh');

      // Store new refresh token
      const newRefreshTokenHash = this.hashToken(newRefreshToken);
      await this.redis.set(
        `refresh_token:${newRefreshTokenHash}`,
        payload.userId,
        { ex: this.config.refreshTokenExpiry }
      );

      // Update session last used
      await this.updateSessionLastUsed(payload.userId, payload.sessionId);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      this.logger.error('Token refresh failed', error as Error);
      return null;
    }
  }

  async revokeSession(userId: string, sessionId: string): Promise<void> {
    await this.redis.hdel(`sessions:${userId}`, sessionId);
  }

  async revokeUserSessions(userId: string): Promise<void> {
    await this.redis.del(`sessions:${userId}`);
  }

  private async enforceMaxSessions(userId: string): Promise<void> {
    const sessions = await this.redis.hgetall(`sessions:${userId}`);
    if (!sessions) return;

    const sessionEntries = Object.entries(sessions)
      .map(([id, data]) => ({
        id,
        data: JSON.parse(data as string)
      }))
      .sort((a, b) => b.data.lastUsed - a.data.lastUsed);

    if (sessionEntries.length >= this.config.maxSessions) {
      // Remove oldest sessions
      const toRemove = sessionEntries.slice(this.config.maxSessions - 1);
      for (const session of toRemove) {
        await this.revokeSession(userId, session.id);
      }
    }
  }

  private generateToken(userId: string, sessionId: string, type: 'access' | 'refresh'): string {
    const expiry = type === 'access' 
      ? this.config.accessTokenExpiry 
      : this.config.refreshTokenExpiry;

    return sign(
      { userId, sessionId, type },
      process.env.JWT_SECRET!,
      { expiresIn: expiry }
    );
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private async updateSessionLastUsed(userId: string, sessionId: string): Promise<void> {
    const session = await this.redis.hget(`sessions:${userId}`, sessionId);
    if (session) {
      const sessionData = JSON.parse(session);
      sessionData.lastUsed = Date.now();
      await this.redis.hset(`sessions:${userId}`, {
        [sessionId]: JSON.stringify(sessionData)
      });
    }
  }
}
