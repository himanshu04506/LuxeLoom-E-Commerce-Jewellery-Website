import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart as addToCartApi, updateCartQuantity as updateQtyApi, removeFromCart as removeApi, clearCart as clearApi } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], totalItemsCount: 0, totalAmount: 0 });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart({ items: [], totalItemsCount: 0, totalAmount: 0 });
      return;
    }
    try {
      setLoading(true);
      const data = await getCart();
      if (data.success) {
        setCart(data.cart);
      }
    } catch (err) {
      console.error('Failed to load cart', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addItem = async (productId, quantity = 1) => {
    if (!isAuthenticated) return { success: false, message: 'Please log in to add items to your cart.' };
    try {
      const data = await addToCartApi(productId, quantity);
      if (data.success) {
        setCart(data.cart);
        setIsCartOpen(true);
      }
      return data;
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to add item to cart.' };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) return;
    try {
      const data = await updateQtyApi(productId, quantity);
      if (data.success) {
        setCart(data.cart);
      }
    } catch (err) {
      console.error('Failed to update quantity', err);
    }
  };

  const removeItem = async (productId) => {
    if (!isAuthenticated) return;
    try {
      const data = await removeApi(productId);
      if (data.success) {
        setCart(data.cart);
      }
    } catch (err) {
      console.error('Failed to remove item', err);
    }
  };

  const clear = async () => {
    if (!isAuthenticated) return;
    try {
      await clearApi();
      setCart({ items: [], totalItemsCount: 0, totalAmount: 0 });
    } catch (err) {
      console.error('Failed to clear cart', err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        isCartOpen,
        setIsCartOpen,
        fetchCart,
        addItem,
        updateQuantity,
        removeItem,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
