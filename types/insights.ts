export interface Insight {
  id: string;
  userId: string;
  type: 'emotional' | 'behavioral' | 'progress' | 'theme';
  data: Record<string, any>;
  created_at: string;
}

export interface InsightWithRelations extends Insight {
  journal_entries?: JournalEntry[];
  analytics?: AnalyticsData[];
}
