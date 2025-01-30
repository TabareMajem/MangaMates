export interface AnalyticsEvent {
  userId: string;
  type: 'page_view' | 'interaction' | 'feature_usage' | 'error' | 'performance';
  data: Record<string, any>;
  timestamp?: string;
}

export interface AnalyticsData {
  id: string;
  user_id: string;
  event_type: string;
  event_data: Record<string, any>;
  timestamp: string;
}
