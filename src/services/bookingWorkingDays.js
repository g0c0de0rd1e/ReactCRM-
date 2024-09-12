import request from './request';

const bookingWorkingDays = {
  getById: (id) =>
    request.get(`dashboard/admin/booking/shop-working-days/${id}`),
  create: (data) =>
    request.post(`dashboard/admin/booking/shop-working-day`, data, {}),
  update: (id, data) =>
    request.put(`dashboard/admin/booking/shop-working-days/${id}`, data, {}),
  delete: (params) =>
    request.delete(`dashboard/admin/booking/shop-working-days`, { params }),
};

export default bookingWorkingDays;
