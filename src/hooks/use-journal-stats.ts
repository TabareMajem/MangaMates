"use client";

import { useState } from 'react';

interface JournalStats {
  streak: number;
  totalEntries: number;
}

export function useJournalStats(): JournalStats {
  // TODO: Implement actual API call
  const [stats] = useState({
    streak: 3,
    totalEntries: 12
  });

  return stats;
}
