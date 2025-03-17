export class TrialManager {
  private static readonly TRIAL_DURATION = 10 * 60 * 1000; // 10 minutes
  private static trialData: Record<string, {
    startTime: number;
    remainingTime: number;
    hasUsed: boolean;
  }> = {};

  static startTrial(userId: string): void {
    this.trialData[userId] = {
      startTime: Date.now(),
      remainingTime: this.TRIAL_DURATION,
      hasUsed: true
    };
  }

  static getRemainingTime(userId: string): number {
    const trial = this.trialData[userId];
    if (!trial) return 0;

    const elapsed = Date.now() - trial.startTime;
    return Math.max(0, trial.remainingTime - elapsed);
  }

  static isTrialActive(userId: string): boolean {
    return this.getRemainingTime(userId) > 0;
  }

  static hasUsedTrial(userId: string): boolean {
    return this.trialData[userId]?.hasUsed || false;
  }

  static pauseTrial(userId: string): void {
    const trial = this.trialData[userId];
    if (trial) {
      trial.remainingTime = this.getRemainingTime(userId);
      trial.startTime = Date.now();
    }
  }

  static resumeTrial(userId: string): void {
    const trial = this.trialData[userId];
    if (trial) {
      trial.startTime = Date.now();
    }
  }
}
