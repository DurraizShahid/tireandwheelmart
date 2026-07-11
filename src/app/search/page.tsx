"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductItem from "@/components/product-item";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface DbProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  brand: string | null;
  description: string | null;
  specs: Record<string, unknown>;
}

const SearchContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const brand = searchParams.get("brand") || "";
  const type = searchParams.get("type") || "";

  const [results, setResults] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      let qb = supabase.from("products").select("*");

      if (query.trim()) {
        const term = `%${query}%`;
        qb = qb.or(
          `name.ilike.${term},brand.ilike.${term},description.ilike.${term}`
        );
      }

      if (brand) {
        qb = qb.ilike("brand", `%${brand}%`);
      }

      if (type) {
        const typeSlug = type.toLowerCase().replace(/\s+/g, "-");
        qb = qb.eq("categories.slug", typeSlug);
      }

      const { data, error } = await qb.order("name").limit(50);
      if (!error && data) setResults(data);
      setLoading(false);
    };

    fetchResults();
  }, [query, brand, type]);

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

          {(query || brand || type) && (
            <p className="text-center text-lg text-muted-foreground mb-8">
              Found{" "}
              <span className="font-semibold text-foreground">
                {results.length}
              </span>{" "}
              result{results.length !== 1 ? "s" : ""}
              {query && ` for "${query}"`}
              {(brand || type) && " matching your filters"}
            </p>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((product) => (
                <ProductItem
                  key={product.id}
                  name={product.name}
                  price={`$${product.price.toLocaleString()}`}
                  imageSrc={product.image_url}
                  href={`/product/${product.slug}`}
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
    <Suspense
      fallback={
        <div className="flex flex-col items-center bg-white text-foreground py-8">
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
};

export default SearchPage;
