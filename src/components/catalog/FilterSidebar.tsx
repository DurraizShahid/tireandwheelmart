"use client";

import { useState } from "react";
import { ChevronDown, RotateCcw, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CATEGORIES, RATING_OPTIONS } from "@/lib/catalog-constants";
import type { ProductFilters } from "@/lib/catalog-types";

interface FilterSidebarProps {
  brands?: string[];
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  onClear: () => void;
  showCategories?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-3 text-sm font-semibold text-foreground"
        aria-expanded={open}
      >
        {title}
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="pb-3 space-y-2">{children}</div>}
      <Separator />
    </div>
  );
}

export function FilterSidebar({ brands, filters, onChange, onClear, showCategories = true }: FilterSidebarProps) {
  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined && v !== "" && (Array.isArray(v) ? v.length > 0 : true));

  const updateCategory = (slug: string) => {
    const current = filters.categories ?? [];
    const next = current.includes(slug) ? current.filter((c) => c !== slug) : [...current, slug];
    onChange({ ...filters, categories: next.length > 0 ? next : undefined });
  };

  const updateBrand = (brand: string) => {
    const current = filters.brands ?? [];
    const next = current.includes(brand) ? current.filter((b) => b !== brand) : [...current, brand];
    onChange({ ...filters, brands: next.length > 0 ? next : undefined });
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between py-3">
        <h3 className="font-bold text-foreground">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground" onClick={onClear}>
            <RotateCcw className="h-3 w-3 mr-1" /> Clear All
          </Button>
        )}
      </div>
      <Separator />

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1.5 py-2">
          {filters.categories?.map((c) => (
            <Chip key={c} label={CATEGORIES.find((cat) => cat.slug === c)?.title ?? c} onRemove={() => updateCategory(c)} />
          ))}
          {filters.brands?.map((b) => (
            <Chip key={b} label={b} onRemove={() => updateBrand(b)} />
          ))}
          {filters.minPrice !== undefined && (
            <Chip label={`Min $${filters.minPrice}`} onRemove={() => onChange({ ...filters, minPrice: undefined })} />
          )}
          {filters.maxPrice !== undefined && (
            <Chip label={`Max $${filters.maxPrice}`} onRemove={() => onChange({ ...filters, maxPrice: undefined })} />
          )}
          {filters.rating !== undefined && (
            <Chip label={`${filters.rating}+ stars`} onRemove={() => onChange({ ...filters, rating: undefined })} />
          )}
          {filters.vehicle && (
            <Chip
              label={`${filters.vehicle.make} ${filters.vehicle.model} (${filters.vehicle.year})`}
              onRemove={() => onChange({ ...filters, vehicle: undefined, tireSizes: undefined })}
            />
          )}
          {filters.inStock && <Chip label="In Stock" onRemove={() => onChange({ ...filters, inStock: undefined })} />}
          {filters.featured && <Chip label="Featured" onRemove={() => onChange({ ...filters, featured: undefined })} />}
          {filters.isNew && <Chip label="New" onRemove={() => onChange({ ...filters, isNew: undefined })} />}
          {filters.isBestSeller && <Chip label="Best Seller" onRemove={() => onChange({ ...filters, isBestSeller: undefined })} />}
          {filters.onSale && <Chip label="On Sale" onRemove={() => onChange({ ...filters, onSale: undefined })} />}
        </div>
      )}

      {/* Categories */}
      {showCategories && (
        <FilterSection title="Category">
          {CATEGORIES.map((cat) => (
            <label key={cat.slug} className="flex items-center gap-2 py-1 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categories?.includes(cat.slug) ?? false}
                onChange={() => updateCategory(cat.slug)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-muted-foreground">{cat.title}</span>
            </label>
          ))}
        </FilterSection>
      )}

      {/* Brands */}
      {brands && brands.length > 0 && (
        <FilterSection title="Brand">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 py-1 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.brands?.includes(brand) ?? false}
                onChange={() => updateBrand(brand)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-muted-foreground">{brand}</span>
            </label>
          ))}
        </FilterSection>
      )}

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ""}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="h-9 text-sm"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ""}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="h-9 text-sm"
          />
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Minimum Rating">
        <div className="space-y-1">
          {RATING_OPTIONS.map((star) => (
            <label key={star} className="flex items-center gap-2 py-1 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={filters.rating === star}
                onChange={() => onChange({ ...filters, rating: filters.rating === star ? undefined : star })}
                className="border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn("h-3.5 w-3.5", i < star ? "fill-amber-400 text-amber-400" : "text-gray-300")}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">& up</span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Stock Status */}
      <FilterSection title="Availability">
        <label className="flex items-center gap-2 py-1 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock ?? false}
            onChange={() => onChange({ ...filters, inStock: !filters.inStock })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-muted-foreground">In Stock Only</span>
        </label>
      </FilterSection>

      {/* Badges */}
      <FilterSection title="Product Status" defaultOpen={false}>
        {([
          { key: "featured" as const, label: "Featured" },
          { key: "isNew" as const, label: "New Arrivals" },
          { key: "isBestSeller" as const, label: "Best Sellers" },
          { key: "onSale" as const, label: "Sale Items" },
        ]).map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 py-1 cursor-pointer">
            <input
              type="checkbox"
              checked={!!filters[key]}
              onChange={() => onChange({ ...filters, [key]: filters[key] ? undefined : true })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-muted-foreground">{label}</span>
          </label>
        ))}
      </FilterSection>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1">
      {label}
      <button onClick={onRemove} className="hover:text-blue-900">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
