"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import type { Product, ProductFilters, SortOption, ViewMode, PaginationState } from "@/lib/catalog-types";
import { filterProducts, sortProducts, paginate, extractBrands, countActiveFilters } from "@/lib/catalog-helpers";
import { DEFAULT_PAGE_SIZE } from "@/lib/catalog-constants";

interface UseShopOptions {
  products: Product[];
  defaultPageSize?: number;
}

interface UseShopReturn {
  filteredProducts: Product[];
  paginatedProducts: Product[];
  pagination: PaginationState;
  searchTerm: string;
  filters: ProductFilters;
  sort: SortOption;
  viewMode: ViewMode;
  page: number;
  activeFilterCount: number;
  brands: string[];
  setSearchTerm: (term: string) => void;
  setFilters: (filters: ProductFilters) => void;
  setSort: (sort: SortOption) => void;
  setViewMode: (mode: ViewMode) => void;
  setPage: (page: number) => void;
  clearFilters: () => void;
  updateFilter: <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => void;
}

export function useShop({ products, defaultPageSize = DEFAULT_PAGE_SIZE }: UseShopOptions): UseShopReturn {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sort, setSort] = useState<SortOption>("featured");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
    setPage(1);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedTerm(term);
    }, 300);
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const effectiveFilters = useMemo<ProductFilters>(
    () => ({ ...filters, search: debouncedTerm || undefined }),
    [filters, debouncedTerm]
  );

  const filteredProducts = useMemo(() => {
    return sortProducts(filterProducts(products, effectiveFilters), sort);
  }, [products, effectiveFilters, sort]);

  const { data: paginatedProducts, pagination } = useMemo(() => {
    return paginate(filteredProducts, page, defaultPageSize);
  }, [filteredProducts, page, defaultPageSize]);

  const brands = useMemo(() => extractBrands(products), [products]);

  const activeFilterCount = useMemo(() => countActiveFilters(effectiveFilters), [effectiveFilters]);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchTerm("");
    setDebouncedTerm("");
    setPage(1);
  }, []);

  const updateFilter = useCallback(<K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [sort]);

  return {
    filteredProducts,
    paginatedProducts,
    pagination,
    searchTerm,
    filters,
    sort,
    viewMode,
    page,
    activeFilterCount,
    brands,
    setSearchTerm: handleSearchTerm,
    setFilters,
    setSort,
    setViewMode,
    setPage,
    clearFilters,
    updateFilter,
  };
}
