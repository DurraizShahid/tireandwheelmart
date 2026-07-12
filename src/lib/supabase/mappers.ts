import type { Product as DbProduct } from "./types";
import type { Product as CatalogProduct } from "@/lib/catalog-types";

const CATEGORY_SLUG_BY_ID: Record<string, string> = {
  "a1000000-0000-0000-0000-000000000001": "all-season",
  "a1000000-0000-0000-0000-000000000002": "summer",
  "a1000000-0000-0000-0000-000000000003": "winter",
  "a1000000-0000-0000-0000-000000000004": "performance",
  "a1000000-0000-0000-0000-000000000005": "alloy-wheels",
  "a1000000-0000-0000-0000-000000000006": "steel-wheels",
  "a1000000-0000-0000-0000-000000000007": "wheel-accessories",
  "a1000000-0000-0000-0000-000000000008": "tire-accessories",
};

function getCategorySlug(categoryId: string): string {
  return CATEGORY_SLUG_BY_ID[categoryId] ?? categoryId;
}

export function toCatalogProduct(p: DbProduct): CatalogProduct {
  const specs = (p.specs ?? {}) as Record<string, string | number | boolean>;
  const size = specs.width && specs.aspect_ratio && specs.rim_diameter
    ? `${specs.width}/${specs.aspect_ratio}R${specs.rim_diameter}`
    : undefined;

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: getCategorySlug(p.category_id),
    price: p.price,
    comparePrice: p.compare_at_price ?? undefined,
    discount: p.compare_at_price
      ? Math.round((1 - p.price / p.compare_at_price) * 100)
      : undefined,
    images: p.images.length > 0 ? p.images : [p.image_url],
    description: p.description ?? undefined,
    specifications: specs,
    brand: p.brand ?? undefined,
    size,
    stock: p.stock_quantity,
    rating: p.rating ?? undefined,
    reviewCount: p.review_count ?? undefined,
    sku: p.sku ?? undefined,
    tags: p.tags,
    featured: p.featured,
    isNew: p.is_new,
    isBestSeller: p.is_best_seller,
    createdAt: p.created_at,
  };
}

export function toCatalogProducts(products: DbProduct[]): CatalogProduct[] {
  return products.map(toCatalogProduct);
}
