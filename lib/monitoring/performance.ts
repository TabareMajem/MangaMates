import { startTransaction } from '@/lib/monitoring';

export function withPerformanceTracking<T extends (...args: any[]) => Promise<any>>(
  name: string,
  fn: T
): T {
  return (async (...args: Parameters<T>) => {
    const transaction = startTransaction(name);
    
    try {
      const result = await fn(...args);
      transaction.setStatus('ok');
      return result;
    } catch (error) {
      transaction.setStatus('error');
      throw error;
    } finally {
      transaction.finish();
    }
  }) as T;
}

// Usage example:
export const getJournalEntries = withPerformanceTracking(
  'getJournalEntries',
  async (userId: string) => {
    // Implementation
  }
);
