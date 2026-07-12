"use client";

import Link from "next/link";

interface SeoContentProps {
  category?: string;
  categoryTitle?: string;
  seoContent?: string[];
}

export function SeoContent({ categoryTitle, seoContent }: SeoContentProps) {
  const title = categoryTitle || "Premium Tires and Wheels";

  return (
    <section className="py-12 border-t">
      <div className="max-w-4xl">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Shop {title} at Tire&Wheel Mart
        </h2>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          {seoContent ? (
            seoContent.map((paragraph, i) => <p key={i}>{paragraph}</p>)
          ) : (
            <>
              <p>
                Discover our comprehensive selection of {title.toLowerCase()} engineered for
                performance, safety, and durability. Our curated collection features top brands
                and expert recommendations to help you make the right choice.
              </p>
              <p>
                Filter by brand, price, size, and ratings to find the perfect match for your
                vehicle. Every product includes detailed specifications and customer reviews.
              </p>
            </>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-bold text-foreground mb-3">Shop by Category</h3>
          <div className="flex flex-wrap gap-2">
            {["All-Season Tires", "Summer Tires", "Winter Tires", "Performance Tires", "Alloy Wheels", "Steel Wheels"].map((cat) => (
              <Link
                key={cat}
                href={`/shop/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
