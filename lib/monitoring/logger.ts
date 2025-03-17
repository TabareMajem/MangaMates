import * as Sentry from '@sentry/nextjs';
import pino from 'pino';

interface LogContext {
  [key: string]: unknown;
}

export class Logger {
  private logger: pino.Logger;

  constructor() {
    this.logger = pino({
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true
        }
      }
    });
  }

  info(message: string, context?: LogContext): void {
    this.logger.info(context || {}, message);
  }

  error(message: string, error: Error, context?: LogContext): void {
    this.logger.error(
      {
        err: {
          message: error.message,
          stack: error.stack,
          ...context
        }
      },
      message
    );

    if (process.env.SENTRY_DSN) {
      Sentry.captureException(error, {
        extra: context
      });
    }
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn(context || {}, message);
  }

  debug(message: string, context?: LogContext): void {
    this.logger.debug(context || {}, message);
  }
}
