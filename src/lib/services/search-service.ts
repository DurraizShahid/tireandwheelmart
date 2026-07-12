import type { Product } from "@/lib/catalog-types";
import type { ServiceResult } from "./types";
import { success } from "./types";

export interface SearchService {
  search(query: string, limit?: number): Promise<ServiceResult<Product[]>>;
  getRecentSearches(): string[];
  addRecentSearch(query: string): void;
  clearRecentSearches(): void;
  getTrendingProducts(): Promise<ServiceResult<Product[]>>;
}

const RECENT_KEY = "tireandwheel_recent_searches";
const MAX_RECENT = 8;

function filterByQuery(products: Product[], query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
  );
}

export function createSupabaseSearchService(): SearchService {
  return {
    async search(query, limit = 20) {
      const { createBrowserClient } = await import("@/lib/supabase/client");
      const { toCatalogProducts } = await import("@/lib/supabase/mappers");
      const q = query.toLowerCase().trim();
      if (!q) return success([]);

      const supabase = createBrowserClient();
      const term = `%${q}%`;
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .or(`name.ilike.${term},brand.ilike.${term},description.ilike.${term}`)
        .order("name")
        .limit(limit);

      if (error) return success([]);
      return success(toCatalogProducts(data ?? []));
    },

    getRecentSearches() {
      try {
        const stored = localStorage.getItem(RECENT_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed.slice(0, MAX_RECENT);
        }
      } catch {}
      return [];
    },

    addRecentSearch(query) {
      if (!query.trim()) return;
      try {
        const searches = this.getRecentSearches();
        const filtered = searches.filter((s) => s.toLowerCase() !== query.toLowerCase());
        filtered.unshift(query.trim());
        localStorage.setItem(RECENT_KEY, JSON.stringify(filtered.slice(0, MAX_RECENT)));
      } catch {}
    },

    clearRecentSearches() {
      try { localStorage.removeItem(RECENT_KEY); } catch {}
    },

    async getTrendingProducts() {
      const { createBrowserClient } = await import("@/lib/supabase/client");
      const { toCatalogProducts } = await import("@/lib/supabase/mappers");
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .or("featured.eq.true,is_best_seller.eq.true")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) return success([]);
      return success(toCatalogProducts(data ?? []));
    },
  };
}

export function createMockSearchService(): SearchService {
  return {
    async search(query, limit = 20) {
      const { getServices } = await import("@/lib/services/service-registry");
      const result = await getServices().product.getAll();
      if (!result.success) return success([]);
      return success(filterByQuery(result.data, query).slice(0, limit));
    },

    getRecentSearches() {
      try {
        const stored = localStorage.getItem(RECENT_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed.slice(0, MAX_RECENT);
        }
      } catch {}
      return [];
    },

    addRecentSearch(query) {
      if (!query.trim()) return;
      try {
        const searches = this.getRecentSearches();
        const filtered = searches.filter((s) => s.toLowerCase() !== query.toLowerCase());
        filtered.unshift(query.trim());
        localStorage.setItem(RECENT_KEY, JSON.stringify(filtered.slice(0, MAX_RECENT)));
      } catch {}
    },

    clearRecentSearches() {
      try { localStorage.removeItem(RECENT_KEY); } catch {}
    },

    async getTrendingProducts() {
      const { getServices } = await import("@/lib/services/service-registry");
      const result = await getServices().product.getAll();
      if (!result.success) return success([]);
      return success(result.data.filter((p) => p.isBestSeller || p.featured).slice(0, 6));
    },
  };
}
