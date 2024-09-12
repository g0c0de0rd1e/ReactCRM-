// ** React Imports
import { lazy } from 'react';

const DiscountRoutes = [
  {
    path: 'catalog/discounts',
    component: lazy(() => import('views/discounts')),
  },
  {
    path: 'discount/add',
    component: lazy(() => import('views/discounts/discount-add')),
  },
  {
    path: 'discount/:id',
    component: lazy(() => import('views/discounts/discount-edit')),
  },
];

export default DiscountRoutes;
