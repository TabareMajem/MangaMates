import { db } from './init';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import type { EmotionalTrend, CognitivePattern, ThemeAnalysis } from '@/lib/types/analysis';

export async function saveAnalysis(userId: string, analysis: any) {
  try {
    await addDoc(collection(db, 'journal_analysis'), {
      userId,
      ...analysis,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error saving analysis:', error);
    throw error;
  }
}

export async function getEmotionalTrends(userId: string, period = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - period);

  const q = query(
    collection(db, 'journal_analysis'),
    where('userId', '==', userId),
    where('timestamp', '>=', startDate),
    orderBy('timestamp', 'asc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as EmotionalTrend);
}
