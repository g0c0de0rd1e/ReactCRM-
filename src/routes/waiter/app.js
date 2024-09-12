// ** React Imports
import { lazy } from 'react';

const SellerAppRoutes = [
  {
    path: 'my-shop',
    component: lazy(() => import('views/waiter-views/order')),
  },
];

export default SellerAppRoutes;
