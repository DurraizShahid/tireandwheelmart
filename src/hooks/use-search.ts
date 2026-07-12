"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import type { Product } from "@/lib/catalog-types";
import { searchProductsFiltered, getRecentSearches, addRecentSearch, clearRecentSearches } from "@/lib/search-utils";

const DEBOUNCE_MS = 250;

export function useSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsLoading(true);
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      setHasSearched(false);
      setActiveIndex(-1);
      return;
    }
    setIsLoading(true);
    searchProductsFiltered(debouncedQuery).then((filtered) => {
      setResults(filtered);
      setIsLoading(false);
      setHasSearched(true);
      setActiveIndex(-1);
    });
  }, [debouncedQuery]);

  const handleSearch = useCallback((term: string) => {
    if (term.trim()) {
      addRecentSearch(term);
      setRecentSearches(getRecentSearches());
    }
    setQuery(term);
  }, []);

  const handleClearRecent = useCallback(() => {
    clearRecentSearches();
    setRecentSearches([]);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, onNavigate: (slug: string) => void) => {
      const total = results.length;
      if (total === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < total) {
            onNavigate(results[activeIndex].slug);
          }
          break;
      }
    },
    [results, activeIndex]
  );

  const activeProduct = useMemo(
    () => (activeIndex >= 0 && activeIndex < results.length ? results[activeIndex] : null),
    [activeIndex, results]
  );

  return {
    query,
    setQuery: handleSearch,
    debouncedQuery,
    results,
    isLoading,
    hasSearched,
    recentSearches,
    clearRecentSearches: handleClearRecent,
    activeIndex,
    setActiveIndex,
    handleKeyDown,
    activeProduct,
  };
}
