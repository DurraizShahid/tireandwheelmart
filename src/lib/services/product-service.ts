import type { Product, ProductFilters, SortOption } from "@/lib/catalog-types";
import type { ServiceResult, PaginatedResult } from "./types";
import { success, failure } from "./types";

export interface ProductService {
  getProducts(filters?: ProductFilters, sort?: SortOption, page?: number, pageSize?: number): Promise<ServiceResult<PaginatedResult<Product>>>;
  getProductBySlug(slug: string): Promise<ServiceResult<Product>>;
  getProductById(id: string): Promise<ServiceResult<Product>>;
  getFeaturedProducts(): Promise<ServiceResult<Product[]>>;
  getRelatedProducts(productId: string, limit?: number): Promise<ServiceResult<Product[]>>;
  getBrands(): Promise<ServiceResult<string[]>>;
}

export function createMockProductService(): ProductService {
  const { generateMockProducts } = require("@/lib/mock-products");
  let allProducts: Product[] | null = null;

  function getProducts(): Product[] {
    if (!allProducts) allProducts = generateMockProducts();
    return allProducts!;
  }

  return {
    async getProducts(filters, sort, page = 1, pageSize = 12) {
      const { filterProducts, sortProducts, paginate } = await import("@/lib/catalog-helpers");
      const result = sortProducts(filterProducts(getProducts(), filters ?? {}), sort ?? "featured");
      const { data, pagination } = paginate(result, page, pageSize);
      return success({ items: data, page, pageSize, totalItems: pagination.totalItems, totalPages: pagination.totalPages });
    },

    async getProductBySlug(slug) {
      const p = getProducts().find((p) => p.slug === slug);
      return p ? success(p) : failure("NOT_FOUND", "Product not found");
    },

    async getProductById(id) {
      const p = getProducts().find((p) => p.id === id);
      return p ? success(p) : failure("NOT_FOUND", "Product not found");
    },

    async getFeaturedProducts() {
      return success(getProducts().filter((p) => p.featured).slice(0, 8));
    },

    async getRelatedProducts(productId, limit = 4) {
      const product = getProducts().find((p) => p.id === productId);
      if (!product) return success([]);
      const related = getProducts().filter((p) => p.category === product.category && p.id !== productId).slice(0, limit);
      return success(related);
    },

    async getBrands() {
      const brands = [...new Set(getProducts().map((p) => p.brand).filter(Boolean))] as string[];
      return success(brands);
    },
  };
}
