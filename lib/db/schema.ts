import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const journalEntries = sqliteTable('journal_entries', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  content: text('content').notNull(),
  concepts: text('concepts', { mode: 'json' }).$type<string[]>(),
  sentiment: real('sentiment'),
  aiAnalysis: text('ai_analysis', { mode: 'json' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const userStats = sqliteTable('user_stats', {
  userId: text('user_id').primaryKey(),
  streak: integer('streak').notNull().default(0),
  totalEntries: integer('total_entries').notNull().default(0),
  lastEntryDate: integer('last_entry_date', { mode: 'timestamp' })
});

export const achievements = sqliteTable('achievements', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  criteria: text('criteria', { mode: 'json' })
});

export const userAchievements = sqliteTable('user_achievements', {
  userId: text('user_id').notNull(),
  achievementId: text('achievement_id').notNull(),
  unlockedAt: integer('unlocked_at', { mode: 'timestamp' }).notNull()
});
