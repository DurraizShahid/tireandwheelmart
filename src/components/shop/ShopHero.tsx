"use client";

import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShopHeroProps {
  title?: string;
  description?: string;
}

export function ShopHero({
  title = "Premium Tires & Wheels",
  description = "Engineered for performance. Designed for your drive. Explore our complete collection of tires, wheels, and automotive accessories.",
}: ShopHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-medium text-blue-300 backdrop-blur-sm mb-6">
            New arrivals available now
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
            {title}
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
            {description}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base" asChild>
              <Link href="#products">
                Browse Collection <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-base" asChild>
              <Link href="/shop/all-season-tires">
                <Search className="mr-2 h-5 w-5" /> Find My Size
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-6 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
