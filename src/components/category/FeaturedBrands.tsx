"use client";

interface FeaturedBrandsProps {
  brands: string[];
}

export function FeaturedBrands({ brands }: FeaturedBrandsProps) {
  if (!brands.length) return null;

  return (
    <section className="py-10 border-y">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center mb-6">
          Featured Brands
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {brands.map((brand) => (
            <span
              key={brand}
              className="text-lg font-bold text-foreground/40 hover:text-foreground/70 transition-colors select-none"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
