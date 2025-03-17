export interface AchievementCriteria {
  type: 'streak' | 'total_entries' | 'sentiment' | 'concepts' | 'time_of_day';
  value: number;
  comparison: 'gte' | 'eq' | 'lte';
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  criteria: AchievementCriteria[];
  points: number;
}
