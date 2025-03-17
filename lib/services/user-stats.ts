import { db } from '../firebase/client';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import type { UserStats } from '@/lib/types/journal';

export async function getUserStats(userId: string): Promise<UserStats> {
  try {
    const statsRef = doc(db, 'user_stats', userId);
    const statsDoc = await getDoc(statsRef);

    if (!statsDoc.exists()) {
      const defaultStats: UserStats = {
        userId,
        streak: 0,
        totalEntries: 0
      };
      await setDoc(statsRef, defaultStats);
      return defaultStats;
    }

    return statsDoc.data() as UserStats;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return { userId, streak: 0, totalEntries: 0 };
  }
}

export async function updateStreak(userId: string): Promise<void> {
  const statsRef = doc(db, 'user_stats', userId);
  const statsDoc = await getDoc(statsRef);
  const today = new Date();

  if (!statsDoc.exists()) {
    await setDoc(statsRef, {
      userId,
      streak: 1,
      totalEntries: 1,
      lastEntryDate: today
    });
    return;
  }

  const stats = statsDoc.data() as UserStats;
  const lastEntry = stats.lastEntryDate ? new Date(stats.lastEntryDate) : null;
  const daysSinceLastEntry = lastEntry
    ? Math.floor((today.getTime() - lastEntry.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  await updateDoc(statsRef, {
    totalEntries: (stats.totalEntries || 0) + 1,
    lastEntryDate: today,
    streak: daysSinceLastEntry <= 1 ? (stats.streak || 0) + 1 : 1
  });
}
