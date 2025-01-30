import type { UserStats, JournalEntry } from '@/lib/types/journal';

export const mockStats: UserStats = {
  userId: 'mock-user',
  streak: 3,
  totalEntries: 5,
  lastEntryDate: new Date()
};

export const mockEntries: JournalEntry[] = [
  {
    id: 'mock-1',
    userId: 'mock-user',
    content: 'Today was productive...',
    concepts: ['productivity', 'work'],
    sentiment: 0.8,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
