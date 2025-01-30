export interface UserStats {
  userId: string;
  streak: number;
  totalEntries: number;
  lastEntryDate?: Date;
}

export interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  concepts?: string[];
  sentiment?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  points?: number;
}
