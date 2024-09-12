// ** React Imports
import { lazy } from 'react';

const BookingZoneRoutes = [
  {
    path: 'booking/zone',
    component: lazy(() => import('views/booking-zone')),
  },
  {
    path: 'booking/zone/add',
    component: lazy(() => import('views/booking-zone/zone-add')),
  },
  {
    path: 'booking/zone/:id',
    component: lazy(() => import('views/booking-zone/zone-edit')),
  },
];

export default BookingZoneRoutes;
