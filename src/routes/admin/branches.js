// ** React Imports
import { lazy } from 'react';

const BranchRoutes = [
  {
    path: 'my-branch',
    component: lazy(() => import('views/my-branch')),
  },
  {
    path: 'my-branch/:uuid',
    component: lazy(() => import('views/my-branch/edit')),
  },
  {
    path: 'branches',
    component: lazy(() => import('views/branches')),
  },
  {
    path: 'branch/add',
    component: lazy(() => import('views/branches/branch-add')),
  },
  {
    path: 'branch/:uuid',
    component: lazy(() => import('views/branches/branch-edit')),
  },
  {
    path: 'branch-clone/:uuid',
    component: lazy(() => import('views/branches/branch-clone')),
  },
];

export default BranchRoutes;
