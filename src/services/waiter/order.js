import request from '../request';

const orderService = {
  getAll: (params) =>
    request.get('dashboard/waiter/orders/paginate', { params }),
  getById: (id, params) =>
    request.get(`dashboard/waiter/orders/${id}`, { params }),
  create: (data) => request.post('dashboard/waiter/orders', data),
  update: (id, data) => request.put(`dashboard/waiter/order/${id}`, data),
  updateStatus: (id, data) =>
    request.post(`dashboard/waiter/order/${id}/status/update`, data),
  attachToMe: (id) => request.post(`dashboard/waiter/order/${id}/attach/me`),
  updateDelivery: (id, data) =>
    request.post(`dashboard/waiter/order/${id}/deliveryman`, data),
  delete: (params) =>
    request.delete(`dashboard/waiter/orders/delete`, {
      params,
    }),
};

export default orderService;
