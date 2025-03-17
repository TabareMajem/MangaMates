export interface ErrorEvent {
  message: string;
  error: Error;
  context?: Record<string, unknown>;
  user?: {
    id: string;
    email?: string;
  };
  tags?: Record<string, string>;
}

export interface MonitoringService {
  captureError(event: ErrorEvent): void;
  captureMessage(message: string, level?: 'info' | 'warning' | 'error'): void;
  setUser(user: { id: string; email?: string }): void;
}
