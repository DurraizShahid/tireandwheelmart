"use client";

import React, { useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { searchProducts, allProducts } from "@/data/products";
import { cn } from "@/lib/utils";

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
    if (!query.trim() || query.length < 2) {
      return allProducts.slice(0, 5); // Show first 5 products as suggestions when query is empty
    }
    return searchProducts(query).slice(0, 5); // Limit to 5 suggestions
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={suggestionsRef}
      className={cn(
        "absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-[400px] overflow-y-auto",
        className
      )}
    >
      <div className="py-2">
        {suggestions.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {product.name}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {product.category.replace("-", " ")}
              </p>
            </div>
            <span className="text-sm font-semibold text-foreground flex-shrink-0">
              {product.price}
            </span>
          </Link>
        ))}
        {query.trim() && (
          <Link
            href={`/search?q=${encodeURIComponent(query)}`}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-t border-gray-100"
          >
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm font-medium text-foreground">
              View all results for "{query}"
            </span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default SearchSuggestions;
