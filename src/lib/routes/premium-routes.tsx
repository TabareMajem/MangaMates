import { RouteObject } from 'react-router-dom';
import { PremiumGuard } from '@/components/premium/premium-guard';
import SocialMediaAnalyzerPage from '@/pages/social-media';
import CreateAgentPage from '@/pages/agents/create';

export const premiumRoutes: RouteObject[] = [
  {
    path: '/social-media',
    element: <PremiumGuard><SocialMediaAnalyzerPage /></PremiumGuard>
  },
  {
    path: '/agents/create',
    element: <PremiumGuard><CreateAgentPage /></PremiumGuard>
  }
];
