"use client";

import { Search, LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SortDropdown } from "@/components/catalog/SortDropdown";
import type { SortOption, ViewMode } from "@/lib/catalog-types";

interface ShopToolbarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalCount: number;
  activeFilterCount: number;
  onOpenFilters: () => void;
}

export function ShopToolbar({
  searchTerm,
  onSearchChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalCount,
  activeFilterCount,
  onOpenFilters,
}: ShopToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 py-4">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products, brands, SKU..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-8 h-10 text-sm bg-muted/50 border-muted"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Mobile filter button */}
      <Button variant="outline" className="lg:hidden relative" onClick={onOpenFilters}>
        <SlidersHorizontal className="h-4 w-4 mr-2" />
        Filters
        {activeFilterCount > 0 && (
          <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white font-bold">
            {activeFilterCount}
          </span>
        )}
      </Button>

      {/* Sort */}
      <SortDropdown value={sort} onChange={onSortChange} />

      {/* View toggle */}
      <div className="flex items-center border rounded-md">
        <Button
          variant={viewMode === "grid" ? "default" : "ghost"}
          size="icon"
          onClick={() => onViewModeChange("grid")}
          className="h-10 w-10 rounded-r-none"
          aria-label="Grid view"
          aria-pressed={viewMode === "grid"}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "ghost"}
          size="icon"
          onClick={() => onViewModeChange("list")}
          className="h-10 w-10 rounded-l-none"
          aria-label="List view"
          aria-pressed={viewMode === "list"}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      {/* Total count */}
      <p className="text-sm text-muted-foreground whitespace-nowrap">
        {totalCount} product{totalCount !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
