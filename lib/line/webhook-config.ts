import { Redis } from '@upstash/redis';
import { createHmac } from 'crypto';

interface WebhookConfig {
  channelSecret: string;
  webhookUrl: string;
  verifyToken: string;
}

export class LineWebhookManager {
  private config: WebhookConfig;
  private redis: Redis;

  constructor() {
    this.config = {
      channelSecret: process.env.LINE_CHANNEL_SECRET!,
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/line`,
      verifyToken: process.env.LINE_WEBHOOK_VERIFY_TOKEN!
    };
    this.redis = Redis.fromEnv();
  }

  verifySignature(body: string, signature: string): boolean {
    const hash = createHmac('sha256', this.config.channelSecret)
      .update(body)
      .digest('base64');
    return hash === signature;
  }

  async validateRequest(ip: string): Promise<boolean> {
    // LINE's IP ranges
    const lineIpRanges = [
      '203.104.128.0/24',
      '203.104.129.0/24',
      '203.104.160.0/24',
      '203.104.161.0/24',
      '125.209.252.0/24',
      '125.209.253.0/24',
      '125.209.254.0/24',
      '125.209.255.0/24'
    ];

    return lineIpRanges.some(range => this.isIpInRange(ip, range));
  }

  private isIpInRange(ip: string, range: string): boolean {
    const [rangeIp, bits] = range.split('/');
    const mask = ~((1 << (32 - parseInt(bits))) - 1);
    const ipNum = this.ipToNumber(ip);
    const rangeIpNum = this.ipToNumber(rangeIp);
    return (ipNum & mask) === (rangeIpNum & mask);
  }

  private ipToNumber(ip: string): number {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
  }
}
