import request from './request';

const booking = {
  getAll: (params) => request.get('dashboard/admin/user-bookings', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/user-bookings/${id}`, { params }),
  create: (data) => request.post('dashboard/admin/user-bookings', data),
  delete: (params) =>
    request.delete(`dashboard/admin/user-bookings/delete`, { params }),
  updateStatus: (id, params) =>
    request.post(`dashboard/admin/user-booking/status/${id}`, {}, { params }),
};

export default booking;
