import { db } from '../firebase/init';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import type { Achievement } from '@/lib/types/journal';

const ACHIEVEMENT_CRITERIA = {
  CONSISTENT_WRITER: {
    id: 'consistent-writer',
    title: 'Consistent Writer',
    description: 'Write for 7 consecutive days',
    points: 100,
    check: (stats: any) => stats.streak >= 7
  },
  EMOTIONAL_GROWTH: {
    id: 'emotional-growth',
    title: 'Emotional Growth',
    description: 'Show improved emotional awareness over time',
    points: 150,
    check: (analysis: any) => analysis.emotionalGrowthScore >= 0.7
  },
  DEEP_REFLECTOR: {
    id: 'deep-reflector',
    title: 'Deep Reflector',
    description: 'Consistently write detailed, reflective entries',
    points: 200,
    check: (analysis: any) => analysis.reflectionDepth >= 0.8
  }
};

export async function checkAchievements(userId: string, stats: any, analysis: any) {
  const newAchievements: Achievement[] = [];

  for (const criteria of Object.values(ACHIEVEMENT_CRITERIA)) {
    if (criteria.check(stats) || criteria.check(analysis)) {
      const existing = await checkExistingAchievement(userId, criteria.id);
      if (!existing) {
        await unlockAchievement(userId, criteria);
        newAchievements.push(criteria);
      }
    }
  }

  return newAchievements;
}

async function checkExistingAchievement(userId: string, achievementId: string) {
  const q = query(
    collection(db, 'user_achievements'),
    where('userId', '==', userId),
    where('achievementId', '==', achievementId)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

async function unlockAchievement(userId: string, achievement: any) {
  await addDoc(collection(db, 'user_achievements'), {
    userId,
    achievementId: achievement.id,
    unlockedAt: new Date(),
    ...achievement
  });
}
