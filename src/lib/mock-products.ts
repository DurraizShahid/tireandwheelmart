import type { Product } from "@/lib/catalog-types";
import { CATEGORIES } from "@/lib/catalog-constants";

const brands = ["Michelin", "Bridgestone", "Goodyear", "Pirelli", "Continental", "BFGoodrich", "Firestone", "Sumitomo", "Yokohama", "Toyo"];

const tireSizes = ["205/55R16", "225/45R17", "235/40R18", "245/40R18", "255/35R19", "265/35R18", "275/40R20", "285/45R22", "315/35R20", "35X12.50R20"];

const wheelSizes = ["15x6.5", "16x7", "17x7.5", "17x8", "18x8", "18x8.5", "19x8.5", "20x9", "20x10", "22x10"];

const tireAccessories = ["Tire Pressure Monitor", "Valve Stems", "Tire Repair Kit", "Tire Covers", "TPMS Sensor", "Lug Nuts", "Center Caps", "Wheel Locks"];

const descriptions = [
  "Engineered for exceptional performance and durability. Features advanced tread compound technology for enhanced grip and longevity.",
  "Premium all-season performance with superior wet and dry traction. Designed for drivers who demand the best.",
  "Built to handle the toughest conditions. Reinforced sidewalls and deep tread provide confidence in any weather.",
  "High-performance touring tire delivering a smooth, quiet ride with responsive handling and long tread life.",
  "Off-road capable with aggressive tread pattern. Mud and snow rated for year-round versatility.",
];

const suffixes = ["Elite", "Pro", "Sport", "Ultra", "Performance", "Trail", "X-Treme", "Grand Touring", "Apex", "Enduro"];

function seeded(s: number, n: number): number {
  return ((s * 9301 + 49297 * n) % 233280) / 233280;
}

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seeded(seed, arr.length) * arr.length)];
}

function range(min: number, max: number, seed: number): number {
  return min + Math.floor(seeded(Math.floor(seed / 1000), seed % 1000) * (max - min + 1));
}

function makeSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function generateMockProducts(): Product[] {
  const products: Product[] = [];
  let id = 1;

  for (const cat of CATEGORIES) {
    const isWheel = cat.slug.includes("wheel");
    const isAccessory = cat.slug.includes("accessory");
    const isPackage = cat.slug === "packages";
    const catSeed = cat.slug.charCodeAt(0) * 1000 + cat.slug.length;
    const count = range(6, 14, catSeed);

    for (let i = 0; i < count; i++) {
      const base = catSeed + i * 7;
      const brand = pick(brands, base);
      const name = `${brand} ${cat.title} ${isAccessory ? pick(tireAccessories, base + 1) : suffixes[i % 10]}`;
      const hasCompare = seeded(base + 2, 37) < 0.3;
      const minPrice = isWheel ? 8000 : isAccessory ? 1500 : isPackage ? 12000 : 6000;
      const maxPrice = isWheel ? 45000 : isAccessory ? 8000 : isPackage ? 35000 : 25000;
      const price = range(minPrice, maxPrice, base + 3) / 100;
      const comparePrice = hasCompare ? Math.round(price * (1 + range(10, 30, base + 4) / 100) * 100) / 100 : undefined;
      const imgIndex = (i % 4) + 1;

      const product: Product = {
        id: `mock-${id}`,
        slug: makeSlug(name),
        name,
        category: cat.slug,
        price,
        comparePrice,
        discount: comparePrice ? Math.round((1 - price / comparePrice) * 100) : undefined,
        images: [`/products/${cat.slug}-${imgIndex}.svg`, `/products/${cat.slug}-${(i % 4) + 1}.svg`],
        description: pick(descriptions, base + 5),
        specifications: {
          season: pick(["Summer", "Winter", "All-Season", "Performance"], base + 6),
          loadIndex: range(85, 120, base + 7).toString(),
          speedRating: pick(["H", "V", "W", "Y", "Z"], base + 8),
          treadwear: range(300, 800, base + 9).toString(),
          traction: pick(["A", "AA"], base + 10),
          temperature: pick(["A", "B"], base + 11),
        },
        brand,
        size: isWheel ? pick(wheelSizes, base + 12) : pick(tireSizes, base + 12),
        stock: seeded(base + 13, 17) < 0.15 ? 0 : range(1, 50, base + 14),
        rating: Math.round((3.5 + seeded(base + 15, 19) * 1.5) * 10) / 10,
        reviewCount: range(0, 250, base + 16),
        sku: `${cat.slug.toUpperCase().slice(0, 3)}-${String(id).padStart(4, "0")}`,
        tags: [cat.slug, brand.toLowerCase(), seeded(base + 17, 23) > 0.5 ? "sale" : "popular"],
        featured: seeded(base + 18, 29) < 0.2,
        isNew: seeded(base + 19, 31) < 0.15,
        isBestSeller: seeded(base + 20, 37) < 0.1,
        createdAt: new Date(Date.now() - range(0, 365, base + 21) * 86400000).toISOString(),
      };
      products.push(product);
      id++;
    }
  }

  return products;
}
