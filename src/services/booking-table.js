import request from './request';

const bookingTable = {
  getAll: (params) => request.get('dashboard/admin/tables', { params }),
  checkTable: (id, params) =>
    request.get(`dashboard/admin/disable-dates/table/${id}`, { params }),
  getById: (id) => request.get(`dashboard/admin/tables/${id}`),
  create: (data) => request.post('dashboard/admin/tables', data),
  update: (id, data) => request.put(`dashboard/admin/tables/${id}`, data),
  delete: (params) =>
    request.delete('dashboard/admin/tables/delete', { params }),
  getAllRestTables: (params) => request.get('rest/booking/tables', { params }),
};

export default bookingTable;
