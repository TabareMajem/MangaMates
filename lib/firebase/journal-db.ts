import { db } from './init';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import type { JournalEntry, JournalAnalysis } from '@/lib/types/journal';

export async function saveJournalEntry(userId: string, entry: JournalEntry) {
  try {
    const docRef = await addDoc(collection(db, 'journal_entries'), {
      ...entry,
      userId,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving journal entry:', error);
    throw error;
  }
}

export async function getJournalEntries(userId: string, startDate?: Date, endDate?: Date) {
  try {
    let q = query(
      collection(db, 'journal_entries'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    if (startDate && endDate) {
      q = query(q, 
        where('createdAt', '>=', startDate),
        where('createdAt', '<=', endDate)
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    throw error;
  }
}
