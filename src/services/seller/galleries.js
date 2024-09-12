import request from '../request';

const sellerGalleries = {
  getAll: (params) => request.get('dashboard/seller/galleries', { params }),
  create: (data) => request.post(`dashboard/seller/galleries`, data),
  delete: (params) =>
    request.post(`dashboard/galleries/storage/files/delete`, {}, { params }),

  deleteAll: (id) => request.delete(`dashboard/seller/galleries/${id}`),
};

export default sellerGalleries;
