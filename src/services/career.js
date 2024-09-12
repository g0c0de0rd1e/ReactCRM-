import request from './request';

const careerService = {
  getAll: (params) => request.get('dashboard/admin/careers', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/careers/${id}`, { params }),
  create: (params) => request.post('dashboard/admin/careers', {}, { params }),
  update: (id, params) =>
    request.put(`dashboard/admin/careers/${id}`, {}, { params }),
  delete: (params) =>
    request.delete(`dashboard/admin/careers/delete`, { params }),
};

export default careerService;
