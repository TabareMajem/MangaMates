import { db } from '@/lib/db';
import { journalEntries, userStats, userAchievements } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function exportUserData(userId: string) {
  const entries = await db.select().from(journalEntries)
    .where(eq(journalEntries.userId, userId));
  
  const stats = await db.select().from(userStats)
    .where(eq(userStats.userId, userId));
    
  const achievements = await db.select().from(userAchievements)
    .where(eq(userAchievements.userId, userId));

  const exportData = {
    entries,
    stats,
    achievements,
    exportDate: new Date().toISOString(),
    version: '1.0'
  };

  return JSON.stringify(exportData, null, 2);
}

export async function importUserData(userId: string, jsonData: string) {
  const data = JSON.parse(jsonData);
  
  // Validate data structure
  if (!data.entries || !data.stats || !data.achievements) {
    throw new Error('Invalid data format');
  }

  // Begin transaction
  await db.transaction(async (tx) => {
    // Clear existing data
    await tx.delete(journalEntries).where(eq(journalEntries.userId, userId));
    await tx.delete(userStats).where(eq(userStats.userId, userId));
    await tx.delete(userAchievements).where(eq(userAchievements.userId, userId));

    // Import new data
    if (data.entries.length) {
      await tx.insert(journalEntries).values(data.entries);
    }
    if (data.stats.length) {
      await tx.insert(userStats).values(data.stats);
    }
    if (data.achievements.length) {
      await tx.insert(userAchievements).values(data.achievements);
    }
  });
}
