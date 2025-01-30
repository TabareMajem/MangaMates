import { sendEmail } from '@/lib/email/mailer';
import { Severity } from '@sentry/types';
import { Redis } from '@upstash/redis';

interface AlertRule {
  id: string;
  name: string;
  condition: (metrics: any) => boolean;
  severity: Severity;
  cooldown: number; // minutes
  notifyChannels: string[];
}

interface AlertNotification {
  ruleId: string;
  timestamp: number;
  metrics: any;
  severity: Severity;
}

export class AlertSystem {
  private redis: Redis;
  private rules: Map<string, AlertRule> = new Map();

  constructor() {
    this.redis = Redis.fromEnv();
    this.registerDefaultRules();
  }

  registerRule(rule: AlertRule) {
    this.rules.set(rule.id, rule);
  }

  async checkMetrics(metrics: any) {
    for (const rule of this.rules.values()) {
      try {
        if (rule.condition(metrics)) {
          await this.handleAlert(rule, metrics);
        }
      } catch (error) {
        console.error(`Error checking rule ${rule.id}:`, error);
      }
    }
  }

  private async handleAlert(rule: AlertRule, metrics: any) {
    const lastAlert = await this.getLastAlert(rule.id);
    const now = Date.now();

    // Check cooldown
    if (lastAlert && (now - lastAlert.timestamp) < rule.cooldown * 60 * 1000) {
      return;
    }

    const notification: AlertNotification = {
      ruleId: rule.id,
      timestamp: now,
      metrics,
      severity: rule.severity
    };

    await this.storeAlert(notification);
    await this.sendNotifications(rule, notification);
  }

  private async storeAlert(notification: AlertNotification) {
    const key = `alert:${notification.ruleId}:${notification.timestamp}`;
    await this.redis.set(key, notification, { ex: 86400 }); // 24 hours
  }

  private async getLastAlert(ruleId: string): Promise<AlertNotification | null> {
    const keys = await this.redis.keys(`alert:${ruleId}:*`);
    if (keys.length === 0) return null;

    const latest = keys.sort().pop()!;
    return this.redis.get(latest);
  }

  private async sendNotifications(rule: AlertRule, notification: AlertNotification) {
    for (const channel of rule.notifyChannels) {
      if (channel.startsWith('email:')) {
        const email = channel.split(':')[1];
        await sendEmail({
          to: email,
          template: 'alert-notification',
          data: {
            ruleName: rule.name,
            severity: notification.severity,
            metrics: notification.metrics,
            timestamp: new Date(notification.timestamp).toISOString()
          }
        });
      }
      // Add more notification channels (Slack, SMS, etc.)
    }
  }

  private registerDefaultRules() {
    // High Error Rate Rule
    this.registerRule({
      id: 'high-error-rate',
      name: 'High Error Rate',
      severity: 'error',
      cooldown: 15,
      notifyChannels: [`email:${process.env.ALERT_EMAIL}`],
      condition: (metrics) => {
        return metrics.errorRate > 0.05; // 5% error rate
      }
    });

    // High Latency Rule
    this.registerRule({
      id: 'high-latency',
      name: 'High API Latency',
      severity: 'warning',
      cooldown: 10,
      notifyChannels: [`email:${process.env.ALERT_EMAIL}`],
      condition: (metrics) => {
        return metrics.p95Latency > 1000; // 1 second
      }
    });
  }
}
