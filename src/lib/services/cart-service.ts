/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ServiceResult } from "./types";
import { success, failure } from "./types";

export interface CartItemData {
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

export interface CartSummary {
  subtotal: number;
  discount: number;
  discountedSubtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}

export interface CartService {
  getItems(): Promise<ServiceResult<CartItemData[]>>;
  addItem(item: CartItemData): Promise<ServiceResult<void>>;
  updateQuantity(id: string, quantity: number): Promise<ServiceResult<void>>;
  removeItem(id: string): Promise<ServiceResult<void>>;
  clear(): Promise<ServiceResult<void>>;
  getSummary(items: CartItemData[], discount?: number): CartSummary;
}

const STORAGE_KEY = "tireandwheel_cart";

function loadItems(): CartItemData[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { localStorage.removeItem(STORAGE_KEY); }
  return [];
}

function saveItems(items: CartItemData[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function createMockCartService(): CartService {
  return {
    async getItems() {
      return success(loadItems());
    },

    async addItem(item) {
      const items = loadItems();
      const existing = items.find((i) => i.id === item.id);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + item.quantity, item.maxQuantity ?? Infinity);
      } else {
        items.push(item);
      }
      saveItems(items);
      return success(undefined);
    },

    async updateQuantity(id, quantity) {
      const items = loadItems();
      const item = items.find((i) => i.id === id);
      if (!item) return failure("NOT_FOUND", "Item not in cart");
      if (quantity <= 0) {
        saveItems(items.filter((i) => i.id !== id));
      } else {
        item.quantity = item.maxQuantity ? Math.min(quantity, item.maxQuantity) : quantity;
        saveItems(items);
      }
      return success(undefined);
    },

    async removeItem(id) {
      saveItems(loadItems().filter((i) => i.id !== id));
      return success(undefined);
    },

    async clear() {
      saveItems([]);
      return success(undefined);
    },

    getSummary(items, discount = 0) {
      const subtotal = items.reduce((t, i) => t + i.price * i.quantity, 0);
      const discountedSubtotal = Math.max(0, subtotal - discount);
      const tax = discountedSubtotal * 0.08;
      const shipping = subtotal >= 200 || items.length === 0 ? 0 : 15;
      return {
        subtotal,
        discount,
        discountedSubtotal,
        tax,
        shipping,
        total: discountedSubtotal + tax + shipping,
        itemCount: items.reduce((t, i) => t + i.quantity, 0),
      };
    },
  };
}

export function createSupabaseCartService(
  userId: string,
  supabase: ReturnType<typeof import("@/lib/supabase/client").createBrowserClient>
): CartService {
  async function ensureCart(): Promise<string | null> {
    const { data: existing } = await (supabase
      .from("carts") as any)
      .select("id")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();
    if (existing) return existing.id;
    const { data: newCart } = await (supabase
      .from("carts") as any)
      .insert({ user_id: userId })
      .select("id")
      .single();
    return (newCart as any)?.id ?? null;
  }

  return {
    async getItems() {
      const cartId = await ensureCart();
      if (!cartId) return success([]);
      const { data: rows } = await (supabase
        .from("cart_items") as any)
        .select("product_id, quantity, products(id, name, slug, price, image_url, brand, stock_quantity, specs)")
        .eq("cart_id", cartId);
      const items: CartItemData[] = ((rows as any[]) ?? []).map((r: any) => {
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
          quantity: r.quantity,
          imageSrc: p.image_url ?? "/placeholder.svg",
          brand: p.brand ?? undefined,
          size,
          maxQuantity: p.stock_quantity ?? undefined,
        };
      });
      return success(items);
    },

    async addItem(item) {
      const cartId = await ensureCart();
      if (!cartId) return failure("UNKNOWN", "Could not create cart");
      const { data: existing } = await (supabase
        .from("cart_items") as any)
        .select("id, quantity")
        .eq("cart_id", cartId)
        .eq("product_id", item.id)
        .maybeSingle();
      if (existing) {
        const newQty = Math.min(existing.quantity + item.quantity, item.maxQuantity ?? 999);
        await (supabase.from("cart_items") as any)
          .update({ quantity: newQty })
          .eq("id", existing.id);
      } else {
        await (supabase.from("cart_items") as any)
          .insert({ cart_id: cartId, product_id: item.id, quantity: item.quantity });
      }
      return success(undefined);
    },

    async updateQuantity(id, quantity) {
      const cartId = await ensureCart();
      if (!cartId) return failure("UNKNOWN", "No cart found");
      if (quantity <= 0) {
        await (supabase.from("cart_items") as any)
          .delete()
          .eq("cart_id", cartId)
          .eq("product_id", id);
      } else {
        await (supabase.from("cart_items") as any)
          .update({ quantity })
          .eq("cart_id", cartId)
          .eq("product_id", id);
      }
      return success(undefined);
    },

    async removeItem(id) {
      const cartId = await ensureCart();
      if (!cartId) return success(undefined);
      await (supabase.from("cart_items") as any)
        .delete()
        .eq("cart_id", cartId)
        .eq("product_id", id);
      return success(undefined);
    },

    async clear() {
      const cartId = await ensureCart();
      if (!cartId) return success(undefined);
      await (supabase.from("cart_items") as any)
        .delete()
        .eq("cart_id", cartId);
      return success(undefined);
    },

    getSummary(items, discount = 0) {
      const subtotal = items.reduce((t, i) => t + i.price * i.quantity, 0);
      const discountedSubtotal = Math.max(0, subtotal - discount);
      const tax = discountedSubtotal * 0.08;
      const shipping = subtotal >= 200 || items.length === 0 ? 0 : 15;
      return {
        subtotal,
        discount,
        discountedSubtotal,
        tax,
        shipping,
        total: discountedSubtotal + tax + shipping,
        itemCount: items.reduce((t, i) => t + i.quantity, 0),
      };
    },
  };
}
