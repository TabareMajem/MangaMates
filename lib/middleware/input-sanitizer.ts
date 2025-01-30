import { Logger } from '@/lib/monitoring/logger';
import { NextApiRequest, NextApiResponse } from 'next';
import { sanitizeHtml } from 'sanitize-html';
import { z } from 'zod';

interface SanitizerConfig {
  maxDepth: number;
  maxLength: number;
  allowedTags: string[];
  allowedAttributes: { [key: string]: string[] };
}

export class InputSanitizer {
  private logger: Logger;
  private config: SanitizerConfig;

  constructor() {
    this.logger = new Logger();
    this.config = {
      maxDepth: 10,
      maxLength: 10000,
      allowedTags: ['b', 'i', 'em', 'strong', 'a'],
      allowedAttributes: {
        a: ['href', 'title', 'target']
      }
    };
  }

  middleware() {
    return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
      if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
        try {
          req.body = this.sanitizeData(req.body);
        } catch (error) {
          this.logger.error('Input sanitization failed', error as Error);
          return res.status(400).json({ error: 'Invalid input data' });
        }
      }
      next();
    };
  }

  private sanitizeData(data: any, depth = 0): any {
    if (depth > this.config.maxDepth) {
      throw new Error('Maximum object depth exceeded');
    }

    if (typeof data === 'string') {
      return this.sanitizeString(data);
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item, depth + 1));
    }

    if (data && typeof data === 'object') {
      const sanitized: { [key: string]: any } = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[this.sanitizeKey(key)] = this.sanitizeData(value, depth + 1);
      }
      return sanitized;
    }

    return data;
  }

  private sanitizeString(value: string): string {
    if (value.length > this.config.maxLength) {
      throw new Error('Input exceeds maximum length');
    }

    // Remove potential XSS content
    const sanitized = sanitizeHtml(value, {
      allowedTags: this.config.allowedTags,
      allowedAttributes: this.config.allowedAttributes
    });

    // Remove potential SQL injection patterns
    const sqlInjectionPattern = /(\b(union|select|insert|update|delete|drop|alter)\b)|(['"])/gi;
    return sanitized.replace(sqlInjectionPattern, '');
  }

  private sanitizeKey(key: string): string {
    // Remove non-alphanumeric characters from object keys
    return key.replace(/[^a-zA-Z0-9_]/g, '');
  }

  validateSchema<T>(schema: z.Schema<T>) {
    return (data: unknown): T => {
      try {
        return schema.parse(data);
      } catch (error) {
        this.logger.error('Schema validation failed', error as Error);
        throw new Error('Invalid input format');
      }
    };
  }
}
