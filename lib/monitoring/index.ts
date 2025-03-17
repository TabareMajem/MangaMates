import * as Sentry from '@sentry/nextjs';

export function initializeMonitoring() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: ['localhost', process.env.NEXT_PUBLIC_DOMAIN],
      }),
    ],
    beforeSend(event) {
      // Sanitize sensitive data
      if (event.request?.headers) {
        delete event.request.headers['authorization'];
      }
      return event;
    },
  });
}

export function logError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, { extra: context });
}

export function startTransaction(name: string) {
  return Sentry.startTransaction({ name });
}
