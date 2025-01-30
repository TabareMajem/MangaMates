import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { PremiumGuard } from '@/components/premium/premium-guard';

// Lazy load pages
const TalkWithCharacterPage = lazy(() => import('@/pages/talk-with-character'));
const CharacterChatPage = lazy(() => import('@/pages/talk-with-character/[id]'));
const CharacterListPage = lazy(() => import('@/pages/character/list'));

// Define routes without JSX
const characterRoutes: RouteObject[] = [
  {
    path: '/talk-with-character',
    element: {
      type: PremiumGuard,
      props: {
        children: {
          type: TalkWithCharacterPage,
          props: {}
        }
      }
    }
  },
  {
    path: '/talk-with-character/:id',
    element: {
      type: PremiumGuard,
      props: {
        children: {
          type: CharacterChatPage,
          props: {}
        }
      }
    }
  },
  {
    path: '/character/list',
    element: {
      type: CharacterListPage,
      props: {}
    }
  }
];

export default characterRoutes;
