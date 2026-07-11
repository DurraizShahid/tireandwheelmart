"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/catalog-helpers";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  imageSrc: string;
  brand?: string;
  size?: string;
  maxQuantity?: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  formattedSubtotal: string;
  formattedTax: string;
  formattedShipping: string;
  formattedTotal: string;
  isApplyingCoupon: boolean;
  applyCoupon: (code: string) => Promise<boolean>;
  appliedCoupon: string | null;
  discount: number;
  formattedDiscount: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "tireandwheel_cart";
const TAX_RATE = 0.08;
const SHIPPING_RATE = 15;
const FREE_SHIPPING_THRESHOLD = 200;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addToCart = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        toast.success(`Increased "${item.name}" quantity`);
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: Math.min(i.quantity + item.quantity, item.maxQuantity ?? Infinity) }
            : i
        );
      }
      toast.success(`Added "${item.name}" to cart`);
      return [...prev, item];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) toast.success(`Removed "${item.name}" from cart`);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const clamped = i.maxQuantity ? Math.min(quantity, i.maxQuantity) : quantity;
        if (clamped !== quantity) toast.error(`Only ${i.maxQuantity} available`);
        return { ...i, quantity: clamped };
      })
    );
  }, [removeFromCart]);

  const increaseQuantity = useCallback((id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      const newQty = item.quantity + 1;
      if (item.maxQuantity && newQty > item.maxQuantity) {
        toast.error(`Only ${item.maxQuantity} available`);
        return prev;
      }
      return prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i));
    });
  }, []);

  const decreaseQuantity = useCallback((id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      if (item.quantity <= 1) return prev;
      return prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i));
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
    setDiscount(0);
    toast.success("Cart cleared");
  }, []);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const toggleCart = useCallback(() => setCartOpen((v) => !v), []);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const { subtotal, itemCount, computedDiscount, discountedSubtotal, tax, shipping, total } = useMemo(() => {
    const sub = getTotalPrice();
    const count = getTotalItems();
    const compDisc = discount;
    const discSub = Math.max(0, sub - compDisc);
    const t = discSub * TAX_RATE;
    const s = sub >= FREE_SHIPPING_THRESHOLD || items.length === 0 ? 0 : SHIPPING_RATE;
    return {
      subtotal: sub,
      itemCount: count,
      computedDiscount: compDisc,
      discountedSubtotal: discSub,
      tax: t,
      shipping: s,
      total: discSub + t + s,
    };
  }, [items, discount, getTotalPrice, getTotalItems]);

  const applyCoupon = useCallback(async (code: string): Promise<boolean> => {
    setIsApplyingCoupon(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsApplyingCoupon(false);
    if (code.toUpperCase() === "SAVE10") {
      setAppliedCoupon(code.toUpperCase());
      setDiscount(subtotal * 0.1);
      toast.success("Coupon applied: 10% off");
      return true;
    }
    if (code.toUpperCase() === "FREESHIP") {
      setAppliedCoupon(code.toUpperCase());
      toast.success("Free shipping applied");
      return true;
    }
    toast.error("Invalid coupon code");
    return false;
  }, [subtotal]);

  const contextValue = useMemo(() => ({
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    cartOpen,
    openCart,
    closeCart,
    toggleCart,
    subtotal,
    tax,
    shipping,
    total,
    itemCount,
    increaseQuantity,
    decreaseQuantity,
    formattedSubtotal: formatPrice(subtotal),
    formattedTax: formatPrice(tax),
    formattedShipping: formatPrice(shipping),
    formattedTotal: formatPrice(total),
    isApplyingCoupon,
    applyCoupon,
    appliedCoupon,
    discount: computedDiscount,
    formattedDiscount: formatPrice(computedDiscount),
  }), [
    items, addToCart, removeFromCart, updateQuantity, clearCart,
    getTotalPrice, getTotalItems, cartOpen, openCart, closeCart, toggleCart,
    subtotal, tax, shipping, total, itemCount, increaseQuantity, decreaseQuantity,
    isApplyingCoupon, applyCoupon, appliedCoupon, computedDiscount,
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
