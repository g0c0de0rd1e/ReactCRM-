// ** React Imports
import { lazy } from 'react';

const SellerAppRoutes = [
  {
    path: 'my-shop',
    component: lazy(() => import('views/seller-views/my-shop')),
  },
  {
    path: 'my-shop/edit',
    component: lazy(() => import('views/seller-views/my-shop/edit')),
  },
  {
    path: 'seller/galleries',
    component: lazy(() => import('views/seller-views/gallaries')),
  },
  {
    path: 'seller/payouts',
    component: lazy(() => import('views/seller-views/payouts')),
  },
  {
    path: 'seller/shop-users',
    component: lazy(() => import('views/seller-views/user/shop-users')),
  },
  {
    path: 'seller/subscriptions',
    component: lazy(() => import('views/seller-views/subscriptions')),
  },
  {
    path: 'seller/transactions',
    component: lazy(() => import('views/seller-views/transactions')),
  },
  {
    path: 'seller/invites',
    component: lazy(() => import('views/seller-views/invites')),
  },
  {
    path: 'seller/discounts',
    component: lazy(() => import('views/seller-views/discounts')),
  },
  {
    path: 'discount/add',
    component: lazy(() => import('views/seller-views/discounts/discount-add')),
  },
  {
    path: 'discount/:id',
    component: lazy(() => import('views/seller-views/discounts/discount-edit')),
  },
  {
    path: 'seller/pos-system',
    component: lazy(() => import('views/seller-views/pos-system')),
  },
  {
    path: 'seller/booking',
    component: lazy(() => import('views/seller-views/booking')),
  },
  {
    path: 'seller/refunds',
    component: lazy(() => import('views/seller-views/refund')),
  },
  {
    path: 'seller/refund/details/:id',
    component: lazy(() => import('views/seller-views/refund/refund-details')),
  },
  {
    path: 'seller/booking-list',
    component: lazy(() => import('views/seller-views/booking-list')),
  },
];

export default SellerAppRoutes;
