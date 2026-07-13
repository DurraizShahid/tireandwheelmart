"use client";

import { lazy, Suspense, useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/lib/catalog-types";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { getUrlSlug } from "@/lib/category-configs";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { PurchasePanel } from "./PurchasePanel";
import { ProductSpecifications } from "./ProductSpecifications";
import { ProductDescription } from "./ProductDescription";
import { VehicleFitment } from "./VehicleFitment";
import { ProductFeatures } from "./ProductFeatures";
import { RecentlyViewed } from "@/components/shop/RecentlyViewed";

const ProductReviews = lazy(() => import("./ProductReviews").then((m) => ({ default: m.ProductReviews })));
const RelatedProducts = lazy(() => import("./RelatedProducts").then((m) => ({ default: m.RelatedProducts })));

interface ProductDetailClientProps {
  product: Product;
  openReview?: boolean;
}

function SectionFallback() {
  return <div className="h-48 rounded-2xl bg-gray-50 animate-pulse" />;
}

export function ProductDetailClient({ product, openReview }: ProductDetailClientProps) {
  const categoryTitle = product.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const urlSlug = getUrlSlug(product.category);
  const categoryHref = urlSlug ? `/shop/${urlSlug}` : `/shop/${product.category}`;

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    image: product.images[0],
  }), [product]);

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Shop", href: "/shop" },
            { label: categoryTitle, href: categoryHref },
            { label: product.name },
          ]}
          className="py-6"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>
          <div className="space-y-8">
            <ProductInfo product={product} />
            <div className="lg:sticky lg:top-24">
              <PurchasePanel product={product} />
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-10 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ProductSpecifications product={product} />
            <VehicleFitment product={product} />
          </div>

          <ProductFeatures />
          <ProductDescription description={product.description} productName={product.name} />

          <Separator />

          <Suspense fallback={<SectionFallback />}>
            <ProductReviews rating={product.rating} reviewCount={product.reviewCount} productId={product.id} openReview={openReview} />
          </Suspense>

          <Separator />

          <Suspense fallback={<SectionFallback />}>
            <RelatedProducts product={product} />
          </Suspense>

          <RecentlyViewed />
        </div>
      </div>
    </div>
  );
}
