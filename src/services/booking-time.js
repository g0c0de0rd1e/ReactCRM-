import request from './request';

const bookingTime = {
  getAll: (params) => request.get('dashboard/admin/bookings', { params }),
  getById: (id) => request.get(`dashboard/admin/bookings/${id}`),
  create: (data) => request.post('dashboard/admin/bookings', data),
  update: (id, data) => request.put(`dashboard/admin/bookings/${id}`, data),
  delete: (params) =>
    request.delete('dashboard/admin/bookings/delete', { params }),
};

export default bookingTime;
