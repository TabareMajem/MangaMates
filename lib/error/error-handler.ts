import * as Sentry from '@sentry/nextjs';
import { supabase } from '../supabase';

export class ErrorHandler {
  async handleError(error: Error, context: Record<string, any> = {}) {
    // Log error with context
    console.error('Error occurred:', {
      error: error.message,
      stack: error.stack,
      ...context
    });

    // Send to monitoring service if available
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.captureException(error, {
        extra: context
      });
    }

    // Store in error log
    await this.storeError(error, context);
  }

  private async storeError(error: Error, context: Record<string, any>) {
    try {
      await supabase.from('error_logs').insert({
        error_message: error.message,
        error_stack: error.stack,
        context: context,
        created_at: new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to store error:', err);
    }
  }
}
