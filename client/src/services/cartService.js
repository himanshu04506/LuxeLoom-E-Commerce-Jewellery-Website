import API from './api';

export const getCart = async () => {
  const res = await API.get('/cart');
  return res.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const res = await API.post('/cart/add', { productId, quantity });
  return res.data;
};

export const updateCartQuantity = async (productId, quantity) => {
  const res = await API.put('/cart/update', { productId, quantity });
  return res.data;
};

export const removeFromCart = async (productId) => {
  const res = await API.delete(`/cart/remove/${productId}`);
  return res.data;
};

export const clearCart = async () => {
  const res = await API.delete('/cart/clear');
  return res.data;
};
