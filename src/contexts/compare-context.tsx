"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from "react";
import { toast } from "sonner";
import type { Product } from "@/lib/catalog-types";

const MAX_COMPARE_ITEMS = 4;

interface CompareContextType {
  items: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (id: string) => void;
  toggleCompare: (product: Product) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
  compareCount: number;
  isMaxReached: boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const COMPARE_STORAGE_KEY = "tireandwheel_compare";

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COMPARE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      localStorage.removeItem(COMPARE_STORAGE_KEY);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addToCompare = useCallback((product: Product) => {
    if (items.some((i) => i.id === product.id)) return;
    if (items.length >= MAX_COMPARE_ITEMS) {
      toast.error(`Maximum ${MAX_COMPARE_ITEMS} products for comparison`);
      return;
    }
    toast.success(`Added "${product.name}" to compare`);
    setItems([...items, product]);
  }, [items]);

  const removeFromCompare = useCallback((id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) toast.success(`Removed "${item.name}" from compare`);
    setItems(items.filter((i) => i.id !== id));
  }, [items]);

  const toggleCompare = useCallback((product: Product) => {
    const exists = items.find((i) => i.id === product.id);
    if (exists) {
      toast.success(`Removed "${product.name}" from compare`);
      setItems(items.filter((i) => i.id !== product.id));
      return;
    }
    if (items.length >= MAX_COMPARE_ITEMS) {
      toast.error(`Maximum ${MAX_COMPARE_ITEMS} products for comparison`);
      return;
    }
    toast.success(`Added "${product.name}" to compare`);
    setItems([...items, product]);
  }, [items]);

  const isInCompare = useCallback((id: string) => {
    return items.some((i) => i.id === id);
  }, [items]);

  const clearCompare = useCallback(() => {
    setItems([]);
    toast.success("Comparison cleared");
  }, []);

  const value = useMemo(() => ({
    items,
    addToCompare,
    removeFromCompare,
    toggleCompare,
    isInCompare,
    clearCompare,
    compareCount: items.length,
    isMaxReached: items.length >= MAX_COMPARE_ITEMS,
  }), [items, addToCompare, removeFromCompare, toggleCompare, isInCompare, clearCompare]);

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error("useCompare must be used within CompareProvider");
  }
  return context;
}
