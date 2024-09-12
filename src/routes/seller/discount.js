// ** React Imports
import { lazy } from 'react';

const DiscountRoutes = [
  {
    path: 'seller/discounts',
    component: lazy(() => import('views/seller-views/discounts')),
  },
  {
    path: 'seller/discount/add',
    component: lazy(() => import('views/seller-views/discounts/discount-add')),
  },
  {
    path: 'seller/discount/:id',
    component: lazy(() => import('views/seller-views/discounts/discount-edit')),
  },
];

export default DiscountRoutes;
