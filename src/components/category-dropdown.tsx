"use client";

import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CONFIG_TO_URL_SLUG } from "@/lib/category-configs";
import { CATEGORIES } from "@/lib/catalog-constants";

const categories = CATEGORIES.map((c) => ({
  title: c.title,
  slug: c.slug,
  image: c.image,
  bgColor: c.bgColor,
}));

export const CategoryDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Dropdown - Hidden on mobile */}
      <div
        className="hidden md:block relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button
          suppressHydrationWarning
          className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Categories"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <span className="font-medium">Categories</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Invisible bridge to prevent gap between button and dropdown */}
        <div className="absolute h-4 left-0 right-0" style={{ top: '100%' }} />

        {/* Bento Grid Dropdown Menu */}
        {isOpen && (
          <div className="absolute left-1/2 -translate-x-1/2 mt-4 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 w-[1100px] p-5">
            {/* Row 1: 4 items */}
            <div className="grid grid-cols-[1fr_1.2fr_1.8fr_1.2fr] gap-4 mb-4">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.slug}
                  href={`/shop/${CONFIG_TO_URL_SLUG[category.slug] ?? category.slug}`}
                  className={`group/item relative overflow-hidden rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer h-28 flex items-center ${category.bgColor}`}
                >
                  <div className="flex-1 px-4 py-3 z-10">
                    <h3 className={`font-bold text-sm leading-tight ${
                      category.bgColor === "bg-black" || category.bgColor === "bg-red-600" ? "text-white" : "text-gray-900"
                    }`}>
                      {category.title}
                    </h3>
                  </div>
                  <div className="relative w-20 h-20 flex-shrink-0 mr-2">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-contain group-hover/item:scale-110 transition-transform duration-300"
                    />
                  </div>
                </Link>
              ))}
            </div>

            {/* Row 2: 5 items */}
            <div className="grid grid-cols-[0.8fr_0.9fr_1.6fr_1.1fr_1.1fr] gap-4">
              {categories.slice(4, 9).map((category) => (
                <Link
                  key={category.slug}
                  href={`/shop/${CONFIG_TO_URL_SLUG[category.slug] ?? category.slug}`}
                  className={`group/item relative overflow-hidden rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer h-28 flex items-center ${category.bgColor}`}
                >
                  <div className="flex-1 px-3 py-3 z-10">
                    <h3 className={`font-bold text-sm leading-tight ${
                      category.bgColor === "bg-black" || category.bgColor === "bg-red-600" ? "text-white" : "text-gray-900"
                    }`}>
                      {category.title}
                    </h3>
                  </div>
                  <div className="relative w-16 h-16 flex-shrink-0 mr-2">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-contain group-hover/item:scale-110 transition-transform duration-300"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer - Shown only on mobile */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" aria-label="Categories menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:w-80 p-0">
          <div className="p-4">
            <h2 className="text-lg font-bold text-foreground mb-6">Categories</h2>
            <div className="space-y-2 max-h-[calc(100vh-120px)] overflow-y-auto">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/shop/${CONFIG_TO_URL_SLUG[category.slug] ?? category.slug}`}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-red-600 hover:text-white ${
                    category.bgColor === "bg-red-600" ? "bg-red-600 text-white" : "text-foreground"
                  }`}
                >
                  <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm line-clamp-2">{category.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};