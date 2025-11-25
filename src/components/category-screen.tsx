"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import ProductItem, { ProductSpecs } from "@/components/product-item";
import { Search } from "lucide-react";

interface CategoryScreenProps {
  categorySlug: string;
}

interface Product {
  id: string;
  name: string;
  price: string;
  imageSrc: string;
  description: string;
  specs?: ProductSpecs;
  rating: number;
  reviews: number;
}

const CategoryScreen = ({ categorySlug }: CategoryScreenProps) => {
  const router = useRouter();

  // Dummy data for wheel and tire categories
  const products: Record<string, Product[]> = {
    "all-season-tires": [
      {
        id: "1",
        name: "Michelin CrossClimate2",
        price: "$250",
        imageSrc: "/images/tires_icon.webp",
        description: "Experience exceptional all-season performance with the Michelin CrossClimate2. Designed for year-round reliability in all weather conditions.",
        specs: { size: "225/45R17", loadSpeed: "94V", season: "All-Season", type: "Grand Touring" },
        rating: 4.8,
        reviews: 1240
      },
      {
        id: "2",
        name: "Continental TrueContact Tour",
        price: "$180",
        imageSrc: "/images/tires_icon.webp",
        description: "The Continental TrueContact Tour offers excellent all-season traction, long tread life, and a comfortable ride for everyday driving.",
        specs: { size: "205/55R16", loadSpeed: "91H", season: "All-Season", type: "Standard Touring" },
        rating: 4.6,
        reviews: 850
      },
      {
        id: "3",
        name: "Goodyear Assurance WeatherReady",
        price: "$220",
        imageSrc: "/images/tires_icon.webp",
        description: "Goodyear Assurance WeatherReady delivers outstanding performance in dry, wet, and light snow conditions with superior braking and handling.",
        specs: { size: "215/60R16", loadSpeed: "95H", season: "All-Season", type: "Grand Touring" },
        rating: 4.7,
        reviews: 920
      },
      {
        id: "4",
        name: "Bridgestone Turanza QuietTrack",
        price: "$230",
        imageSrc: "/images/tires_icon.webp",
        description: "The Bridgestone Turanza QuietTrack provides a quiet, comfortable ride with excellent all-season traction and long-lasting tread.",
        specs: { size: "235/50R18", loadSpeed: "97V", season: "All-Season", type: "Grand Touring" },
        rating: 4.5,
        reviews: 640
      },
    ],
    "summer-tires": [
      {
        id: "5",
        name: "Michelin Pilot Sport 4S",
        price: "$280",
        imageSrc: "/images/tires_icon.webp",
        description: "Experience exceptional grip and precision handling with the Michelin Pilot Sport 4S. Designed for ultimate performance on both road and track.",
        specs: { size: "245/40R19", loadSpeed: "98Y", season: "Summer", type: "Max Performance" },
        rating: 4.9,
        reviews: 2100
      },
      {
        id: "6",
        name: "Pirelli P Zero",
        price: "$290",
        imageSrc: "/images/tires_icon.webp",
        description: "The Pirelli P Zero is a high-performance tire, a benchmark for the ultra-high performance segment, characterized by an asymmetric tread pattern.",
        specs: { size: "255/35R19", loadSpeed: "96Y", season: "Summer", type: "Max Performance" },
        rating: 4.7,
        reviews: 1500
      },
      {
        id: "7",
        name: "Goodyear Eagle F1",
        price: "$240",
        imageSrc: "/images/tires_icon.webp",
        description: "Goodyear Eagle F1 Asymmetric 5 delivers outstanding wet and dry performance, offering superior braking and handling.",
        specs: { size: "225/40R18", loadSpeed: "92Y", season: "Summer", type: "Ultra High Performance" },
        rating: 4.6,
        reviews: 780
      },
      {
        id: "8",
        name: "Continental ExtremeContact",
        price: "$250",
        imageSrc: "/images/tires_icon.webp",
        description: "The Continental ExtremeContact Sport is a summer ultra-high performance tire for passenger cars, offering precise handling and maximum grip.",
        specs: { size: "235/40R18", loadSpeed: "95Y", season: "Summer", type: "Max Performance" },
        rating: 4.8,
        reviews: 1100
      },
    ],
    "winter-tires": [
      {
        id: "9",
        name: "Bridgestone Blizzak WS90",
        price: "$200",
        imageSrc: "/images/snowTire_icon.webp",
        description: "The Bridgestone Blizzak WS90 provides exceptional winter traction with advanced tread compound technology for superior grip on snow and ice.",
        specs: { size: "205/55R16", loadSpeed: "91H", season: "Winter", type: "Studless Ice & Snow" },
        rating: 4.8,
        reviews: 3200
      },
      {
        id: "10",
        name: "Michelin X-Ice Snow",
        price: "$220",
        imageSrc: "/images/snowTire_icon.webp",
        description: "Michelin X-Ice Snow offers excellent winter performance with enhanced grip on snow and ice, plus improved tread life.",
        specs: { size: "215/60R16", loadSpeed: "95H", season: "Winter", type: "Studless Ice & Snow" },
        rating: 4.7,
        reviews: 2800
      },
      {
        id: "11",
        name: "Continental WinterContact SI",
        price: "$190",
        imageSrc: "/images/snowTire_icon.webp",
        description: "The Continental WinterContact SI delivers reliable winter traction and handling in cold weather conditions with excellent snow and ice grip.",
        specs: { size: "195/65R15", loadSpeed: "91T", season: "Winter", type: "Studless Ice & Snow" },
        rating: 4.6,
        reviews: 1500
      },
      {
        id: "12",
        name: "Nokian Hakkapeliitta R3",
        price: "$250",
        imageSrc: "/images/snowTire_icon.webp",
        description: "Nokian Hakkapeliitta R3 is a premium winter tire offering superior grip on snow and ice with excellent handling characteristics.",
        specs: { size: "225/50R17", loadSpeed: "98R", season: "Winter", type: "Studless Ice & Snow" },
        rating: 4.9,
        reviews: 950
      },
    ],
    "performance-tires": [
      {
        id: "13",
        name: "Michelin Pilot Sport Cup 2",
        price: "$350",
        imageSrc: "/images/tires_icon.webp",
        description: "Track-focused performance tire designed for maximum grip and precision handling on both road and track.",
        specs: { size: "265/35R19", loadSpeed: "98Y", season: "Performance", type: "Streetable Track & Competition" },
        rating: 4.9,
        reviews: 450
      },
      {
        id: "14",
        name: "Pirelli P Zero Trofeo R",
        price: "$380",
        imageSrc: "/images/tires_icon.webp",
        description: "Ultra-high performance tire optimized for track use with exceptional dry grip and handling capabilities.",
        specs: { size: "245/35R19", loadSpeed: "93Y", season: "Performance", type: "Streetable Track & Competition" },
        rating: 4.8,
        reviews: 320
      },
      {
        id: "15",
        name: "Toyo Proxes R888R",
        price: "$320",
        imageSrc: "/images/tires_icon.webp",
        description: "Competition-grade tire offering maximum dry traction and performance for track enthusiasts.",
        specs: { size: "235/40R18", loadSpeed: "91W", season: "Performance", type: "R-Compound" },
        rating: 4.7,
        reviews: 580
      },
    ],
    "alloy-wheels": [
      {
        id: "16",
        name: "Enkei RPF1 Alloy Wheels",
        price: "$1200",
        imageSrc: "/images/wheels_icon.webp",
        description: "Lightweight forged alloy wheels designed for performance and style. Available in multiple sizes and finishes.",
        specs: { size: "17x9", type: "Flow Formed" },
        rating: 4.9,
        reviews: 890
      },
      {
        id: "17",
        name: "OZ Racing Superturismo",
        price: "$1800",
        imageSrc: "/images/wheels_icon.webp",
        description: "Premium Italian alloy wheels combining classic design with modern performance and durability.",
        specs: { size: "18x8", type: "Cast" },
        rating: 4.8,
        reviews: 420
      },
      {
        id: "18",
        name: "BBS CH-R Alloy Wheels",
        price: "$2000",
        imageSrc: "/images/wheels_icon.webp",
        description: "High-quality German alloy wheels featuring a sporty design and excellent build quality.",
        specs: { size: "19x8.5", type: "Flow Formed" },
        rating: 4.9,
        reviews: 650
      },
      {
        id: "19",
        name: "Rotiform RSE Alloy Wheels",
        price: "$1500",
        imageSrc: "/images/wheels_icon.webp",
        description: "Modern alloy wheels with a distinctive design, perfect for customizing your vehicle's appearance.",
        specs: { size: "18x8.5", type: "Cast" },
        rating: 4.7,
        reviews: 340
      },
    ],
    "steel-wheels": [
      {
        id: "20",
        name: "Steel Wheel Set (15 inch)",
        price: "$400",
        imageSrc: "/images/wheels_icon.webp",
        description: "Durable steel wheels perfect for winter use or as spare wheels. Built to last with excellent corrosion resistance.",
        specs: { size: "15x6", type: "Steel" },
        rating: 4.5,
        reviews: 120
      },
      {
        id: "21",
        name: "Steel Wheel Set (16 inch)",
        price: "$450",
        imageSrc: "/images/wheels_icon.webp",
        description: "Heavy-duty steel wheels offering reliability and affordability for everyday driving.",
        specs: { size: "16x6.5", type: "Steel" },
        rating: 4.6,
        reviews: 150
      },
      {
        id: "22",
        name: "Steel Wheel Set (17 inch)",
        price: "$500",
        imageSrc: "/images/wheels_icon.webp",
        description: "Larger steel wheels providing strength and durability for larger vehicles.",
        specs: { size: "17x7", type: "Steel" },
        rating: 4.5,
        reviews: 180
      },
    ],
    "packages": [
      {
        id: "23",
        name: "Complete Tire & Wheel Package",
        price: "$1800",
        imageSrc: "/images/package_icon.webp",
        description: "Complete package including 4 tires and 4 alloy wheels, ready for installation. Perfect for upgrading your vehicle.",
        rating: 4.8,
        reviews: 56
      },
      {
        id: "24",
        name: "Winter Tire Package",
        price: "$1200",
        imageSrc: "/images/snowPackages_icon.webp",
        description: "Complete winter tire package with steel wheels, ideal for seasonal tire changes.",
        specs: { season: "Winter" },
        rating: 4.7,
        reviews: 89
      },
      {
        id: "25",
        name: "Performance Package",
        price: "$2800",
        imageSrc: "/images/package_icon.webp",
        description: "Premium performance package featuring high-performance tires and lightweight alloy wheels.",
        specs: { season: "Performance" },
        rating: 4.9,
        reviews: 45
      },
    ],
    "wheel-accessories": [
      {
        id: "26",
        name: "Wheel Lug Nuts Set",
        price: "$50",
        imageSrc: "/images/wheels_icon.webp",
        description: "High-quality lug nuts for secure wheel mounting. Available in various finishes and thread sizes.",
        rating: 4.6,
        reviews: 230
      },
      {
        id: "27",
        name: "Wheel Spacers",
        price: "$120",
        imageSrc: "/images/wheels_icon.webp",
        description: "Precision-machined wheel spacers to adjust wheel offset and improve vehicle stance.",
        rating: 4.5,
        reviews: 150
      },
      {
        id: "28",
        name: "Wheel Center Caps",
        price: "$30",
        imageSrc: "/images/wheels_icon.webp",
        description: "Decorative center caps to complete your wheel's appearance. Available in multiple designs.",
        rating: 4.4,
        reviews: 90
      },
    ],
    "tire-accessories": [
      {
        id: "29",
        name: "Tire Pressure Monitoring System",
        price: "$150",
        imageSrc: "/images/tires_icon.webp",
        description: "Wireless TPMS system to monitor tire pressure in real-time for safety and fuel efficiency.",
        rating: 4.7,
        reviews: 310
      },
      {
        id: "30",
        name: "Tire Valve Stems",
        price: "$25",
        imageSrc: "/images/tires_icon.webp",
        description: "High-quality valve stems for proper tire inflation and pressure maintenance.",
        rating: 4.8,
        reviews: 420
      },
      {
        id: "31",
        name: "Tire Repair Kit",
        price: "$40",
        imageSrc: "/images/tires_icon.webp",
        description: "Complete tire repair kit for emergency flat tire repairs on the go.",
        rating: 4.6,
        reviews: 550
      },
    ],
  };

  const categoryTitleMap: { [key: string]: string } = {
    "all-season-tires": "All-Season Tires",
    "summer-tires": "Summer Tires",
    "winter-tires": "Winter Tires",
    "performance-tires": "Performance Tires",
    "alloy-wheels": "Alloy Wheels",
    "steel-wheels": "Steel Wheels",
    "packages": "Tire & Wheel Packages",
    "wheel-accessories": "Wheel Accessories",
    "tire-accessories": "Tire Accessories",
  };

  const currentCategoryProducts = products[categorySlug as keyof typeof products] || [];
  const currentCategoryTitle = categoryTitleMap[categorySlug] || "Category";

  return (
    <div className="flex flex-col items-center bg-white dark:bg-background text-foreground py-8">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
          {currentCategoryTitle}
        </h1>

        {/* Local Search Bar */}
        <div className="w-full relative mb-8 max-w-md mx-auto">
          <Input
            type="text"
            placeholder={`Search in ${currentCategoryTitle}...`}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        {/* Product Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {currentCategoryProducts.map((product) => (
            <ProductItem
              key={product.id}
              name={product.name}
              price={product.price}
              imageSrc={product.imageSrc}
              href={`/product/${product.id}`}
              specs={product.specs as any} // Cast to any to avoid strict type checking issues with optional fields in the map
              rating={product.rating}
              reviews={product.reviews}
            />
          ))}
        </section>
      </div>
    </div>
  );
};

export default CategoryScreen;