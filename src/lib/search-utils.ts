import type { Product } from "./catalog-types";
import { getServices } from "@/lib/services/service-registry";
import { CATEGORIES } from "./catalog-constants";

export function getAllProducts(): Product[] {
  const { generateMockProducts } = require("@/lib/mock-products");
  return generateMockProducts();
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

export function getRecentSearches(): string[] {
  return getServices().search.getRecentSearches();
}

export function addRecentSearch(query: string): void {
  getServices().search.addRecentSearch(query);
}

export function clearRecentSearches(): void {
  getServices().search.clearRecentSearches();
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
