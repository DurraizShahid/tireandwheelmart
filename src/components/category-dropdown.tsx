"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const categories = [
  {
    title: "All-Season Tires",
    slug: "all-season-tires",
    image: "/categories/allseason.png",
    bgColor: "bg-white",
  },
  {
    title: "Summer Tires",
    slug: "summer-tires",
    image: "/categories/summertires.png",
    bgColor: "bg-red-600",
  },
  {
    title: "Winter Tires",
    slug: "winter-tires",
    image: "/categories/wintertires.png",
    bgColor: "bg-black",
  },
  {
    title: "Performance Tires",
    slug: "performance-tires",
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

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <span className="font-medium">Categories</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Bento Grid Dropdown Menu */}
      {isOpen && (
        <>
          {/* Dropdown */}
          <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 w-[1200px]" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <div className="p-6">
              <div className="flex gap-6">
                {/* First Grid: 2x2 (All-Season, Summer, Winter, Performance) */}
                <div className="grid grid-cols-2 gap-4 flex-1">
                  {categories.slice(0, 4).map((category) => (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
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
                      href={`/category/${category.slug}`}
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
                        href={`/category/${category.slug}`}
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
                        href={`/category/${category.slug}`}
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
  );
};