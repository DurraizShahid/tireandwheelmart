/* eslint-disable @typescript-eslint/no-explicit-any */
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

export function createSupabaseWishlistService(
  userId: string,
  supabase: ReturnType<typeof import("@/lib/supabase/client").createBrowserClient>
): WishlistService {
  async function ensureWishlist(): Promise<string | null> {
    const { data: existing } = await (supabase
      .from("wishlists") as any)
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    if (existing) return existing.id;
    const { data: newWl } = await (supabase
      .from("wishlists") as any)
      .insert({ user_id: userId })
      .select("id")
      .single();
    return (newWl as any)?.id ?? null;
  }

  return {
    async getItems() {
      const wlId = await ensureWishlist();
      if (!wlId) return success([]);
      const { data: rows } = await (supabase
        .from("wishlist_items") as any)
        .select("created_at, products(id, name, slug, price, image_url, brand, specs)")
        .eq("wishlist_id", wlId);
      const items: WishlistItemData[] = ((rows as any[]) ?? []).map((r: any) => {
        const p = r.products ?? {};
        const specs = p.specs ?? {};
        const size = specs.width
          ? `${specs.width}/${specs.aspect_ratio}R${specs.rim_diameter}`
          : undefined;
        return {
          id: p.id,
          slug: p.slug,
          name: p.name,
          price: p.price,
          imageSrc: p.image_url ?? "/placeholder.svg",
          brand: p.brand ?? undefined,
          size,
          addedAt: r.created_at,
        };
      });
      return success(items);
    },

    async addItem(item) {
      const wlId = await ensureWishlist();
      if (!wlId) return success(undefined);
      const existing = await (supabase.from("wishlist_items") as any)
        .select("id")
        .eq("wishlist_id", wlId)
        .eq("product_id", item.id)
        .maybeSingle();
      if (!existing) {
        await (supabase.from("wishlist_items") as any)
          .insert({ wishlist_id: wlId, product_id: item.id });
      }
      return success(undefined);
    },

    async removeItem(id) {
      const wlId = await ensureWishlist();
      if (!wlId) return success(undefined);
      await (supabase.from("wishlist_items") as any)
        .delete()
        .eq("wishlist_id", wlId)
        .eq("product_id", id);
      return success(undefined);
    },

    async isInList(id) {
      const wlId = await ensureWishlist();
      if (!wlId) return success(false);
      const existing = await (supabase.from("wishlist_items") as any)
        .select("id")
        .eq("wishlist_id", wlId)
        .eq("product_id", id)
        .maybeSingle();
      return success(!!existing);
    },

    async clear() {
      const wlId = await ensureWishlist();
      if (!wlId) return success(undefined);
      await (supabase.from("wishlist_items") as any)
        .delete()
        .eq("wishlist_id", wlId);
      return success(undefined);
    },
  };
}
