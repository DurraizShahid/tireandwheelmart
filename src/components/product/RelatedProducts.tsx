"use client";

import { useMemo } from "react";
import { Package } from "lucide-react";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { generateMockProducts } from "@/lib/mock-products";
import type { Product } from "@/lib/catalog-types";

interface RelatedProductsProps {
  product: Product;
}

export function RelatedProducts({ product }: RelatedProductsProps) {
  const related = useMemo(() => {
    const all = generateMockProducts();
    return all
      .filter((p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
      .slice(0, 8);
  }, [product.id, product.category, product.brand]);

  if (related.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <Package className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-bold text-foreground">Related Products</h2>
      </div>
      <ProductGrid
        products={related}
        href={(p) => `/product/${p.slug}`}
      />
    </section>
  );
}
