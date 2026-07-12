"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Clock, TrendingUp, ShoppingCart, Heart, GitCompare, ArrowRight, Star } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/hooks/use-search";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { useCompare } from "@/contexts/compare-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/catalog-helpers";
import { getPopularCategories, getTrendingProducts } from "@/lib/search-utils";
import type { Product } from "@/lib/catalog-types";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function SearchResultItem({
  product,
  isActive,
  onNavigate,
  onClose,
}: {
  product: Product;
  isActive: boolean;
  onNavigate: (slug: string) => void;
  onClose: () => void;
}) {
  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();
  const { toggleCompare, isInCompare } = useCompare();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageSrc: product.images[0] || "/placeholder.svg",
      brand: product.brand,
      size: product.size,
      maxQuantity: product.stock,
    });
    toast.success(`Added "${product.name}" to cart`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      imageSrc: product.images[0] || "/placeholder.svg",
      brand: product.brand,
      size: product.size,
    });
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(product);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors",
        isActive ? "bg-blue-50" : "hover:bg-gray-50"
      )}
      onMouseDown={() => onNavigate(product.slug)}
      role="option"
      aria-selected={isActive}
    >
      <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
        <img src={product.images[0] || "/placeholder.svg"} alt={product.name} className="w-full h-full object-contain p-1" />
      </div>
      <div className="flex-1 min-w-0">
        {product.brand && (
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{product.brand}</p>
        )}
        <p className="text-sm font-semibold text-foreground truncate">{product.name}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          {product.rating && (
            <span className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {product.rating.toFixed(1)}
            </span>
          )}
          <span className="capitalize">{product.category.replace(/-/g, " ")}</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-foreground">{formatPrice(product.price)}</p>
        {product.comparePrice && product.comparePrice > product.price && (
          <p className="text-xs text-muted-foreground line-through">{formatPrice(product.comparePrice)}</p>
        )}
      </div>
      <div className="flex items-center gap-0.5 ml-1">
        <button
          onClick={handleAddToCart}
          className="p-1.5 rounded-md hover:bg-blue-50 text-muted-foreground hover:text-blue-600 transition-colors"
          title="Add to cart"
        >
          <ShoppingCart className="h-4 w-4" />
        </button>
        <button
          onClick={handleToggleWishlist}
          className="p-1.5 rounded-md hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
          title="Add to wishlist"
        >
          <Heart className="h-4 w-4" />
        </button>
        <button
          onClick={handleToggleCompare}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            isInCompare(product.id)
              ? "text-blue-600 hover:bg-blue-50"
              : "text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
          )}
          title="Compare"
        >
          <GitCompare className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { query, setQuery, results, isLoading, hasSearched, recentSearches, clearRecentSearches, activeIndex, handleKeyDown } = useSearch();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onOpenChange]);

  const handleNavigate = useCallback(
    (slug: string) => {
      setQuery(query);
      onOpenChange(false);
      router.push(`/product/${slug}`);
    },
    [query, setQuery, onOpenChange, router]
  );

  const handleViewAll = useCallback(() => {
    if (query.trim()) {
      onOpenChange(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  }, [query, onOpenChange, router]);

  const handleRecentClick = useCallback(
    (term: string) => {
      setQuery(term);
    },
    [setQuery]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      handleKeyDown(e, (slug) => {
        setQuery(query);
        onOpenChange(false);
        router.push(`/product/${slug}`);
      });
      if (e.key === "Enter" && !e.shiftKey && results.length === 0 && query.trim()) {
        handleViewAll();
      }
    },
    [handleKeyDown, query, results.length, setQuery, onOpenChange, router, handleViewAll]
  );

  const [trending, setTrending] = useState<Product[]>([]);
  useEffect(() => {
    getTrendingProducts().then(setTrending);
  }, []);
  const popularCategories = getPopularCategories();
  const showTrending = !query.trim() && !hasSearched;
  const showResults = query.trim() && (results.length > 0 || hasSearched);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
      <DialogContent
        className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-2xl max-h-[75vh] p-0 gap-0 border-0 shadow-2xl rounded-2xl overflow-hidden data-[state=closed]:slide-out-to-top-[8%] data-[state=open]:slide-in-from-top-[8%] sm:rounded-2xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search tires, wheels, brands..."
            className="flex-1 text-base bg-transparent border-0 outline-none placeholder:text-muted-foreground/60 text-foreground"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button onClick={() => setQuery("")} className="p-1 rounded-md hover:bg-gray-100 text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs text-muted-foreground bg-gray-100 rounded border border-gray-200 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results / Suggestions */}
        <div className="overflow-y-auto max-h-[60vh]" role="listbox">
          {isLoading && (
            <div className="px-5 py-8 text-center">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground mt-2">Searching...</p>
            </div>
          )}

          {!isLoading && showResults && results.length === 0 && (
            <div className="px-5 py-12 text-center">
              <Search className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-foreground mb-1">No results found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We couldn&apos;t find anything for &quot;{query}&quot;
              </p>
              <Button variant="outline" size="sm" onClick={handleViewAll}>
                Search entire catalog <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          )}

          {!isLoading && showResults && results.length > 0 && (
            <>
              <div className="px-5 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-gray-50">
                Products ({results.length})
              </div>
              <div>
                {results.slice(0, 8).map((product, i) => (
                  <SearchResultItem
                    key={product.id}
                    product={product}
                    isActive={i === activeIndex}
                    onNavigate={handleNavigate}
                    onClose={() => onOpenChange(false)}
                  />
                ))}
              </div>
              {results.length > 8 && (
                <button
                  onClick={handleViewAll}
                  className="w-full px-5 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-1 border-t border-gray-50"
                >
                  View all {results.length} results <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </>
          )}

          {!isLoading && showTrending && (
            <div className="px-5 py-4 space-y-5">
              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> Recent
                    </h4>
                    <button onClick={clearRecentSearches} className="text-xs text-muted-foreground hover:text-foreground">
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleRecentClick(term)}
                        className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-foreground"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular categories */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <TrendingUp className="h-3.5 w-3.5" /> Categories
                </h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {popularCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={cat.href}
                      onClick={() => onOpenChange(false)}
                      className="px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-foreground font-medium"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Trending products */}
              {trending.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    🔥 Trending
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {trending.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={() => onOpenChange(false)}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-md bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 shrink-0">
                          <img src={product.images[0] || "/placeholder.svg"} alt="" className="w-full h-full object-contain p-0.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{formatPrice(product.price)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-muted-foreground bg-gray-50/50">
          <span>
            <kbd className="px-1 py-0.5 bg-white rounded border border-gray-200 font-mono mr-0.5">↑↓</kbd> Navigate
            <kbd className="px-1 py-0.5 bg-white rounded border border-gray-200 font-mono mx-0.5">⏎</kbd> Open
            <kbd className="px-1 py-0.5 bg-white rounded border border-gray-200 font-mono ml-0.5">Esc</kbd> Close
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-white rounded border border-gray-200 font-mono">⌘K</kbd>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
