"use client";

import { useState, useEffect } from 'react';

export interface JournalHistoryEntry {
  id: string;
  content: string;
  createdAt: Date;
}

export function useJournalHistory() {
  const [entries, setEntries] = useState<JournalHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const mockEntries: JournalHistoryEntry[] = [
      {
        id: '1',
        content: 'Today was productive...',
        createdAt: new Date(Date.now() - 86400000)
      },
      {
        id: '2',
        content: 'Feeling grateful...',
        createdAt: new Date(Date.now() - 172800000)
      }
    ];

    setEntries(mockEntries);
    setLoading(false);
  }, []);

  return { entries, loading };
}
