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

export function createMockSearchService(): SearchService {
  return {
    async search(query, limit = 20) {
      const { getAllProducts } = await import("@/lib/search-utils");
      const q = query.toLowerCase().trim();
      if (!q) return success([]);
      const results = getAllProducts().filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
      return success(results.slice(0, limit));
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
      const { getAllProducts } = await import("@/lib/search-utils");
      return success(getAllProducts().filter((p) => p.isBestSeller || p.featured).slice(0, 6));
    },
  };
}
