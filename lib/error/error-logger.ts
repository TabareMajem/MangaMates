import * as Sentry from '@sentry/nextjs';
import pino, { Logger } from 'pino';

class ErrorLogger {
  private logger: Logger;

  constructor() {
    this.logger = pino({
      name: 'error-logger',
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info'
    });
  }

  error(error: Error, context?: Record<string, any>) {
    this.logger.error({ error, context }, error.message);
    Sentry.captureException(error, { extra: context });
  }

  warn(message: string, context?: Record<string, any>) {
    this.logger.warn({ context }, message);
    Sentry.captureMessage(message, { level: 'warning', extra: context });
  }

  info(message: string, context?: Record<string, any>) {
    this.logger.info({ context }, message);
  }
}

export const errorLogger = new ErrorLogger();
