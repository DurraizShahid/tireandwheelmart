"use client";

import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CONFIG_TO_URL_SLUG } from "@/lib/category-configs";

const categories = [
  {
    title: "All-Season Tires",
    slug: "all-season",
    image: "/categories/allseason.png",
    bgColor: "bg-white",
  },
  {
    title: "Summer Tires",
    slug: "summer",
    image: "/categories/summertires.png",
    bgColor: "bg-red-600",
  },
  {
    title: "Winter Tires",
    slug: "winter",
    image: "/categories/wintertires.png",
    bgColor: "bg-black",
  },
  {
    title: "Performance Tires",
    slug: "performance",
    image: "/categories/performancetires.png",
    bgColor: "bg-white",
  },
  {
    title: "Alloy Wheels",
    slug: "alloy-wheels",
    image: "/categories/alloywheels.webp",
    bgColor: "bg-red-600",
  },
  {
    title: "Steel Wheels",
    slug: "steel-wheels",
    image: "/categories/steelwheels.png",
    bgColor: "bg-black",
  },
  {
    title: "Tire & Wheel Packages",
    slug: "packages",
    image: "/categories/tireandwheel.png",
    bgColor: "bg-white",
  },
  {
    title: "Wheel Accessories",
    slug: "wheel-accessories",
    image: "/categories/wheelaccessories.png",
    bgColor: "bg-red-600",
  },
  {
    title: "Tire Accessories",
    slug: "tire-accessories",
    image: "/categories/tireaccessories.png",
    bgColor: "bg-black",
  },
];

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
          <>
            {/* Dropdown */}
            <div className="absolute left-1/2 -translate-x-1/2 mt-4 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 w-[1200px]">
              <div className="p-6">
                <div className="flex gap-6">
                  {/* First Grid: 2x2 (All-Season, Summer, Winter, Performance) */}
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    {categories.slice(0, 4).map((category) => (
                      <Link
                        key={category.slug}
                        href={`/shop/${CONFIG_TO_URL_SLUG[category.slug] ?? category.slug}`}
                        onClick={() => {}}
                        className={`group/item relative overflow-hidden rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer h-24 col-span-1 flex items-center ${category.bgColor}`}
                      >
                        {/* Left Side - Text */}
                        <div className="flex-1 px-4 py-3 z-10">
                          <h3 className={`font-bold text-sm line-clamp-2 ${
                            category.bgColor === "bg-black" || category.bgColor === "bg-red-600" ? "text-white" : "text-gray-900"
                          }`}>
                            {category.title}
                          </h3>
                        </div>

                        {/* Right Side - Image */}
                        <div className="relative w-16 h-16 flex-shrink-0">
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

                  {/* Second Grid: 1x2 (Alloy Wheels, Steel Wheels) */}
                  <div className="grid grid-cols-1 gap-4 flex-1">
                    {categories.slice(4, 6).map((category) => (
                      <Link
                        key={category.slug}
                        href={`/shop/${CONFIG_TO_URL_SLUG[category.slug] ?? category.slug}`}
                        onClick={() => {}}
                        className={`group/item relative overflow-hidden rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer h-24 col-span-1 flex items-center ${category.bgColor}`}
                      >
                        {/* Left Side - Text */}
                        <div className="flex-1 px-4 py-3 z-10">
                          <h3 className={`font-bold text-sm line-clamp-2 ${
                            category.bgColor === "bg-black" || category.bgColor === "bg-red-600" ? "text-white" : "text-gray-900"
                          }`}>
                            {category.title}
                          </h3>
                        </div>

                        {/* Right Side - Image */}
                        <div className="relative w-16 h-16 flex-shrink-0">
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

                  {/* Third Grid: 2 rows (Top: Tire & Wheel, Bottom: Wheel & Tire Accessories) */}
                  <div className="grid grid-cols-1 gap-4 flex-1">
                    {/* Top: Tire & Wheel Packages */}
                    <div className="grid grid-cols-1">
                      {categories.slice(6, 7).map((category) => (
                        <Link
                          key={category.slug}
                          href={`/shop/${CONFIG_TO_URL_SLUG[category.slug] ?? category.slug}`}
                          onClick={() => {}}
                          className={`group/item relative overflow-hidden rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer h-24 col-span-1 flex items-center ${category.bgColor}`}
                        >
                          {/* Left Side - Text */}
                          <div className="flex-1 px-4 py-3 z-10">
                            <h3 className={`font-bold text-sm line-clamp-2 ${
                              category.bgColor === "bg-black" || category.bgColor === "bg-red-600" ? "text-white" : "text-gray-900"
                            }`}>
                              {category.title}
                            </h3>
                          </div>

                          {/* Right Side - Image */}
                          <div className="relative w-16 h-16 flex-shrink-0">
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

                    {/* Bottom: Wheel Accessories & Tire Accessories */}
                    <div className="grid grid-cols-2 gap-4">
                      {categories.slice(7, 9).map((category) => (
                        <Link
                          key={category.slug}
                          href={`/shop/${CONFIG_TO_URL_SLUG[category.slug] ?? category.slug}`}
                          onClick={() => {}}
                          className={`group/item relative overflow-hidden rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer h-24 col-span-1 flex items-center ${category.bgColor}`}
                        >
                          {/* Left Side - Text */}
                          <div className="flex-1 px-4 py-3 z-10">
                            <h3 className={`font-bold text-xs line-clamp-2 ${
                              category.bgColor === "bg-black" || category.bgColor === "bg-red-600" ? "text-white" : "text-gray-900"
                            }`}>
                              {category.title}
                            </h3>
                          </div>

                          {/* Right Side - Image */}
                          <div className="relative w-16 h-16 flex-shrink-0">
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
                </div>
              </div>
            </div>
          </>
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