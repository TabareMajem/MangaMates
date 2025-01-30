declare module '@sentry/types' {
  export type Severity = 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';
  
  export interface Event {
    message?: string;
    level?: Severity;
    extra?: Record<string, unknown>;
    tags?: Record<string, string>;
    user?: {
      id: string;
      email?: string;
      username?: string;
    };
  }
}

declare module '@sentry/nextjs' {
  export const Sentry: {
    init(options: any): void;
    captureException(error: Error, options?: any): string;
    captureMessage(message: string, options?: any): string;
    setUser(user: { id: string; email?: string }): void;
  };
}
