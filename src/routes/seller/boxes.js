// ** React Imports
import { lazy } from 'react';

const SellerBoxesRoutes = [
  {
    path: 'seller/boxes',
    component: lazy(() => import('views/seller-views/boxes')),
  },
  {
    path: 'seller/box/add',
    component: lazy(() => import('views/seller-views/boxes/box-add')),
  },
  {
    path: 'seller/box/edit/:id',
    component: lazy(() => import('views/seller-views/boxes/box-edit')),
  },
];

export default SellerBoxesRoutes;
