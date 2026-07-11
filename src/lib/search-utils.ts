import type { Product } from "./catalog-types";
import { generateMockProducts } from "./mock-products";
import { CATEGORIES } from "./catalog-constants";

let cachedProducts: Product[] | null = null;

export function getAllProducts(): Product[] {
  if (!cachedProducts) {
    cachedProducts = generateMockProducts();
  }
  return cachedProducts;
}

export function searchProducts(query: string): Product[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return getAllProducts().filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
  );
}

export function searchProductsFiltered(query: string, limit = 20): Product[] {
  if (!query.trim()) return [];
  const results = searchProducts(query);
  return results.slice(0, limit);
}

export function getProductBySlugLocal(slug: string): Product | undefined {
  return getAllProducts().find((p) => p.slug === slug);
}

export function getProductByIdLocal(id: string): Product | undefined {
  return getAllProducts().find((p) => p.id === id);
}

const RECENT_SEARCHES_KEY = "tireandwheel_recent_searches";
const MAX_RECENT = 8;

export function getRecentSearches(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed.slice(0, MAX_RECENT);
    }
  } catch {}
  return [];
}

export function addRecentSearch(query: string): void {
  if (!query.trim()) return;
  try {
    const searches = getRecentSearches();
    const filtered = searches.filter((s) => s.toLowerCase() !== query.toLowerCase());
    filtered.unshift(query.trim());
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(filtered.slice(0, MAX_RECENT)));
  } catch {}
}

export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {}
}

export function getTrendingProducts(): Product[] {
  const all = getAllProducts();
  return all.filter((p) => p.isBestSeller || p.featured).slice(0, 6);
}

export function getPopularCategories() {
  return CATEGORIES.map((c) => ({
    name: c.title,
    slug: c.slug,
    href: `/shop/${c.slug}`,
  }));
}
