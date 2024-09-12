import request from './request';

const bookingZone = {
  getAll: (params) => request.get('dashboard/admin/shop-sections', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/shop-sections/${id}`, { params }),
  create: (data) => request.post('dashboard/admin/shop-sections', data),
  update: (id, data) =>
    request.put(`dashboard/admin/shop-sections/${id}`, data),
  delete: (params) =>
    request.delete('dashboard/admin/shop-sections/delete', { params }),
};

export default bookingZone;
