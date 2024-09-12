// ** React Imports
import { lazy } from 'react';

const StoryRoutes = [
  {
    path: 'stories',
    component: lazy(() => import('views/story')),
  },
  {
    path: 'story/add',
    component: lazy(() => import('views/story/story-add')),
  },
  {
    path: 'story/:id',
    component: lazy(() => import('views/story/story-edit')),
  },
];

export default StoryRoutes;
