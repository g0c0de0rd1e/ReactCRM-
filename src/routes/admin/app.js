// ** React Imports
import { lazy } from 'react';

const AppRoutes = [
  {
    path: 'dashboard',
    component: lazy(() => import('views/dashboard')),
  },
  {
    path: 'payouts',
    component: lazy(() => import('views/admin-payouts')),
  },
  {
    path: 'my-branch-galleries',
    component: lazy(() => import('views/my-branch-galleries')),
  },
  {
    path: 'settings/sms-payload',
    component: lazy(() => import('views/sms-payload')),
  },
  {
    path: 'settings/sms-payload/add',
    component: lazy(() => import('views/sms-payload/sms-add')),
  },
  {
    path: 'settings/sms-payload/:type',
    component: lazy(() => import('views/sms-payload/sms-edit')),
  },
  {
    path: 'pos-system',
    component: lazy(() => import('views/pos-system')),
  },
  {
    path: 'cashback',
    component: lazy(() => import('views/cashback')),
  },
  {
    path: 'stories',
    component: lazy(() => import('views/story')),
  },
  {
    path: 'email/subscriber',
    component: lazy(() => import('views/email-subscribers')),
  },
  {
    path: 'subscriber',
    component: lazy(() => import('views/subscriber')),
  },
  {
    path: 'chat',
    component: lazy(() => import('views/chat')),
  },
  {
    path: 'transactions',
    component: lazy(() => import('views/transactions')),
  },
  {
    path: 'payout-requests',
    component: lazy(() => import('views/payout-requests')),
  },
  {
    path: 'catalog',
    component: lazy(() => import('views/catalog')),
  },
  {
    path: 'settings/terms',
    component: lazy(() => import('views/privacy/terms')),
  },
  {
    path: 'bonus/list',
    component: lazy(() => import('views/bonus')),
  },
  {
    path: 'booking',
    component: lazy(() => import('views/booking')),
  },
  {
    path: 'booking-list',
    component: lazy(() => import('views/booking-list')),
  },
];

export default AppRoutes;
