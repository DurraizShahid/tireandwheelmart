import type { Category, SortOption } from "./catalog-types";

export const CATEGORIES: Category[] = [
  { title: "All-Season Tires", slug: "all-season", image: "/categories/allseason.png", bgColor: "bg-white" },
  { title: "Summer Tires", slug: "summer", image: "/categories/summertires.png", bgColor: "bg-red-600" },
  { title: "Winter Tires", slug: "winter", image: "/categories/wintertires.png", bgColor: "bg-black" },
  { title: "Performance Tires", slug: "performance", image: "/categories/performancetires.png", bgColor: "bg-white" },
  { title: "Alloy Wheels", slug: "alloy-wheels", image: "/categories/alloywheels.webp", bgColor: "bg-red-600" },
  { title: "Steel Wheels", slug: "steel-wheels", image: "/categories/steelwheels.png", bgColor: "bg-black" },
  { title: "Tire & Wheel Packages", slug: "packages", image: "/categories/tireandwheel.png", bgColor: "bg-white" },
  { title: "Wheel Accessories", slug: "wheel-accessories", image: "/categories/wheelaccessories.png", bgColor: "bg-red-600" },
  { title: "Tire Accessories", slug: "tire-accessories", image: "/categories/tireaccessories.png", bgColor: "bg-black" },
];

export const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Highest Rated", value: "rating" },
  { label: "Best Selling", value: "bestselling" },
  { label: "Name: A-Z", value: "name-asc" },
  { label: "Name: Z-A", value: "name-desc" },
];

export const DEFAULT_PAGE_SIZE = 12;

export const TIER_SIZES = ["15", "16", "17", "18", "19", "20", "21", "22", "24", "26"];

export const WHEEL_SIZES = ["15", "16", "17", "18", "19", "20", "21", "22", "24", "26"];

export const RATING_OPTIONS = [4, 3, 2, 1];
