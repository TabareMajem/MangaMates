import { db } from '../firebase/client';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import type { JournalEntry } from '@/lib/types/journal';

export async function createEntry(userId: string, content: string): Promise<JournalEntry> {
  const now = new Date();
  const entry: JournalEntry = {
    id: `entry-${Date.now()}`,
    userId,
    content,
    concepts: [],
    createdAt: now,
    updatedAt: now
  };

  await addDoc(collection(db, 'journal_entries'), entry);
  return entry;
}

export async function getEntriesByDate(userId: string, date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const q = query(
    collection(db, 'journal_entries'),
    where('userId', '==', userId),
    where('createdAt', '>=', startOfDay),
    where('createdAt', '<=', endOfDay),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as JournalEntry[];
}
