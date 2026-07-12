"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useShop } from "@/lib/shop-utils";
import { getAllProducts } from "@/lib/search-utils";
import type { Product } from "@/lib/catalog-types";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { SortDropdown } from "@/components/catalog/SortDropdown";
import { Pagination } from "@/components/catalog/Pagination";
import { EmptyState } from "@/components/catalog/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  useEffect(() => {
    getAllProducts().then(setAllProducts);
  }, []);

  const {
    filteredProducts,
    paginatedProducts,
    pagination,
    searchTerm,
    filters,
    sort,
    viewMode,
    page,
    brands,
    setSearchTerm,
    setFilters,
    setSort,
    setPage,
    clearFilters,
  } = useShop({ products: allProducts });

  useEffect(() => {
    if (query && query !== searchTerm) {
      setSearchTerm(query);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={[{ label: "Search" }]} className="mb-6" />

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Search Results</h1>
          <div className="flex items-center gap-3 max-w-md" role="search">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                aria-label="Search products"
              />
            </div>
          </div>
        </div>

        {!searchTerm && !query ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Search our catalog</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Find the perfect tires and wheels by searching by name, brand, or category.
            </p>
            <div className="flex gap-3">
              <Link href="/shop">
                <Button variant="outline">Browse All Products</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {filteredProducts.length === 0
                ? `No results found for "${searchTerm || query}"`
                : `Found ${filteredProducts.length} result${filteredProducts.length !== 1 ? "s" : ""} for "${searchTerm || query}"`}
            </p>

            <div className="flex flex-col lg:flex-row gap-8">
              <FilterSidebar
                filters={filters}
                brands={brands}
                onChange={setFilters}
                onClear={clearFilters}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <SortDropdown value={sort} onChange={setSort} />
                  <p className="text-sm text-muted-foreground">
                    Page {pagination.page} of {pagination.totalPages}
                  </p>
                </div>

                <ProductGrid
                  products={paginatedProducts}
                  viewMode={viewMode}
                />

                {pagination.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination pagination={pagination} onPageChange={setPage} />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
