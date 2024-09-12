// ** React Imports
import { lazy } from 'react';

const BoxesCategoryRoutes = [
  {
    path: 'catalog/boxes-categories',
    component: lazy(() => import('views/boxes-categories')),
  },
  {
    path: 'box-category/add',
    component: lazy(() => import('views/boxes-categories/category-add')),
  },
  {
    path: 'box-category/edit/:uuid',
    component: lazy(() => import('views/boxes-categories/category-edit')),
  },
  {
    path: 'box-category-clone/:uuid',
    component: lazy(() => import('views/boxes-categories/category-clone')),
  },
  {
    path: 'box-categories/import',
    component: lazy(() => import('views/boxes-categories/category-import')),
  },
];

export default BoxesCategoryRoutes;
