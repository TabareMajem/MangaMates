import { RouteObject } from 'react-router-dom';
import SignInPage from '@/pages/auth/signin';
import SignUpPage from '@/pages/auth/signup';
import InstagramCallbackPage from '@/pages/auth/instagram/callback';
import TwitterCallbackPage from '@/pages/auth/twitter/callback';

export const authRoutes: RouteObject[] = [
  {
    path: '/auth/signin',
    element: <SignInPage />
  },
  {
    path: '/auth/signup',
    element: <SignUpPage />
  },
  {
    path: '/auth/instagram/callback',
    element: <InstagramCallbackPage />
  },
  {
    path: '/auth/twitter/callback',
    element: <TwitterCallbackPage />
  }
];
