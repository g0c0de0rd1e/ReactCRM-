import request from './request';

const bookingClosedDays = {
  getById: (id) =>
    request.get(`dashboard/admin/booking/shop-closed-dates/${id}`),
  create: (data) =>
    request.post(`dashboard/admin/booking/shop-closed-dates`, data, {}),
  update: (id, data) =>
    request.put(`dashboard/admin/booking/shop-closed-dates/${id}`, data, {}),
  delete: (params) =>
    request.delete(`dashboard/admin/booking/shop-closed-dates/delete`, {
      params,
    }),
};

export default bookingClosedDays;
