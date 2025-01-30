import { Severity } from '@sentry/types';

interface ErrorContext {
  userId?: string;
  action: string;
  component?: string;
  metadata?: Record<string, any>;
}

export class StructuredLogger {
  logError(error: Error, context: ErrorContext) {
    const structuredError = {
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      context,
      severity: this.calculateSeverity(error)
    };

    // Log to different destinations based on environment
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(error, { 
        extra: structuredError 
      });
    }

    console.error(JSON.stringify(structuredError, null, 2));
  }

  private calculateSeverity(error: Error): Severity {
    // Implement severity calculation logic
  }
}
