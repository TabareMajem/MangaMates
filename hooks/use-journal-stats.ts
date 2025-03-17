"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { getUserStats } from '@/lib/services/user-stats';
import type { Achievement } from '@/lib/types/journal';

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-entry',
    title: 'First Entry',
    description: 'Started your journaling journey',
    unlocked: true
  },
  {
    id: 'three-day-streak',
    title: '3 Day Streak',
    description: 'Wrote for three consecutive days',
    unlocked: false
  },
  {
    id: 'weekly-reflection',
    title: 'Weekly Reflection',
    description: 'Completed a full week of journaling',
    unlocked: false
  }
];

export function useJournalStats() {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);

  useEffect(() => {
    async function fetchStats() {
      if (user) {
        const stats = await getUserStats(user.id);
        setStreak(stats.streak);
        setTotalEntries(stats.totalEntries);
      }
    }
    fetchStats();
  }, [user]);

  return {
    streak,
    totalEntries,
    achievements
  };
}
