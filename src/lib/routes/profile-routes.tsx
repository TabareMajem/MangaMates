import { RouteObject } from 'react-router-dom';
import ProfileInsightsPage from '@/pages/profile-insights';
import ProfileSettingsPage from '@/pages/profile/settings';
import ProfileAnalyticsPage from '@/pages/profile/analytics';

export const profileRoutes: RouteObject[] = [
  {
    path: '/profile-insights',
    element: <ProfileInsightsPage />
  },
  {
    path: '/profile/settings',
    element: <ProfileSettingsPage />
  },
  {
    path: '/profile/analytics',
    element: <ProfileAnalyticsPage />
  }
];
