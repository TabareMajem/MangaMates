"use client";

import { getJournalEntries } from '@/lib/services/journal-service';
import { JournalEntry } from '@/types/journal';
import { useEffect, useState } from 'react';

export function JournalViewer({ userId }: { userId: string }) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJournalEntries(userId)
      .then(setEntries)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div>Loading journal entries...</div>;

  return (
    <div className="space-y-4">
      {entries.map(entry => (
        <div key={entry.id} className="p-4 bg-white rounded-lg shadow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">
              {new Date(entry.created_at).toLocaleDateString()}
            </h3>
            {entry.sentimentAnalysis && (
              <div className="text-sm text-gray-500">
                Mood: {(entry.sentimentAnalysis.sentiment * 100).toFixed(0)}%
              </div>
            )}
          </div>
          <p className="text-gray-700">{entry.content}</p>
          {entry.themes && entry.themes.length > 0 && (
            <div className="mt-2 flex gap-2">
              {entry.themes.map(theme => (
                <span
                  key={theme}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {theme}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
