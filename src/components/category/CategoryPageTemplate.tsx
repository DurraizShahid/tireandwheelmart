"use client";

import { useState, useEffect } from "react";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Pagination } from "@/components/catalog/Pagination";
import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { ShopToolbar } from "@/components/shop/ShopToolbar";
import { CategoryHero } from "./CategoryHero";
import { FeaturedBrands } from "./FeaturedBrands";
import { BuyingGuide } from "./BuyingGuide";
import { FAQAccordion } from "./FAQAccordion";
import { RelatedCategories } from "./RelatedCategories";
import { SeoContent } from "@/components/shop/SeoContent";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { EmptyState } from "@/components/catalog/EmptyState";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useShop } from "@/lib/shop-utils";
import { getServices } from "@/lib/services/service-registry";
import type { CategoryConfig, Product } from "@/lib/catalog-types";

interface CategoryPageTemplateProps {
  config: CategoryConfig;
  products?: Product[];
}

export function CategoryPageTemplate({ config, products: providedProducts }: CategoryPageTemplateProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (providedProducts) {
      setAllProducts(providedProducts);
    } else {
      getServices().product.getProducts({ categories: [config.slug] }).then((r) => {
        if (r.success) setAllProducts(r.data.items);
      });
    }
  }, [config.slug, providedProducts]);

  const products = providedProducts ?? allProducts;

  const {
    paginatedProducts,
    pagination,
    searchTerm,
    filters,
    sort,
    viewMode,
    activeFilterCount,
    brands,
    setSearchTerm,
    setFilters,
    setSort,
    setViewMode,
    setPage,
    clearFilters,
  } = useShop({ products, defaultPageSize: 12 });

  return (
    <div>
      <CategoryHero
        title={config.title}
        subtitle={config.subtitle}
        description={config.description}
        image={config.heroImage}
        bgFrom={config.heroBgFrom}
        bgVia={config.heroBgVia}
        bgTo={config.heroBgTo}
        ctaPrimary={config.ctaPrimary}
        ctaSecondary={config.ctaSecondary}
      />

      <FeaturedBrands brands={config.featuredBrands} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Shop", href: "/shop" },
            { label: config.title },
          ]}
          className="py-4"
        />

        <ShopToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sort={sort}
          onSortChange={setSort}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalCount={pagination.totalItems}
          activeFilterCount={activeFilterCount}
          onOpenFilters={() => setMobileFiltersOpen(true)}
        />

        <div className="flex gap-8" id="products">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20">
              <FilterSidebar
                brands={brands}
                filters={filters}
                onChange={setFilters}
                onClear={clearFilters}
                showCategories={false}
              />
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            {paginatedProducts.length === 0 && !searchTerm && products.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <ProductGrid
                  products={paginatedProducts}
                  viewMode={viewMode}
                  href={(p) => `/product/${p.slug}`}
                />
                <Pagination pagination={pagination} onPageChange={setPage} />
              </>
            )}
          </main>
        </div>

        {config.buyingGuide && <BuyingGuide guide={config.buyingGuide} />}

        <FAQAccordion items={config.faq} />

        <RelatedCategories slugs={config.relatedCategories} />

        <SeoContent
          category={config.slug}
          categoryTitle={config.title}
          seoContent={config.seoContent}
        />
      </div>

      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="left" className="w-full sm:max-w-sm overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <FilterSidebar
            brands={brands}
            filters={filters}
            onChange={(f) => { setFilters(f); setMobileFiltersOpen(false); }}
            onClear={() => { clearFilters(); setMobileFiltersOpen(false); }}
            showCategories={false}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
