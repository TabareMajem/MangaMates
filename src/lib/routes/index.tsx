import { RouteObject } from 'react-router-dom';
import characterRoutes from './character-routes';
import { premiumRoutes } from './premium-routes';
import { authRoutes } from './auth-routes';
import { profileRoutes } from './profile-routes';

export const routes: RouteObject[] = [
  ...characterRoutes,
  ...premiumRoutes,
  ...authRoutes,
  ...profileRoutes
];
