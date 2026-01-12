"use client";

import React, { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductItem from "@/components/product-item";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { allProducts, searchProducts } from "@/data/products";

const SearchContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const vehicle = searchParams.get("vehicle") || "";
  const size = searchParams.get("size") || "";
  const brand = searchParams.get("brand") || "";
  const type = searchParams.get("type") || "";

  const searchResults = useMemo(() => {
    let results = allProducts;

    // Apply text query filter if provided
    if (query.trim()) {
      results = searchProducts(query);
    }

    // Apply additional filters
    if (brand) {
      results = results.filter((product) =>
        product.name.toLowerCase().includes(brand.toLowerCase())
      );
    }

    if (type) {
      const typeLower = type.toLowerCase().replace(/\s+/g, "-");
      results = results.filter((product) =>
        product.category.toLowerCase().includes(typeLower)
      );
    }

    if (size) {
      // This would need to match against product specs in a real implementation
      // For now, we'll just filter by name containing the size
      results = results.filter((product) =>
        product.name.toLowerCase().includes(size.toLowerCase())
      );
    }

    return results;
  }, [query, vehicle, size, brand, type]);

  return (
    <div className="flex flex-col items-center bg-white text-foreground py-8">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-6 text-center">
            Search Results
          </h1>

          <div className="mb-8 max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Search products..."
              defaultValue={query}
              className="w-full"
            />
          </div>

          {(query || brand || type || size || vehicle) && (
            <p className="text-center text-lg text-muted-foreground mb-8">
              Found <span className="font-semibold text-foreground">{searchResults.length}</span> result{searchResults.length !== 1 ? "s" : ""}
              {query && ` for "${query}"`}
              {(brand || type || size || vehicle) && " matching your filters"}
            </p>
          )}

          {searchResults.length > 0 ? (
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map((product) => (
                <ProductItem
                  key={product.id}
                  name={product.name}
                  price={product.price}
                  imageSrc={product.imageSrc}
                  href={`/product/${product.id}`}
                  specs={{}}
                  rating={4.5}
                  reviews={0}
                />
              ))}
            </section>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-6">
                No products found matching your search.
              </p>
              <Link href="/">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Back to Home
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SearchPage = () => {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center bg-white text-foreground py-8">
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
};

export default SearchPage;
