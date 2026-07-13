import type { Product } from "./catalog-types";
import { getServices } from "@/lib/services/service-registry";
import { CATEGORIES } from "./catalog-constants";
import { fuzzySearchProducts } from "./search-fuzzy";

let allProductsPromise: Promise<Product[]> | null = null;

function getAllProductsCached(): Promise<Product[]> {
  if (!allProductsPromise) {
    allProductsPromise = getServices().product.getAll().then((r) => r.success ? r.data : []);
  }
  return allProductsPromise;
}

export async function getAllProducts(): Promise<Product[]> {
  return getAllProductsCached();
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (!query.trim()) return [];
  const all = await getAllProductsCached();
  return fuzzySearchProducts(all, query);
}

export async function searchProductsFiltered(query: string, limit = 20): Promise<Product[]> {
  const results = await searchProducts(query);
  return results.slice(0, limit);
}

export async function getProductBySlugLocal(slug: string): Promise<Product | undefined> {
  const all = await getAllProductsCached();
  return all.find((p) => p.slug === slug);
}

export async function getProductByIdLocal(id: string): Promise<Product | undefined> {
  const all = await getAllProductsCached();
  return all.find((p) => p.id === id);
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

export async function getTrendingProducts(): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.isBestSeller || p.featured).slice(0, 6);
}

export function getPopularCategories() {
  return CATEGORIES.map((c) => ({
    name: c.title,
    slug: c.slug,
    href: `/shop/${c.slug}`,
  }));
}
