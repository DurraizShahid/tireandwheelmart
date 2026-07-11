"use client";

import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Pagination } from "@/components/catalog/Pagination";
import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { useShop } from "@/lib/shop-utils";
import { generateMockProducts } from "@/lib/mock-products";
import { ShopHero } from "@/components/shop/ShopHero";
import { ShopToolbar } from "@/components/shop/ShopToolbar";
import { RecentlyViewed } from "@/components/shop/RecentlyViewed";
import { SeoContent } from "@/components/shop/SeoContent";

export function ShopClient() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const products = useMemo(() => generateMockProducts(), []);

  const {
    paginatedProducts,
    pagination,
    searchTerm,
    filters,
    sort,
    viewMode,
    page,
    activeFilterCount,
    brands,
    setSearchTerm,
    setFilters,
    setSort,
    setViewMode,
    setPage,
    clearFilters,
    updateFilter,
  } = useShop({ products, defaultPageSize: 12 });

  return (
    <div>
      <ShopHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Shop", href: "/shop" }]} className="py-4" />

        {/* Toolbar */}
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

        {/* Content */}
        <div className="flex gap-8" id="products">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20">
              <FilterSidebar
                brands={brands}
                filters={filters}
                onChange={setFilters}
                onClear={clearFilters}
                showCategories
              />
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1 min-w-0">
            <ProductGrid
              products={paginatedProducts}
              viewMode={viewMode}
              href={(p) => `/product/${p.slug}`}
            />

            <Pagination pagination={pagination} onPageChange={setPage} />
          </main>
        </div>

        <RecentlyViewed />
        <SeoContent />
      </div>

      {/* Mobile Filter Drawer */}
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
            showCategories
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
