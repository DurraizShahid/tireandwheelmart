"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/lib/catalog-constants";
import { getUrlSlug } from "@/lib/category-configs";

interface RelatedCategoriesProps {
  slugs: string[];
}

export function RelatedCategories({ slugs }: RelatedCategoriesProps) {
  if (!slugs.length) return null;

  const related = CATEGORIES.filter((c) => slugs.includes(c.slug));

  if (!related.length) return null;

  return (
    <section className="py-12 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Related Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {related.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop/${getUrlSlug(cat.slug)}`}
              className="group flex items-center justify-between rounded-xl border p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div>
                <h3 className="font-bold text-foreground group-hover:text-blue-600 transition-colors">{cat.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Browse our selection</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
