import { User } from '@/lib/auth/types';
import type { JournalEntry, UserSettings, UserStats } from '@/lib/types/journal';

export const mockUser: User = {
  id: 'mock-user-1',
  name: 'Demo User',
  isAnonymous: true
};

export const mockJournalEntries: Partial<JournalEntry>[] = [
  {
    id: 'entry-1',
    content: 'Today was a productive day...',
    createdAt: new Date(),
    concepts: ['productivity', 'work']
  },
  {
    id: 'entry-2',
    content: 'Feeling grateful for...',
    createdAt: new Date(Date.now() - 86400000),
    concepts: ['gratitude', 'reflection']
  }
];

export const mockUserSettings: UserSettings = {
  id: 'settings-1',
  userId: 'mock-user-1',
  theme: 'system',
  notifications: false,
  privacyMode: true
};

export const mockUserStats: UserStats = {
  userId: 'mock-user-1',
  streak: 3,
  totalEntries: 5,
  lastEntryDate: new Date()
};
