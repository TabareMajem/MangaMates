import { AchievementDefinition } from './types';

export const achievements: AchievementDefinition[] = [
  {
    id: 'first-entry',
    title: 'First Step',
    description: 'Begin your journaling journey',
    icon: 'footprints',
    criteria: [{ type: 'total_entries', value: 1, comparison: 'gte' }],
    points: 10
  },
  {
    id: 'three-day-streak',
    title: 'Getting Started',
    description: 'Write for three consecutive days',
    icon: 'flame',
    criteria: [{ type: 'streak', value: 3, comparison: 'gte' }],
    points: 30
  },
  {
    id: 'weekly-master',
    title: 'Weekly Master',
    description: 'Complete a full week of daily entries',
    icon: 'calendar',
    criteria: [{ type: 'streak', value: 7, comparison: 'gte' }],
    points: 70
  },
  {
    id: 'positive-thinker',
    title: 'Positive Thinker',
    description: 'Maintain positive sentiment across 5 entries',
    icon: 'sun',
    criteria: [{ type: 'sentiment', value: 0.6, comparison: 'gte' }],
    points: 50
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Write 5 entries between 10 PM and 4 AM',
    icon: 'moon',
    criteria: [{ type: 'time_of_day', value: 5, comparison: 'gte' }],
    points: 40
  },
  {
    id: 'deep-thinker',
    title: 'Deep Thinker',
    description: 'Write an entry with profound insights',
    icon: 'brain',
    criteria: [{ type: 'concepts', value: 5, comparison: 'gte' }],
    points: 60
  }
];
