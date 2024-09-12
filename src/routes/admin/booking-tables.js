// ** React Imports
import { lazy } from 'react';

const SellerBookingTableRoutes = [
  {
    path: 'booking/tables',
    component: lazy(() => import('views/booking-table')),
  },
  {
    path: 'booking/table/add',
    component: lazy(() => import('views/booking-table/table-add')),
  },
  {
    path: 'booking/table/:id',
    component: lazy(() => import('views/booking-table/table-edit')),
  },
  {
    path: 'booking/table/clone/:id',
    component: lazy(() => import('views/booking-table/table-clone')),
  },
];

export default SellerBookingTableRoutes;
