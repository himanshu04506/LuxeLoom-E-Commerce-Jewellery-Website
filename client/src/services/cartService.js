import API from './api';
import { clientProductsData } from '../data/clientProductsData';
import { calculateClientPricing } from '../utils/pricingCalculator';

const getLocalCart = () => {
  try {
    const raw = localStorage.getItem('luxeloom_local_cart');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { items: [], totalItemsCount: 0, totalAmount: 0 };
};

const saveLocalCart = (cart) => {
  try {
    localStorage.setItem('luxeloom_local_cart', JSON.stringify(cart));
  } catch (e) {}
};

const activeRates = {
  GOLD_24K: { ratePerGram: 7250 },
  GOLD_22K: { ratePerGram: 6645 },
  GOLD_18K: { ratePerGram: 5437 },
  SILVER_925: { ratePerGram: 88 },
};

export const getCart = async () => {
  try {
    const res = await API.get('/cart', { timeout: 2000 });
    if (res.data && res.data.success) return res.data;
  } catch (err) {}
  return { success: true, cart: getLocalCart() };
};

export const addToCart = async (productId, quantity = 1) => {
  try {
    const res = await API.post('/cart/add', { productId, quantity }, { timeout: 2000 });
    if (res.data && res.data.success) return res.data;
  } catch (err) {}

  const cart = getLocalCart();
  const prod = clientProductsData.find((p) => p._id === productId) || clientProductsData[0];
  const pricing = calculateClientPricing(prod, activeRates);
  const price = pricing ? pricing.finalPrice : 50000;

  const existing = cart.items.find((i) => i.product._id === prod._id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({
      _id: 'item_' + Date.now(),
      product: { ...prod, dynamicPricing: pricing, price },
      quantity,
      priceAtAddition: price,
    });
  }

  cart.totalItemsCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  cart.totalAmount = cart.items.reduce((sum, i) => sum + (i.product.price || price) * i.quantity, 0);
  saveLocalCart(cart);

  return { success: true, cart };
};

export const updateCartQuantity = async (productId, quantity) => {
  try {
    const res = await API.put('/cart/update', { productId, quantity }, { timeout: 2000 });
    if (res.data && res.data.success) return res.data;
  } catch (err) {}

  const cart = getLocalCart();
  const item = cart.items.find((i) => i.product._id === productId);
  if (item) {
    item.quantity = quantity;
    cart.totalItemsCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    cart.totalAmount = cart.items.reduce((sum, i) => sum + (i.product.price || 0) * i.quantity, 0);
    saveLocalCart(cart);
  }
  return { success: true, cart };
};

export const removeFromCart = async (productId) => {
  try {
    const res = await API.delete(`/cart/remove/${productId}`, { timeout: 2000 });
    if (res.data && res.data.success) return res.data;
  } catch (err) {}

  const cart = getLocalCart();
  cart.items = cart.items.filter((i) => i.product._id !== productId);
  cart.totalItemsCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  cart.totalAmount = cart.items.reduce((sum, i) => sum + (i.product.price || 0) * i.quantity, 0);
  saveLocalCart(cart);

  return { success: true, cart };
};

export const clearCart = async () => {
  try {
    const res = await API.delete('/cart/clear', { timeout: 2000 });
    if (res.data && res.data.success) return res.data;
  } catch (err) {}

  const emptyCart = { items: [], totalItemsCount: 0, totalAmount: 0 };
  saveLocalCart(emptyCart);
  return { success: true, cart: emptyCart };
};
