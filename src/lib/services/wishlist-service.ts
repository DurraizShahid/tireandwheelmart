import type { ServiceResult } from "./types";
import { success } from "./types";

export interface WishlistItemData {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageSrc: string;
  brand?: string;
  size?: string;
  addedAt: string;
}

export interface WishlistService {
  getItems(): Promise<ServiceResult<WishlistItemData[]>>;
  addItem(item: Omit<WishlistItemData, "addedAt">): Promise<ServiceResult<void>>;
  removeItem(id: string): Promise<ServiceResult<void>>;
  isInList(id: string): Promise<ServiceResult<boolean>>;
  clear(): Promise<ServiceResult<void>>;
}

const STORAGE_KEY = "tireandwheel_wishlist";

function loadItems(): WishlistItemData[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { localStorage.removeItem(STORAGE_KEY); }
  return [];
}

function saveItems(items: WishlistItemData[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function createMockWishlistService(): WishlistService {
  return {
    async getItems() {
      return success(loadItems());
    },

    async addItem(item) {
      const items = loadItems();
      if (!items.some((i) => i.id === item.id)) {
        items.push({ ...item, addedAt: new Date().toISOString() });
        saveItems(items);
      }
      return success(undefined);
    },

    async removeItem(id) {
      saveItems(loadItems().filter((i) => i.id !== id));
      return success(undefined);
    },

    async isInList(id) {
      return success(loadItems().some((i) => i.id === id));
    },

    async clear() {
      saveItems([]);
      return success(undefined);
    },
  };
}
