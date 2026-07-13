"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Snowflake, Sun, CloudRain, Zap, Gauge, Shield } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  description: string | null;
  brand: string | null;
  in_stock: boolean;
  stock_quantity: number;
  featured: boolean;
  specs: Record<string, unknown>;
}

interface CategoryScreenProps {
  categoryTitle: string;
  products: Product[];
}

const CategoryScreen = ({ categoryTitle, products }: CategoryScreenProps) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q)
    );
  }, [products, search]);

  const getSeasonIcon = (season?: unknown) => {
    switch (season) {
      case "Winter": return <Snowflake className="h-3 w-3 mr-1" />;
      case "Summer": return <Sun className="h-3 w-3 mr-1" />;
      case "All-Season": return <CloudRain className="h-3 w-3 mr-1" />;
      case "Performance": return <Zap className="h-3 w-3 mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col items-center bg-white text-foreground py-8">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
          {categoryTitle}
        </h1>

        <div className="w-full relative mb-8 max-w-md mx-auto">
          <Input
            type="text"
            placeholder={`Search in ${categoryTitle}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filtered.length > 0 ? (
            filtered.map((product) => {
              const specs = product.specs ?? {};
              const season = specs.season as string | undefined;
              const treadwear = specs.treadwear as string | undefined;
              const traction = specs.traction as string | undefined;
              const temperature = specs.temperature as string | undefined;
              const size = specs.width
                ? `${specs.width}/${specs.aspect_ratio}R${specs.rim_diameter}`
                : undefined;
              const loadIndex = specs.load_index as string | undefined;
              const speedRating = specs.speed_rating as string | undefined;

              return (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="block h-full"
                >
                  <Card className="relative h-full flex flex-col overflow-hidden rounded-xl shadow-sm hover:shadow-xl border border-gray-100 group cursor-pointer transition-all duration-300 hover:-translate-y-1 bg-white hover:bg-red-600">
                    <div className="relative p-4 flex-grow flex flex-col">
                      {season && (
                        <div className="absolute top-3 left-3 z-20">
                          <Badge
                            variant="secondary"
                            className="flex items-center text-xs font-medium bg-gray-100 text-foreground"
                          >
                            {getSeasonIcon(season)}
                            {season}
                          </Badge>
                        </div>
                      )}

                      <div className="relative w-full h-40 mb-4 flex items-center justify-center bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{ objectFit: "contain" }}
                          className="drop-shadow-md group-hover:scale-110 transition-transform duration-500 p-2"
                        />
                      </div>

                      <div className="flex flex-col flex-grow">
                        <h4 className="text-base font-bold text-foreground mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors group-hover:text-white">
                          {product.name}
                        </h4>

                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-muted-foreground mb-3 bg-gray-50 p-2 rounded-md group-hover:bg-red-500/20 group-hover:text-red-50 transition-colors">
                          {size && (
                            <div className="col-span-2 font-mono font-medium text-foreground group-hover:text-white">
                              {size}
                            </div>
                          )}
                          {(loadIndex || speedRating) && (
                            <div className="col-span-2 flex items-center text-foreground group-hover:text-white">
                              <Gauge className="h-3 w-3 mr-1" />
                              {loadIndex && <span className="mr-2">Load: {loadIndex}</span>}
                              {speedRating && <span>Speed: {speedRating}</span>}
                            </div>
                          )}
                          {(treadwear || traction || temperature) && (
                            <div className="col-span-2 flex flex-wrap items-center text-foreground group-hover:text-white">
                              <Shield className="h-3 w-3 mr-1" />
                              {treadwear && <span className="mr-2">Treadwear: {treadwear}</span>}
                              {traction && <span className="mr-2">Traction: {traction}</span>}
                              {temperature && <span>Temp: {temperature}</span>}
                            </div>
                          )}
                        </div>

                        <div className="mt-auto flex items-center justify-between">
                          <p className="text-lg font-bold text-foreground group-hover:text-white">
                            ${product.price.toLocaleString()}
                          </p>
                          <span className="text-xs font-medium text-blue-600 group-hover:underline group-hover:text-white">
                            View Details
                          </span>
                        </div>
                        <p className={`text-xs mt-1 ${
                          product.stock_quantity <= 0 ? "text-red-500 group-hover:text-red-200"
                          : product.stock_quantity <= 5 ? "text-amber-600 group-hover:text-amber-200"
                          : "text-green-600 group-hover:text-green-200"
                        }`}>
                          {product.stock_quantity <= 0 ? "Out of Stock" : product.stock_quantity <= 5 ? `Low Stock (${product.stock_quantity} left)` : `In Stock (${product.stock_quantity})`}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-muted-foreground">
                {products.length === 0
                  ? "No products found in this category."
                  : "No products match your search."}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CategoryScreen;
