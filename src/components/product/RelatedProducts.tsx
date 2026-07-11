"use client";

import { useState, useEffect } from "react";
import { Package } from "lucide-react";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { getServices } from "@/lib/services/service-registry";
import type { Product } from "@/lib/catalog-types";

interface RelatedProductsProps {
  product: Product;
}

export function RelatedProducts({ product }: RelatedProductsProps) {
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    getServices().product.getRelatedProducts(product.id, 8).then((r) => {
      if (r.success) setRelated(r.data);
    });
  }, [product.id]);

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
