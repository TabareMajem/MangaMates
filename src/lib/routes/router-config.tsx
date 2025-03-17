import { createElement } from 'react';
import { RouteObject } from 'react-router-dom';
import TalkWithCharacterPage from '@/pages/talk-with-character';
import CharacterChatPage from '@/pages/talk-with-character/[id]';
import CharacterListPage from '@/pages/character/list';
import CharacterEditPage from '@/pages/character/edit/[id]';
import { PremiumGuard } from '@/components/premium/premium-guard';

export const characterRoutes: RouteObject[] = [
  {
    path: '/character/list',
    element: createElement(CharacterListPage)
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
    path: '/character/edit/:id',
    element: createElement(PremiumGuard, {
      children: createElement(CharacterEditPage)
    })
  }
];
