import request from '../request';

const productService = {
  getAll: (params) =>
    request.get('dashboard/seller/products/paginate', { params }),
  getAllParent: (params) =>
    request.get('dashboard/seller/products/parent-paginate', { params }),
  getById: (uuid, params) =>
    request.get(`dashboard/seller/products/${uuid}`, { params }),
  create: (data) =>
    request.post(`dashboard/seller/products`, {}, { params: data }),
  sync: (data) =>
    request.post(`dashboard/seller/products/parent/sync`, data, {}),
  export: (params) =>
    request.get(`dashboard/seller/products/export`, { params }),
  import: (data) => request.post('dashboard/seller/products/import', data, {}),
  update: (uuid, params) =>
    request.put(`dashboard/seller/products/${uuid}`, {}, { params }),
  delete: (params) =>
    request.delete(`dashboard/seller/products/delete`, { params }),
  extras: (uuid, data) =>
    request.post(`dashboard/seller/products/${uuid}/extras`, data),
  stocks: (uuid, data) =>
    request.post(`dashboard/seller/products/${uuid}/stocks`, data),
  properties: (uuid, data) =>
    request.post(`dashboard/seller/products/${uuid}/properties`, data),
  setActive: (uuid) =>
    request.post(`dashboard/seller/products/${uuid}/active`, {}),
  getStock: (params) =>
    request.get(`dashboard/seller/stocks/select-paginate`, { params }),
  updateStatus: (uuid, params) =>
    request.get(
      `dashboard/seller/products/${uuid}/status/change`,
      {},
      { params }
    ),
};

export default productService;
