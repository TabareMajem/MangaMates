"use client";

import { getInsights } from '@/lib/services/insights-service';
import { Insight } from '@/types/insights';
import { useEffect, useState } from 'react';
import { AnalyticsDashboard } from '../analytics/AnalyticsDashboard';
import { JournalViewer } from '../journal/JournalViewer';
import { InsightCards } from './InsightCards';

export function InsightsViewer({ userId }: { userId: string }) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<Insight['type']>('emotional');

  useEffect(() => {
    getInsights(userId, activeType)
      .then(setInsights)
      .finally(() => setLoading(false));
  }, [userId, activeType]);

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveType('emotional')}
          className={`px-4 py-2 rounded ${
            activeType === 'emotional' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
        >
          Emotional
        </button>
        <button
          onClick={() => setActiveType('behavioral')}
          className={`px-4 py-2 rounded ${
            activeType === 'behavioral' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
        >
          Behavioral
        </button>
        <button
          onClick={() => setActiveType('progress')}
          className={`px-4 py-2 rounded ${
            activeType === 'progress' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
        >
          Progress
        </button>
      </div>

      {loading ? (
        <div>Loading insights...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <AnalyticsDashboard userId={userId} />
          <JournalViewer userId={userId} />
          <InsightCards insights={insights} />
        </div>
      )}
    </div>
  );
}
