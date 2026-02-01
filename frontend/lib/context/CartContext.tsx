'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { cartAPI } from '../api';
import { useAuth } from './AuthContext';
import type { Cart, CartItem } from '../types';
import toast from 'react-hot-toast';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getItemCount: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const cartData = await cartAPI.get();
      setCart(cartData);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error('Failed to fetch cart:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, refreshCart]);

  const addToCart = async (productId: number, quantity: number = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      setLoading(true);
      const updatedCart = await cartAPI.addItem(productId, quantity);
      setCart(updatedCart);
      toast.success('Item added to cart!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to add item to cart';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      setLoading(true);
      await cartAPI.removeItem(itemId);
      await refreshCart();
      toast.success('Item removed from cart');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to remove item from cart';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(itemId);
      return;
    }

    try {
      setLoading(true);
      const updatedCart = await cartAPI.updateItem(itemId, quantity);
      setCart(updatedCart);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update quantity';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await cartAPI.clear();
      setCart(null);
      toast.success('Cart cleared');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to clear cart';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = (): number => {
    return cart?.total || 0;
  };

  const getItemCount = (): number => {
    return cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  const value: CartContextType = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
