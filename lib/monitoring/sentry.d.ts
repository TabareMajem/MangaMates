declare module '@sentry/nextjs' {
  export function init(options: any): void;
  export function captureException(error: Error, options?: any): void;
  export function captureMessage(message: string, options?: any): void;
}

declare module '@sentry/types' {
  export interface Event {
    message?: string;
    exception?: {
      values: Array<{
        type: string;
        value: string;
        stacktrace?: {
          frames: Array<{
            filename: string;
            function: string;
            lineno: number;
            colno: number;
          }>;
        };
      }>;
    };
  }
}
