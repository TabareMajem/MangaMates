interface LockoutConfig {
  maxAttempts: number;
  lockoutDuration: number; // seconds
  attemptWindow: number; // seconds
}

export class AccountLockout {
  private redis: Redis;
  private config: LockoutConfig;

  constructor(config?: Partial<LockoutConfig>) {
    this.redis = Redis.fromEnv();
    this.config = {
      maxAttempts: 5,
      lockoutDuration: 900, // 15 minutes
      attemptWindow: 300, // 5 minutes
      ...config
    };
  }

  async recordFailedAttempt(userId: string): Promise<{
    isLocked: boolean;
    remainingAttempts: number;
    lockoutEnd?: Date;
  }> {
    const key = `lockout:${userId}`;
    const attempts = await this.redis.incr(key);
    
    if (attempts === 1) {
      await this.redis.expire(key, this.config.attemptWindow);
    }

    if (attempts >= this.config.maxAttempts) {
      await this.lockAccount(userId);
      return {
        isLocked: true,
        remainingAttempts: 0,
        lockoutEnd: new Date(Date.now() + this.config.lockoutDuration * 1000)
      };
    }

    return {
      isLocked: false,
      remainingAttempts: this.config.maxAttempts - attempts
    };
  }

  async isAccountLocked(userId: string): Promise<boolean> {
    const lockKey = `lock:${userId}`;
    return await this.redis.exists(lockKey) === 1;
  }

  private async lockAccount(userId: string): Promise<void> {
    const lockKey = `lock:${userId}`;
    await this.redis.set(lockKey, '1', {
      ex: this.config.lockoutDuration
    });
  }
}
