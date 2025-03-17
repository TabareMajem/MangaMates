import { RouteObject } from 'react-router-dom';

// Import types only, no JSX
type RouteConfig = {
  path: string;
  element: any; // Using any for now since we can't use JSX here
};

// Define routes as plain objects
const characterRoutes: RouteConfig[] = [
  {
    path: '/talk-with-character',
    element: null // Will be populated in router configuration
  },
  {
    path: '/talk-with-character/:id',
    element: null
  },
  {
    path: '/character/list',
    element: null
  }
];

export default characterRoutes;
