"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/catalog-helpers";
import { searchProductsFiltered } from "@/lib/search-utils";

interface Suggestion {
  id: string;
  name: string;
  slug: string;
  price: number;
  brand: string | null;
}

interface SearchSuggestionsProps {
  query: string;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  isOpen,
  onClose,
  className,
}) => {
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    return searchProductsFiltered(query, 5).map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      brand: p.brand ?? null,
    }));
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen || !query.trim()) return null;

  return (
    <div ref={suggestionsRef} className={cn(
      "absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-[400px] overflow-y-auto",
      className
    )}>
      <div className="py-2">
        {suggestions.map((product) => (
          <Link key={product.id} href={`/product/${product.slug}`} onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
              {product.brand && <p className="text-xs text-muted-foreground">{product.brand}</p>}
            </div>
            <span className="text-sm font-semibold text-foreground flex-shrink-0">
              {formatPrice(product.price)}
            </span>
          </Link>
        ))}
        {query.trim().length >= 2 && (
          <Link href={`/search?q=${encodeURIComponent(query)}`} onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-t border-gray-100"
          >
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm font-medium text-foreground">
              View all results for &quot;{query}&quot;
            </span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default SearchSuggestions;
