"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import ProductItem, { ProductSpecs } from "@/components/product-item";
import { Search } from "lucide-react";

interface CategoryScreenProps {
  categorySlug: string;
}

// Extended interface for product specifications
interface ExtendedProductSpecs extends ProductSpecs {
  rimSize?: string;
  boltPattern?: string;
  offset?: string;
  finish?: string;
  threadSize?: string;
  seatType?: string;
  thickness?: string;
  centerBore?: string;
  design?: string;
  sensorType?: string;
  batteryLife?: string;
  display?: string;
  portability?: string;
  contents?: string;
  length?: string;
}

interface Product {
  id: string;
  name: string;
  price: string;
  imageSrc: string;
  description: string;
  specs?: ExtendedProductSpecs;
  rating: number;
  reviews: number;
}

const CategoryScreen = ({ categorySlug }: CategoryScreenProps) => {
  const router = useRouter();

  useEffect(() => {
    console.log("Category slug changed:", categorySlug);
  }, [categorySlug]);

  // Enhanced dummy data for wheel and tire categories with comprehensive specifications
  const products: Record<string, Product[]> = {
    "all-season-tires": [
      {
        id: "1",
        name: "Michelin CrossClimate2",
        price: "$250",
        imageSrc: "/tires/Michelin CrossClimate2/mi_crossclimate2_suv_full.webp",
        description: "Experience exceptional all-season performance with the Michelin CrossClimate2. Designed for year-round reliability in all weather conditions.",
        specs: { 
          size: "225/45R17", 
          loadSpeed: "94V", 
          season: "All-Season", 
          type: "Grand Touring",
          treadwear: "620",
          traction: "AA",
          temperature: "A",
          warranty: "6 Years",
          loadIndex: "94",
          speedRating: "V"
        },
        rating: 4.8,
        reviews: 1240
      },
      {
        id: "2",
        name: "Continental ExtremeContact",
        price: "$180",
        imageSrc: "/tires/Continental ExtremeContact/conraj_ang_l.jpg",
        description: "The Continental TrueContact Tour offers excellent all-season traction, long tread life, and a comfortable ride for everyday driving.",
        specs: { 
          size: "205/55R16", 
          loadSpeed: "91H", 
          season: "All-Season", 
          type: "Standard Touring",
          treadwear: "700",
          traction: "A",
          temperature: "A",
          warranty: "6 Years",
          loadIndex: "91",
          speedRating: "H"
        },
        rating: 4.6,
        reviews: 850
      },
      {
        id: "3",
        name: "Goodyear Eagle F1",
        price: "$220",
        imageSrc: "/tires/Goodyear Eagle F1/Eagle_F1_Asymmetric_All_Season_2614.png",
        description: "Goodyear Assurance WeatherReady delivers outstanding performance in dry, wet, and light snow conditions with superior braking and handling.",
        specs: { 
          size: "215/60R16", 
          loadSpeed: "95H", 
          season: "All-Season", 
          type: "Grand Touring",
          treadwear: "750",
          traction: "AA",
          temperature: "A",
          warranty: "70,000 miles",
          loadIndex: "95",
          speedRating: "H"
        },
        rating: 4.7,
        reviews: 920
      },
      {
        id: "4",
        name: "Bridgestone Blizzak WS90",
        price: "$230",
        imageSrc: "/tires/Bridgestone Blizzak WS90/bs_blizzak_ws90_full.webp",
        description: "The Bridgestone Turanza QuietTrack provides a quiet, comfortable ride with excellent all-season traction and long-lasting tread.",
        specs: { 
          size: "235/50R18", 
          loadSpeed: "97V", 
          season: "All-Season", 
          type: "Grand Touring",
          treadwear: "820",
          traction: "AA",
          temperature: "A",
          warranty: "65,000 miles",
          loadIndex: "97",
          speedRating: "V"
        },
        rating: 4.5,
        reviews: 640
      },
    ],
    "summer-tires": [
      {
        id: "5",
        name: "Michelin Pilot Sport Cup 2",
        price: "$280",
        imageSrc: "/tires/Michelin Pilot Sport Cup 2/4w-368_3528703112235_tire_michelin_pilot-sport-cup-2-r_325-slash-30-zr21-108y-xl_n0_a_main_5-quarterzoom_nopad.webp",
        description: "Experience exceptional grip and precision handling with the Michelin Pilot Sport 4S. Designed for ultimate performance on both road and track.",
        specs: { 
          size: "245/40R19", 
          loadSpeed: "98Y", 
          season: "Summer", 
          type: "Max Performance",
          treadwear: "300",
          traction: "AA",
          temperature: "A",
          warranty: "5 Years",
          loadIndex: "98",
          speedRating: "Y"
        },
        rating: 4.9,
        reviews: 2100
      },
      {
        id: "6",
        name: "Pirelli P Zero",
        price: "$290",
        imageSrc: "/tires/Pirelli P Zero/pzero.png",
        description: "The Pirelli P Zero is a high-performance tire, a benchmark for the ultra-high performance segment, characterized by an asymmetric tread pattern.",
        specs: { 
          size: "255/35R19", 
          loadSpeed: "96Y", 
          season: "Summer", 
          type: "Max Performance",
          treadwear: "320",
          traction: "AA",
          temperature: "A",
          warranty: "5 Years",
          loadIndex: "96",
          speedRating: "Y"
        },
        rating: 4.7,
        reviews: 1500
      },
      {
        id: "7",
        name: "Goodyear Eagle F1",
        price: "$240",
        imageSrc: "/tires/Goodyear Eagle F1/Eagle_F1_Supercar_58.png",
        description: "Goodyear Eagle F1 Asymmetric 5 delivers outstanding wet and dry performance, offering superior braking and handling.",
        specs: { 
          size: "225/40R18", 
          loadSpeed: "92Y", 
          season: "Summer", 
          type: "Ultra High Performance",
          treadwear: "340",
          traction: "AA",
          temperature: "A",
          warranty: "5 Years",
          loadIndex: "92",
          speedRating: "Y"
        },
        rating: 4.6,
        reviews: 780
      },
      {
        id: "8",
        name: "Continental ExtremeContact",
        price: "$250",
        imageSrc: "/tires/Continental ExtremeContact/p3-conti.png",
        description: "The Continental ExtremeContact Sport is a summer ultra-high performance tire for passenger cars, offering precise handling and maximum grip.",
        specs: { 
          size: "235/40R18", 
          loadSpeed: "95Y", 
          season: "Summer", 
          type: "Max Performance",
          treadwear: "300",
          traction: "AA",
          temperature: "A",
          warranty: "5 Years",
          loadIndex: "95",
          speedRating: "Y"
        },
        rating: 4.8,
        reviews: 1100
      },
    ],
    "winter-tires": [
      {
        id: "9",
        name: "Bridgestone Blizzak WS90",
        price: "$200",
        imageSrc: "/tires/Bridgestone Blizzak WS90/bs_blizzak_ws90_full.webp",
        description: "The Bridgestone Blizzak WS90 provides exceptional winter traction with advanced tread compound technology for superior grip on snow and ice.",
        specs: { 
          size: "205/55R16", 
          loadSpeed: "91H", 
          season: "Winter", 
          type: "Studless Ice & Snow",
          treadwear: "340",
          traction: "A",
          temperature: "A",
          warranty: "6 Years",
          loadIndex: "91",
          speedRating: "H"
        },
        rating: 4.8,
        reviews: 3200
      },
      {
        id: "10",
        name: "Michelin X-Ice Snow",
        price: "$220",
        imageSrc: "/tires/Michelin Pilot Sport Cup 2/4w-368_3528703112235_tire_michelin_pilot-sport-cup-2-r_325-slash-30-zr21-108y-xl_n0_a_main_5-quarterzoom_nopad.webp",
        description: "Michelin X-Ice Snow offers excellent winter performance with enhanced grip on snow and ice, plus improved tread life.",
        specs: { 
          size: "215/60R16", 
          loadSpeed: "95H", 
          season: "Winter", 
          type: "Studless Ice & Snow",
          treadwear: "360",
          traction: "A",
          temperature: "A",
          warranty: "6 Years",
          loadIndex: "95",
          speedRating: "H"
        },
        rating: 4.7,
        reviews: 2800
      },
      {
        id: "11",
        name: "Continental WinterContact SI",
        price: "$190",
        imageSrc: "/tires/Continental WinterContact SI/81xOxxc9V3L.jpg",
        description: "The Continental WinterContact SI delivers reliable winter traction and handling in cold weather conditions with excellent snow and ice grip.",
        specs: { 
          size: "195/65R15", 
          loadSpeed: "91T", 
          season: "Winter", 
          type: "Studless Ice & Snow",
          treadwear: "320",
          traction: "A",
          temperature: "A",
          warranty: "6 Years",
          loadIndex: "91",
          speedRating: "T"
        },
        rating: 4.6,
        reviews: 1500
      },
      {
        id: "12",
        name: "Nokian Hakkapeliitta R3",
        price: "$250",
        imageSrc: "/tires/Michelin CrossClimate2/mi_crossclimate2_suv_full.webp",
        description: "Nokian Hakkapeliitta R3 is a premium winter tire offering superior grip on snow and ice with excellent handling characteristics.",
        specs: { 
          size: "225/50R17", 
          loadSpeed: "98R", 
          season: "Winter", 
          type: "Studless Ice & Snow",
          treadwear: "380",
          traction: "AA",
          temperature: "A",
          warranty: "7 Years",
          loadIndex: "98",
          speedRating: "R"
        },
        rating: 4.9,
        reviews: 950
      },
    ],
    "performance-tires": [
      {
        id: "13",
        name: "Michelin Pilot Sport Cup 2",
        price: "$350",
        imageSrc: "/tires/Michelin Pilot Sport Cup 2/4w-368_3528703112235_tire_michelin_pilot-sport-cup-2-r_325-slash-30-zr21-108y-xl_n0_a_main_5-quarterzoom_nopad.webp",
        description: "Track-focused performance tire designed for maximum grip and precision handling on both road and track.",
        specs: { 
          size: "265/35R19", 
          loadSpeed: "98Y", 
          season: "Performance", 
          type: "Streetable Track & Competition",
          treadwear: "200",
          traction: "A",
          temperature: "A",
          warranty: "3 Years",
          loadIndex: "98",
          speedRating: "Y"
        },
        rating: 4.9,
        reviews: 450
      },
      {
        id: "14",
        name: "Pirelli P Zero Trofeo R",
        price: "$380",
        imageSrc: "/tires/Pirelli P Zero Trofeo R/PZ5_visorePDP_3-4.png",
        description: "Ultra-high performance tire optimized for track use with exceptional dry grip and handling capabilities.",
        specs: { 
          size: "245/35R19", 
          loadSpeed: "93Y", 
          season: "Performance", 
          type: "Streetable Track & Competition",
          treadwear: "180",
          traction: "A",
          temperature: "A",
          warranty: "3 Years",
          loadIndex: "93",
          speedRating: "Y"
        },
        rating: 4.8,
        reviews: 320
      },
      {
        id: "15",
        name: "Toyo Proxes R888R",
        price: "$320",
        imageSrc: "/tires/Goodyear Eagle F1/Eagle_F1_Asymmetric_3_13495.png",
        description: "Competition-grade tire offering maximum dry traction and performance for track enthusiasts.",
        specs: { 
          size: "235/40R18", 
          loadSpeed: "91W", 
          season: "Performance", 
          type: "R-Compound",
          treadwear: "150",
          traction: "A",
          temperature: "A",
          warranty: "2 Years",
          loadIndex: "91",
          speedRating: "W"
        },
        rating: 4.7,
        reviews: 580
      },
    ],
    "alloy-wheels": [
      {
        id: "16",
        name: "Enkei RPF1 Alloy Wheels",
        price: "$1200",
        imageSrc: "/tires/Enkei RPF1 Alloy Wheels/ENKEI-RPF1-BK-131-WEB.jpg",
        description: "Lightweight forged alloy wheels designed for performance and style. Available in multiple sizes and finishes.",
        specs: { 
          rimSize: "17x9", 
          boltPattern: "5x114.3", 
          offset: "35mm", 
          finish: "Gunmetal with Machined Lip",
          type: "Flow Formed" 
        },
        rating: 4.9,
        reviews: 890
      },
      {
        id: "17",
        name: "OZ Racing Superturismo",
        price: "$1800",
        imageSrc: "/tires/OZ Racing Superturismo/oz-racing-superturismo-gt-mini-wheels-silver-2.webp",
        description: "Premium Italian alloy wheels combining classic design with modern performance and durability.",
        specs: { 
          rimSize: "18x8", 
          boltPattern: "5x112", 
          offset: "40mm", 
          finish: "Anthracite Metallic",
          type: "Cast" 
        },
        rating: 4.8,
        reviews: 420
      },
      {
        id: "18",
        name: "BBS CH-R Alloy Wheels",
        price: "$2000",
        imageSrc: "/tires/BBS CH-R Alloy Wheels/images.jpg",
        description: "High-quality German alloy wheels featuring a sporty design and excellent build quality.",
        specs: { 
          rimSize: "19x8.5", 
          boltPattern: "5x100", 
          offset: "38mm", 
          finish: "Diamond Cut Silver",
          type: "Flow Formed" 
        },
        rating: 4.9,
        reviews: 650
      },
      {
        id: "19",
        name: "Rotiform RSE Alloy Wheels",
        price: "$1500",
        imageSrc: "/tires/Rotiform RSE Alloy Wheels/images.jpg",
        description: "Modern alloy wheels with a distinctive design, perfect for customizing your vehicle's appearance.",
        specs: { 
          rimSize: "18x8.5", 
          boltPattern: "5x120", 
          offset: "45mm", 
          finish: "Matte Black",
          type: "Cast" 
        },
        rating: 4.7,
        reviews: 340
      },
    ],
    "steel-wheels": [
      {
        id: "20",
        name: "Steel Wheel Set (15 inch)",
        price: "$400",
        imageSrc: "/tires/steel Wheel Set (15 inch)/images.jpg",
        description: "Durable steel wheels perfect for winter use or as spare wheels. Built to last with excellent corrosion resistance.",
        specs: { 
          rimSize: "15x6", 
          boltPattern: "5x114.3", 
          offset: "38mm", 
          finish: "Black Powder Coat",
          type: "Steel" 
        },
        rating: 4.5,
        reviews: 120
      },
      {
        id: "21",
        name: "Steel Wheel Set (16 inch)",
        price: "$450",
        imageSrc: "/tires/Steel Wheel Set (16 inch)/images.jpg",
        description: "Heavy-duty steel wheels offering reliability and affordability for everyday driving.",
        specs: { 
          rimSize: "16x6.5", 
          boltPattern: "5x114.3", 
          offset: "40mm", 
          finish: "Silver Powder Coat",
          type: "Steel" 
        },
        rating: 4.6,
        reviews: 150
      },
      {
        id: "22",
        name: "Steel Wheel Set (17 inch)",
        price: "$500",
        imageSrc: "/tires/Steel Wheel Set (17 inch)/images.jpg",
        description: "Larger steel wheels providing strength and durability for larger vehicles.",
        specs: { 
          rimSize: "17x7", 
          boltPattern: "5x120", 
          offset: "42mm", 
          finish: "Gunmetal Powder Coat",
          type: "Steel" 
        },
        rating: 4.5,
        reviews: 180
      },
    ],
    "packages": [
      {
        id: "23",
        name: "Complete Tire & Wheel Package",
        price: "$1800",
        imageSrc: "/tires/Complete Tire & Wheel Package/images (1).jpg",
        description: "Complete package including 4 tires and 4 alloy wheels, ready for installation. Perfect for upgrading your vehicle.",
        specs: { 
          size: "225/45R17", 
          loadSpeed: "94V", 
          season: "All-Season", 
          type: "Grand Touring",
          rimSize: "17x8",
          boltPattern: "5x114.3",
          offset: "35mm"
        },
        rating: 4.8,
        reviews: 56
      },
      {
        id: "24",
        name: "Winter Tire Package",
        price: "$1200",
        imageSrc: "/tires/Winter Tire Package/images.jpg",
        description: "Complete winter tire package with steel wheels, ideal for seasonal tire changes.",
        specs: { 
          size: "205/55R16", 
          loadSpeed: "91H", 
          season: "Winter",
          rimSize: "16x6.5",
          boltPattern: "5x114.3",
          offset: "40mm"
        },
        rating: 4.7,
        reviews: 89
      },
      {
        id: "25",
        name: "Performance Package",
        price: "$2800",
        imageSrc: "/tires/Performance Package/images (1).jpg",
        description: "Premium performance package featuring high-performance tires and lightweight alloy wheels.",
        specs: { 
          size: "245/40R18", 
          loadSpeed: "97Y", 
          season: "Performance",
          rimSize: "18x8.5",
          boltPattern: "5x112",
          offset: "38mm"
        },
        rating: 4.9,
        reviews: 45
      },
    ],
    "wheel-accessories": [
      {
        id: "26",
        name: "Wheel Lug Nuts Set",
        price: "$50",
        imageSrc: "/tires/Wheel Lug Nuts Set/images.jpg",
        description: "High-quality lug nuts for secure wheel mounting. Available in various finishes and thread sizes.",
        specs: { 
          threadSize: "M12 x 1.5", 
          seatType: "Conical", 
          finish: "Chrome"
        },
        rating: 4.6,
        reviews: 230
      },
      {
        id: "27",
        name: "Wheel Spacers",
        price: "$120",
        imageSrc: "/tires/Wheel Spacers/images.jpg",
        description: "Precision-machined wheel spacers to adjust wheel offset and improve vehicle stance.",
        specs: { 
          thickness: "15mm", 
          boltPattern: "5x114.3", 
          centerBore: "67.1mm",
          threadSize: "M12 x 1.5"
        },
        rating: 4.5,
        reviews: 150
      },
      {
        id: "28",
        name: "Wheel Center Caps",
        price: "$30",
        imageSrc: "/tires/Wheel Center Caps/images.jpg",
        description: "Decorative center caps to complete your wheel's appearance. Available in multiple designs.",
        specs: { 
          size: "57mm", 
          finish: "Chrome", 
          design: "OEM Style"
        },
        rating: 4.4,
        reviews: 90
      },
    ],
    "tire-accessories": [
      {
        id: "29",
        name: "Tire Pressure Monitoring System",
        price: "$150",
        imageSrc: "/tires/Tire Pressure Monitoring System/images.jpg",
        description: "Wireless TPMS system to monitor tire pressure in real-time for safety and fuel efficiency.",
        specs: { 
          sensorType: "Indirect TPMS", 
          batteryLife: "5-7 Years", 
          display: "LCD Dashboard Display"
        },
        rating: 4.7,
        reviews: 310
      },
      {
        id: "30",
        name: "Tire Valve Stems",
        price: "$25",
        imageSrc: "/tires/Tire Valve Stems/images.jpg",
        description: "High-quality valve stems for proper tire inflation and pressure maintenance.",
        specs: { 
          type: "Rubber", 
          threadSize: "Presta/Schrader", 
          length: "42mm"
        },
        rating: 4.8,
        reviews: 420
      },
      {
        id: "31",
        name: "Tire Repair Kit",
        price: "$40",
        imageSrc: "/tires/Tire Repair Kit/images.jpg",
        description: "Complete tire repair kit for emergency flat tire repairs on the go.",
        specs: { 
          contents: "Plug strips, insertion tool, reamer, scissors", 
          portability: "Compact carrying case"
        },
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
          {currentCategoryProducts.length > 0 ? (
            currentCategoryProducts.map((product) => (
              <ProductItem
                key={product.id}
                name={product.name}
                price={product.price}
                imageSrc={product.imageSrc}
                href={`/product/${product.id}`}
                specs={product.specs}
                rating={product.rating}
                reviews={product.reviews}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-muted-foreground">No products found in this category.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CategoryScreen;