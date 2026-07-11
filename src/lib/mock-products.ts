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

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
    const count = randomInt(6, 14);

    for (let i = 0; i < count; i++) {
      const brand = randomItem(brands);
      const name = `${brand} ${cat.title} ${isAccessory ? randomItem(tireAccessories) : ["Elite", "Pro", "Sport", "Ultra", "Performance", "Trail", "X-Treme", "Grand Touring", "Apex", "Enduro"][i % 10]}`;
      const hasCompare = Math.random() < 0.3;
      const price = randomInt(isWheel ? 8000 : isAccessory ? 1500 : isPackage ? 12000 : 6000, isWheel ? 45000 : isAccessory ? 8000 : isPackage ? 35000 : 25000) / 100;
      const comparePrice = hasCompare ? price * (1 + randomInt(10, 30) / 100) : undefined;
      const imgIndex = (i % 4) + 1;

      const product: Product = {
        id: `mock-${id}`,
        slug: makeSlug(name),
        name,
        category: cat.slug,
        price,
        comparePrice,
        discount: comparePrice ? Math.round((1 - price / comparePrice) * 100) : undefined,
        images: [`/products/${cat.slug}-${imgIndex}.png`, `/products/${cat.slug}-${(i % 4) + 1}.png`],
        description: randomItem(descriptions),
        specifications: {
          season: randomItem(["Summer", "Winter", "All-Season", "Performance"]),
          loadIndex: randomInt(85, 120).toString(),
          speedRating: randomItem(["H", "V", "W", "Y", "Z"]),
          treadwear: randomInt(300, 800).toString(),
          traction: randomItem(["A", "AA"]),
          temperature: randomItem(["A", "B"]),
        },
        brand,
        size: isWheel ? randomItem(wheelSizes) : randomItem(tireSizes),
        stock: Math.random() < 0.15 ? 0 : randomInt(1, 50),
        rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
        reviewCount: randomInt(0, 250),
        sku: `${cat.slug.toUpperCase().slice(0, 3)}-${String(id).padStart(4, "0")}`,
        tags: [cat.slug, brand.toLowerCase(), Math.random() > 0.5 ? "sale" : "popular"].filter(Boolean),
        featured: Math.random() < 0.2,
        isNew: Math.random() < 0.15,
        isBestSeller: Math.random() < 0.1,
        createdAt: new Date(Date.now() - randomInt(0, 365) * 86400000).toISOString(),
      };
      products.push(product);
      id++;
    }
  }

  return products;
}
