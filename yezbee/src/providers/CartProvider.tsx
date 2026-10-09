'use client';

import React, { createContext, useContext, useEffect, useCallback, useState } from 'react';
import { useCartStore } from '@/store/cart-store';
import { useNotificationStore } from '@/store/notification-store';

export interface LocalCartItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  color?: string;
  size?: string;
  quantity: number;
  [key: string]: any;
}

interface CartContextValue {
  items: LocalCartItem[];
  itemCount: number;
  totalAmount: number;
  subtotal: number;
  discountCode: string | null;
  discountAmount: number;
  notes: string;
  addToCart: (item: LocalCartItem | any) => void;
  addItem: (item: any) => void;
  removeFromCart: (id: string | number, size?: string, color?: string) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (id: string | number, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string; discount: number };
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const store = useCartStore();
  const addNotification = useNotificationStore((s) => s.addNotification);
  const [localCart, setLocalCart] = useState<LocalCartItem[]>([]);
  const [discountCode, setDiscountCode] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('yezbee_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setLocalCart(parsed);
        } else if (parsed && typeof parsed === 'object') {
          if (Array.isArray(parsed.state?.items)) {
            setLocalCart(parsed.state.items);
          } else if (Array.isArray(parsed.items)) {
            setLocalCart(parsed.items);
          } else {
            setLocalCart([]);
          }
        } else {
          setLocalCart([]);
        }
      }
      const savedCoupon = localStorage.getItem('yezbee_coupon');
      if (savedCoupon) {
        setDiscountCode(savedCoupon);
      }
    } catch {
      setLocalCart([]);
    }
  }, []);

  useEffect(() => {
    try {
      if (Array.isArray(localCart)) {
        localStorage.setItem('yezbee_cart', JSON.stringify(localCart));
      }
    } catch {
    }
  }, [localCart]);

  const addToCart = useCallback(
    (item: any) => {
      const normalizedItem: LocalCartItem = {
        id: item.id || item.productId,
        name: item.name || '',
        price: Number(item.price) || 0,
        image: item.image || item.thumbnail || '',
        color: item.color || item.variant?.color || '',
        size: item.size || item.variant?.size || '',
        quantity: Number(item.quantity) || 1,
      };

      setLocalCart((prev) => {
        const current = Array.isArray(prev) ? prev : [];
        const existingIndex = current.findIndex(
          (i) =>
            String(i.id) === String(normalizedItem.id) &&
            (i.color || '') === (normalizedItem.color || '') &&
            (i.size || '') === (normalizedItem.size || '')
        );
        if (existingIndex > -1) {
          const updated = [...current];
          updated[existingIndex].quantity += normalizedItem.quantity || 1;
          return updated;
        }
        return [...current, normalizedItem];
      });

      addNotification({
        type: 'success',
        title: 'Added to Bag',
        message: `${normalizedItem.name}${normalizedItem.size ? ` (${normalizedItem.size})` : ''} has been added to your bag.`,
        link: '/cart',
      });
    },
    [addNotification]
  );

  const removeFromCart = useCallback((id: string | number, size?: string, color?: string) => {
    setLocalCart((prev) => {
      if (!Array.isArray(prev)) return [];
      return prev.filter((i) => {
        if (String(i.id) !== String(id)) return true;
        if (size !== undefined && (i.size || '') !== (size || '')) return true;
        if (color !== undefined && (i.color || '') !== (color || '')) return true;
        return false;
      });
    });
  }, []);

  const updateLocalQuantity = useCallback(
    (id: string | number, quantity: number, size?: string, color?: string) => {
      if (quantity <= 0) {
        removeFromCart(id, size, color);
        return;
      }
      setLocalCart((prev) => {
        if (!Array.isArray(prev)) return [];
        return prev.map((i) => {
          const matchesId = String(i.id) === String(id);
          const matchesSize = size === undefined || (i.size || '') === (size || '');
          const matchesColor = color === undefined || (i.color || '') === (color || '');
          if (matchesId && matchesSize && matchesColor) {
            return { ...i, quantity };
          }
          return i;
        });
      });
    },
    [removeFromCart]
  );

  const safeCart = Array.isArray(localCart) ? localCart : [];
  const rawSubtotal = safeCart.reduce((sum, item) => sum + (Number(item?.price) || 0) * (Number(item?.quantity) || 1), 0);
  const discountAmount = discountCode && rawSubtotal > 0 ? Math.min(rawSubtotal, 100) : 0;

  const applyCoupon = useCallback(
    (code: string) => {
      const cleanCode = (code || '').trim().toUpperCase();
      if (!cleanCode) {
        return { success: false, message: 'Please enter a valid promo code.', discount: 0 };
      }
      setDiscountCode(cleanCode);
      try {
        localStorage.setItem('yezbee_coupon', cleanCode);
      } catch {}
      store.applyDiscount(cleanCode, 100);
      return {
        success: true,
        message: `Promo code "${cleanCode}" applied! ₹100 discount added 🎉`,
        discount: 100,
      };
    },
    [store]
  );

  const removeCoupon = useCallback(() => {
    setDiscountCode(null);
    try {
      localStorage.removeItem('yezbee_coupon');
    } catch {}
    store.removeDiscount();
  }, [store]);

  const clearCart = useCallback(() => {
    setLocalCart([]);
    setDiscountCode(null);
    try {
      localStorage.removeItem('yezbee_coupon');
    } catch {}
    store.clearCart();
  }, [store]);

  const value: CartContextValue = {
    items: safeCart,
    itemCount: safeCart.reduce((sum, i) => sum + (Number(i?.quantity) || 1), 0),
    totalAmount: rawSubtotal,
    subtotal: rawSubtotal,
    discountCode,
    discountAmount,
    notes: store.notes,
    addToCart,
    addItem: addToCart,
    removeFromCart,
    removeItem: (productId, variantId) => removeFromCart(productId, variantId),
    updateQuantity: updateLocalQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
