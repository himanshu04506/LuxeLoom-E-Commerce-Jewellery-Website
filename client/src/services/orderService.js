import API from './api';

export const createOrder = async (orderData) => {
  const res = await API.post('/orders', orderData);
  return res.data;
};

export const getUserOrders = async () => {
  const res = await API.get('/orders');
  return res.data;
};

export const getOrderById = async (id) => {
  const res = await API.get(`/orders/${id}`);
  return res.data;
};

export const cancelOrder = async (id) => {
  const res = await API.put(`/orders/${id}/cancel`);
  return res.data;
};

export const getTrackingInfo = async (orderId) => {
  const res = await API.get(`/tracking/${orderId}`);
  return res.data;
};

// Shipping Addresses API
export const getAddresses = async () => {
  const res = await API.get('/addresses');
  return res.data;
};

export const addAddress = async (data) => {
  const res = await API.post('/addresses', data);
  return res.data;
};

export const updateAddress = async (id, data) => {
  const res = await API.put(`/addresses/${id}`, data);
  return res.data;
};

export const deleteAddress = async (id) => {
  const res = await API.delete(`/addresses/${id}`);
  return res.data;
};

export const setDefaultAddress = async (id) => {
  const res = await API.put(`/addresses/${id}/default`);
  return res.data;
};
