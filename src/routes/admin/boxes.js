// ** React Imports
import { lazy } from 'react';

const BoxRoutes = [
  {
    path: 'catalog/boxes',
    component: lazy(() => import('views/boxes')),
  },
  {
    path: 'box/add',
    component: lazy(() => import('views/boxes/box-add')),
  },
  {
    path: 'box/edit/:id',
    component: lazy(() => import('views/boxes/box-edit')),
  },
];

export default BoxRoutes;
