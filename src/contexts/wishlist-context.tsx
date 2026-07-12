"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export interface WishlistItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageSrc: string;
  brand?: string;
  size?: string;
  addedAt: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, "addedAt">) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (item: Omit<WishlistItem, "addedAt">) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
  wishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlistDrawer: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = "tireandwheel_wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const { user, isLoaded: clerkLoaded } = useUser();
  const lastUserId = useRef<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      localStorage.removeItem(WISHLIST_STORAGE_KEY);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !clerkLoaded) return;
    if (user?.id && user.id !== lastUserId.current) {
      lastUserId.current = user.id;
      fetch("/api/wishlist").then((r) => r.json()).then((serverItems: any[]) => {
        if (serverItems.length > 0) {
          setItems(serverItems);
        }
      });
    } else if (!user?.id) {
      lastUserId.current = null;
    }
  }, [user?.id, hydrated, clerkLoaded]);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
      if (user?.id) {
        const payload = items.map((i) => ({ productId: i.id }));
        fetch("/api/wishlist", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: payload }),
        });
      }
    }
  }, [items, hydrated, user?.id]);

  const addToWishlist = useCallback((item: Omit<WishlistItem, "addedAt">) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      toast.success(`Added "${item.name}" to wishlist`);
      return [...prev, { ...item, addedAt: new Date().toISOString() }];
    });
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) toast.success(`Removed "${item.name}" from wishlist`);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const toggleWishlist = useCallback((item: Omit<WishlistItem, "addedAt">) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        toast.success(`Removed "${item.name}" from wishlist`);
        return prev.filter((i) => i.id !== item.id);
      }
      toast.success(`Added "${item.name}" to wishlist`);
      return [...prev, { ...item, addedAt: new Date().toISOString() }];
    });
  }, []);

  const isInWishlist = useCallback((id: string) => {
    return items.some((i) => i.id === id);
  }, [items]);


  const clearWishlist = useCallback(() => {
    setItems([]);
    toast.success("Wishlist cleared");
  }, []);

  const openWishlist = useCallback(() => setWishlistOpen(true), []);
  const closeWishlist = useCallback(() => setWishlistOpen(false), []);
  const toggleWishlistDrawer = useCallback(() => setWishlistOpen((v) => !v), []);

  const contextValue = useMemo(() => ({
    items,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount: items.length,
    wishlistOpen,
    openWishlist,
    closeWishlist,
    toggleWishlistDrawer,
  }), [items, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist,
      clearWishlist, wishlistOpen, openWishlist, closeWishlist, toggleWishlistDrawer]);

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
