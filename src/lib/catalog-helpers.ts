import type { Product, BadgeType, PaginationState, ProductFilters, SortOption } from "./catalog-types";

export function computeDiscount(price: number, comparePrice?: number): number | undefined {
  if (!comparePrice || comparePrice <= price) return undefined;
  return Math.round((1 - price / comparePrice) * 100);
}

export function getProductBadges(product: Product): BadgeType[] {
  const badges: BadgeType[] = [];
  if (product.featured) badges.push("featured");
  if (product.isNew) badges.push("new");
  if (product.isBestSeller) badges.push("bestseller");
  if (product.comparePrice && product.comparePrice > product.price) badges.push("sale");
  return badges;
}

export function paginate<T>(items: T[], page: number, pageSize: number): { data: T[]; pagination: PaginationState } {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);
  return { data, pagination: { page, pageSize, totalItems, totalPages } };
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
}

export function extractBrands(products: Product[]): string[] {
  const brands = new Set<string>();
  products.forEach((p) => { if (p.brand) brands.add(p.brand); });
  return Array.from(brands).sort();
}

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  return products.filter((p) => {
    if (filters.categories && filters.categories.length > 0 && !filters.categories.includes(p.category)) return false;
    if (filters.brands && filters.brands.length > 0 && p.brand && !filters.brands.includes(p.brand)) return false;
    if (filters.minPrice !== undefined && p.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && p.price > filters.maxPrice) return false;
    if (filters.tireSizes && filters.tireSizes.length > 0 && !(p.size && filters.tireSizes.includes(p.size))) return false;
    if (filters.tireSize && !p.size?.includes(filters.tireSize)) return false;
    if (filters.wheelSize && !p.size?.includes(filters.wheelSize)) return false;
    if (filters.rating !== undefined && (p.rating ?? 0) < filters.rating) return false;
    if (filters.inStock && p.stock <= 0) return false;
    if (filters.featured && !p.featured) return false;
    if (filters.isNew && !p.isNew) return false;
    if (filters.isBestSeller && !p.isBestSeller) return false;
    if (filters.onSale && (!p.comparePrice || p.comparePrice <= p.price)) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match = p.name.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "featured":
      return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.name.localeCompare(b.name));
    case "newest":
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case "bestselling":
      return sorted.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return sorted;
  }
}

export function countActiveFilters(filters: ProductFilters): number {
  let count = 0;
  if (filters.categories?.length) count += filters.categories.length;
  if (filters.brands?.length) count += filters.brands.length;
  if (filters.minPrice !== undefined) count++;
  if (filters.maxPrice !== undefined) count++;
  if (filters.tireSizes?.length) count += filters.tireSizes.length;
  if (filters.tireSize) count++;
  if (filters.wheelSize) count++;
  if (filters.vehicle) count++;
  if (filters.rating !== undefined) count++;
  if (filters.inStock) count++;
  if (filters.featured) count++;
  if (filters.isNew) count++;
  if (filters.isBestSeller) count++;
  if (filters.onSale) count++;
  if (filters.search) count++;
  return count;
}
