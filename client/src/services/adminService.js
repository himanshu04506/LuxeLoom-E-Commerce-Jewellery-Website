import API from './api';

export const getAdminStats = async () => {
  const res = await API.get('/admin/stats');
  return res.data;
};

export const addAdminProduct = async (productData) => {
  const res = await API.post('/admin/products', productData);
  return res.data;
};

export const updateAdminProduct = async (id, productData) => {
  const res = await API.put(`/admin/products/${id}`, productData);
  return res.data;
};

export const deleteAdminProduct = async (id) => {
  const res = await API.delete(`/admin/products/${id}`);
  return res.data;
};

export const getAdminOrders = async (status = '') => {
  const res = await API.get('/admin/orders', { params: { status } });
  return res.data;
};

export const updateAdminOrderStatus = async (id, orderStatus, comment = '') => {
  const res = await API.put(`/admin/orders/${id}/status`, { orderStatus, comment });
  return res.data;
};

export const updateAdminMetalRates = async (rates) => {
  const res = await API.put('/admin/metal-rates', { rates });
  return res.data;
};

export const getAdminComplaints = async () => {
  const res = await API.get('/admin/complaints');
  return res.data;
};

export const getAdminUsers = async () => {
  const res = await API.get('/admin/users');
  return res.data;
};

export const toggleAdminUserStatus = async (id) => {
  const res = await API.put(`/admin/users/${id}/toggle`);
  return res.data;
};
