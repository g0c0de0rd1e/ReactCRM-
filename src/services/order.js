import request from './request';

const orderService = {
  getAll: (params) =>
    request.get('dashboard/admin/orders/paginate', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/orders/${id}`, { params }),
  export: (params) => request.get(`dashboard/admin/order/export`, { params }),
  create: (data) => request.post('dashboard/admin/orders', data, {}),
  update: (id, data) => request.put(`dashboard/admin/orders/${id}`, data),
  calculate: (params) =>
    request.get(`dashboard/admin/order/products/calculate${params}`),
  updateStatus: (id, params) =>
    request.post(`dashboard/admin/order/${id}/status`, {}, { params }),
  updateDelivery: (id, params) =>
    request.post(`dashboard/admin/order/${id}/deliveryman`, {}, { params }),
  delete: (params) =>
    request.delete(`dashboard/admin/orders/delete`, { params }),
  dropAll: () => request.get(`dashboard/admin/orders/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/orders/restore/all`),
  getAllUserOrder: (id, params) =>
    request.get(`dashboard/admin/user-orders/${id}/paginate`, { params }),
  getUserTopProducts: (id, params) =>
    request.get(`dashboard/admin/user-orders/${id}`, { params }),
};

export default orderService;

// Функция для обновления списка заказов
function updateOrders() {
  orderService.getAll()
    .then(response => {
      console.log('Orders updated:', response.data);
      // Здесь можно обновить состояние или DOM с новыми данными заказов
    })
    .catch(error => {
      console.error('Error updating orders:', error);
    });
}

// Запуск обновления каждые 5 секунд
setInterval(updateOrders, 5000);

// Вызов функции сразу для первоначальной загрузки данных
updateOrders();
