import { createElement } from 'react';
import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { PremiumGuard } from '@/components/premium/premium-guard';

// Lazy load pages
const TalkWithCharacterPage = lazy(() => import('@/pages/talk-with-character'));
const CharacterChatPage = lazy(() => import('@/pages/talk-with-character/[id]'));
const CharacterListPage = lazy(() => import('@/pages/character/list'));
const CharacterProfilePage = lazy(() => import('@/pages/character/[id]'));
const CharacterEditPage = lazy(() => import('@/pages/character/edit/[id]'));
const SocialMediaAnalyzerPage = lazy(() => import('@/pages/social-media'));
const CreateAgentPage = lazy(() => import('@/pages/agents/create'));
const PremiumPreviewPage = lazy(() => import('@/pages/premium-preview'));

// Define routes configuration using createElement
export const routes: RouteObject[] = [
  {
    path: '/character/list',
    element: createElement(CharacterListPage)
  },
  {
    path: '/character/:id',
    element: createElement(CharacterProfilePage)
  },
  {
    path: '/character/edit/:id',
    element: createElement(PremiumGuard, {
      children: createElement(CharacterEditPage)
    })
  },
  {
    path: '/talk-with-character',
    element: createElement(PremiumGuard, {
      children: createElement(TalkWithCharacterPage)
    })
  },
  {
    path: '/talk-with-character/:id',
    element: createElement(PremiumGuard, {
      children: createElement(CharacterChatPage)
    })
  },
  {
    path: '/social-media',
    element: createElement(PremiumGuard, {
      children: createElement(SocialMediaAnalyzerPage)
    })
  },
  {
    path: '/agents/create',
    element: createElement(PremiumGuard, {
      children: createElement(CreateAgentPage)
    })
  },
  {
    path: '/premium-preview',
    element: createElement(PremiumPreviewPage)
  }
];
