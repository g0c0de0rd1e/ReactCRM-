// ** React Imports
import { lazy } from 'react';

const SellerBookingTimeRoutes = [
  {
    path: 'booking/time',
    component: lazy(() => import('views/booking-time')),
  },
  {
    path: 'booking/time/add',
    component: lazy(() => import('views/booking-time/time-add')),
  },
  {
    path: 'booking/time/:id',
    component: lazy(() => import('views/booking-time/time-edit')),
  },
];

export default SellerBookingTimeRoutes;
