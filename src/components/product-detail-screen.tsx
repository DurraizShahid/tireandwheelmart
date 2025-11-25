"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, Gauge, Shield, Calendar, Zap, Snowflake, Sun, CloudRain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCart } from "@/contexts/cart-context";

interface ProductDetailScreenProps {
  productId: string;
}

interface ProductSpecs {
  size?: string;
  loadSpeed?: string;
  season?: "All-Season" | "Summer" | "Winter" | "Performance" | "All-Terrain";
  type?: string;
  treadwear?: string;
  traction?: string;
  temperature?: string;
  warranty?: string;
  utqg?: string;
  construction?: string;
  loadIndex?: string;
  speedRating?: string;
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
  name: string;
  price: string;
  imageSrc: string;
  description: string;
  specs?: ProductSpecs;
  features?: string[];
}

const ProductDetailScreen = ({ productId }: ProductDetailScreenProps) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Enhanced product data with comprehensive specifications
  const allProducts: Record<string, Product> = {
    "1": { 
      name: "Michelin CrossClimate2", 
      price: "$250", 
      imageSrc: "/images/tires_icon.webp", 
      description: "Experience exceptional all-season performance with the Michelin CrossClimate2. Designed for year-round reliability in all weather conditions with superior traction and handling.", 
      specs: {
        size: "225/45R17",
        loadSpeed: "94V",
        season: "All-Season",
        type: "Grand Touring",
        treadwear: "620",
        traction: "AA",
        temperature: "A",
        warranty: "6 Years or 70,000 miles",
        loadIndex: "94",
        speedRating: "V (149 mph)",
        construction: "Radial"
      },
      features: [
        "All-season performance in wet, dry, and light snow conditions",
        "Long-lasting tread life with EverGrip technology",
        "Reduced stopping distances in wet conditions",
        "Low rolling resistance for improved fuel economy",
        "Quiet, comfortable ride"
      ]
    },
    "2": { 
      name: "Enkei RPF1 Alloy Wheels", 
      price: "$1200", 
      imageSrc: "/images/wheels_icon.webp", 
      description: "Lightweight forged alloy wheels designed for performance and style. Available in multiple sizes and finishes. Perfect for track and street use.", 
      specs: {
        rimSize: "17x8",
        boltPattern: "5x114.3",
        offset: "35mm",
        finish: "Gunmetal with Machined Lip"
      },
      features: [
        "One-piece forged construction for strength and light weight",
        "Flow forming process for optimal strength-to-weight ratio",
        "TUV/JWL certified for safety and durability",
        "Available in multiple sizes and finishes",
        "Direct fit for many popular vehicles"
      ]
    },
    "3": { 
      name: "Bridgestone Blizzak WS90", 
      price: "$200", 
      imageSrc: "/images/snowTire_icon.webp", 
      description: "The Bridgestone Blizzak WS90 provides exceptional winter traction with advanced tread compound technology for superior grip on snow and ice.", 
      specs: {
        size: "205/55R16",
        loadSpeed: "91H",
        season: "Winter",
        type: "Studless Ice & Snow",
        treadwear: "340",
        traction: "A",
        temperature: "A",
        warranty: "6 Years or 60,000 miles",
        loadIndex: "91",
        speedRating: "H (130 mph)",
        construction: "Radial"
      },
      features: [
        "Multicell compound technology for enhanced snow and ice grip",
        "3D zigzag sipes for improved biting edges",
        "Advanced shoulder design for confident cornering",
        "Optimized tread pattern for even wear",
        "Excellent performance in severe winter conditions"
      ]
    },
    "4": { 
      name: "OZ Racing Superturismo", 
      price: "$1800", 
      imageSrc: "/images/wheels_icon.webp", 
      description: "Premium Italian alloy wheels combining classic design with modern performance and durability. Available in various sizes and finishes.", 
      specs: {
        rimSize: "18x8.5",
        boltPattern: "5x112",
        offset: "40mm",
        finish: "Anthracite Metallic"
      },
      features: [
        "High-pressure die-cast aluminum construction",
        "Classic 5-spoke design with modern aesthetics",
        "TUV certified for European safety standards",
        "Lightweight design for improved performance",
        "Multiple finish options to match any vehicle"
      ]
    },
    "5": { 
      name: "Pirelli P Zero", 
      price: "$290", 
      imageSrc: "/images/tires_icon.webp", 
      description: "The Pirelli P Zero is a high-performance tire, a benchmark for the ultra-high performance segment, characterized by an asymmetric tread pattern.", 
      specs: {
        size: "245/40R19",
        loadSpeed: "97Y",
        season: "Summer",
        type: "Max Performance",
        treadwear: "300",
        traction: "A",
        temperature: "A",
        warranty: "5 Years or 50,000 miles",
        loadIndex: "97",
        speedRating: "Y (186 mph)",
        construction: "Radial"
      },
      features: [
        "Asymmetric tread pattern for optimal dry and wet performance",
        "High silica content compound for enhanced grip",
        "Variable contact patch for responsive handling",
        "Reinforced bead area for high-speed stability",
        "Ideal for sports cars and performance sedans"
      ]
    },
    "6": { 
      name: "Goodyear Eagle F1", 
      price: "$240", 
      imageSrc: "/images/tires_icon.webp", 
      description: "Goodyear Eagle F1 Asymmetric 5 delivers outstanding wet and dry performance, offering superior braking and handling.", 
      specs: {
        size: "225/45R18",
        loadSpeed: "95Y",
        season: "Summer",
        type: "Ultra High Performance",
        treadwear: "320",
        traction: "AA",
        temperature: "A",
        warranty: "5 Years or 50,000 miles",
        loadIndex: "95",
        speedRating: "Y (186 mph)",
        construction: "Radial"
      },
      features: [
        "Active Braking Technology for shorter stopping distances",
        "Asymmetric tread design for balanced performance",
        "High-density silica compound for wet grip",
        "Advanced treadwear indicators for easy monitoring",
        "Excellent high-speed stability"
      ]
    },
    "7": { 
      name: "Continental ExtremeContact", 
      price: "$250", 
      imageSrc: "/images/tires_icon.webp", 
      description: "The Continental ExtremeContact Sport is a summer ultra-high performance tire for passenger cars, offering precise handling and maximum grip.", 
      specs: {
        size: "235/40R18",
        loadSpeed: "95Y",
        season: "Summer",
        type: "Max Performance",
        treadwear: "300",
        traction: "AA",
        temperature: "A",
        warranty: "5 Years or 50,000 miles",
        loadIndex: "95",
        speedRating: "Y (186 mph)",
        construction: "Radial"
      },
      features: [
        "SportPlus compound for maximum grip",
        "EVO Black Chili compound technology",
        "Asymmetric tread pattern for optimal contact",
        "High-speed rated for performance driving",
        "Low rolling resistance for efficiency"
      ]
    },
    "8": { 
      name: "Michelin X-Ice Snow", 
      price: "$220", 
      imageSrc: "/images/snowTire_icon.webp", 
      description: "Michelin X-Ice Snow offers excellent winter performance with enhanced grip on snow and ice, plus improved tread life.", 
      specs: {
        size: "215/60R16",
        loadSpeed: "95H",
        season: "Winter",
        type: "Studless Ice & Snow",
        treadwear: "360",
        traction: "A",
        temperature: "A",
        warranty: "6 Years or 60,000 miles",
        loadIndex: "95",
        speedRating: "H (130 mph)",
        construction: "Radial"
      },
      features: [
        "X-Ice Snow compound for superior ice grip",
        "3D active sipe technology for enhanced traction",
        "Optimized tread pattern for even wear",
        "Improved hydroplaning resistance",
        "Excellent performance in cold weather conditions"
      ]
    },
    "9": { 
      name: "Continental WinterContact SI", 
      price: "$190", 
      imageSrc: "/images/snowTire_icon.webp", 
      description: "The Continental WinterContact SI delivers reliable winter traction and handling in cold weather conditions with excellent snow and ice grip.", 
      specs: {
        size: "195/65R15",
        loadSpeed: "91T",
        season: "Winter",
        type: "Studless Ice & Snow",
        treadwear: "320",
        traction: "A",
        temperature: "A",
        warranty: "6 Years or 60,000 miles",
        loadIndex: "91",
        speedRating: "T (118 mph)",
        construction: "Radial"
      },
      features: [
        "Cold weather compound stays flexible in freezing temperatures",
        "3D Braking Sipes for enhanced stopping power",
        "Snow groove design for improved snow traction",
        "Even wear design for extended tread life",
        "Whisper compound for reduced noise"
      ]
    },
    "10": { 
      name: "Nokian Hakkapeliitta R3", 
      price: "$250", 
      imageSrc: "/images/snowTire_icon.webp", 
      description: "Nokian Hakkapeliitta R3 is a premium winter tire offering superior grip on snow and ice with excellent handling characteristics.", 
      specs: {
        size: "225/50R17",
        loadSpeed: "98R",
        season: "Winter",
        type: "Studless Ice & Snow",
        treadwear: "380",
        traction: "AA",
        temperature: "A",
        warranty: "6 Years or 70,000 miles",
        loadIndex: "98",
        speedRating: "R (106 mph)",
        construction: "Radial"
      },
      features: [
        "Biological Arctic Grip compound for ice traction",
        "Triangular stud design for maximum grip",
        "Run Flat capability for continued mobility",
        "Noise reduction technology for quiet ride",
        "Fuel-efficient design with low rolling resistance"
      ]
    },
    "11": { 
      name: "BBS CH-R Alloy Wheels", 
      price: "$2000", 
      imageSrc: "/images/wheels_icon.webp", 
      description: "High-quality German alloy wheels featuring a sporty design and excellent build quality. Perfect for luxury and performance vehicles.", 
      specs: {
        rimSize: "19x8.5",
        boltPattern: "5x100",
        offset: "38mm",
        finish: "Diamond Cut Silver"
      },
      features: [
        "Three-piece construction for customization",
        "Forged center for lightweight strength",
        "Flow formed barrels for optimal performance",
        "TUV certified for safety standards",
        "Available in multiple sizes and offsets"
      ]
    },
    "12": { 
      name: "Rotiform RSE Alloy Wheels", 
      price: "$1500", 
      imageSrc: "/images/wheels_icon.webp", 
      description: "Modern alloy wheels with a distinctive design, perfect for customizing your vehicle's appearance. Available in multiple finishes.", 
      specs: {
        rimSize: "18x8.5",
        boltPattern: "5x120",
        offset: "45mm",
        finish: "Matte Black"
      },
      features: [
        "Monoblock construction for clean aesthetics",
        "Low-pressure casting for consistent quality",
        "Multiple spoke designs available",
        "JWL/VIA certified for safety compliance",
        "Compatible with most modern vehicles"
      ]
    },
    "13": { 
      name: "Complete Tire & Wheel Package", 
      price: "$1800", 
      imageSrc: "/images/package_icon.webp", 
      description: "Complete package including 4 tires and 4 alloy wheels, ready for installation. Perfect for upgrading your vehicle with a complete wheel and tire set.", 
      specs: {
        size: "225/45R17",
        loadSpeed: "94V",
        season: "All-Season",
        type: "Grand Touring",
        rimSize: "17x8",
        boltPattern: "5x114.3",
        offset: "35mm"
      },
      features: [
        "Pre-selected compatible tire and wheel combination",
        "Professional mounting and balancing included",
        "Balanced performance and aesthetics",
        "Cost savings compared to separate purchases",
        "Ready for immediate installation"
      ]
    },
    "14": { 
      name: "Michelin Pilot Sport Cup 2", 
      price: "$350", 
      imageSrc: "/images/tires_icon.webp", 
      description: "Track-focused performance tire designed for maximum grip and precision handling on both road and track. Ideal for performance enthusiasts.", 
      specs: {
        size: "265/35R19",
        loadSpeed: "98Y",
        season: "Performance",
        type: "Streetable Track & Competition",
        treadwear: "200",
        traction: "A",
        temperature: "A",
        warranty: "3 Years or 30,000 miles",
        loadIndex: "98",
        speedRating: "Y (186 mph)",
        construction: "Radial"
      },
      features: [
        "Bi-compound technology for track performance",
        "Cup 2 tread pattern for maximum grip",
        "Heat-activated compounds for optimal performance",
        "Enhanced steering response and feedback",
        "Road-legal for daily driving"
      ]
    },
    "15": { 
      name: "Pirelli P Zero Trofeo R", 
      price: "$380", 
      imageSrc: "/images/tires_icon.webp", 
      description: "Ultra-high performance tire optimized for track use with exceptional dry grip and handling capabilities. For serious track enthusiasts.", 
      specs: {
        size: "245/35R19",
        loadSpeed: "93Y",
        season: "Performance",
        type: "Streetable Track & Competition",
        treadwear: "180",
        traction: "A",
        temperature: "A",
        warranty: "3 Years or 30,000 miles",
        loadIndex: "93",
        speedRating: "Y (186 mph)",
        construction: "Radial"
      },
      features: [
        "Elect functional compound for extreme grip",
        "Trofeo R specific tread pattern for track use",
        "Enhanced lateral grip for cornering",
        "Optimized for high-performance vehicles",
        "DOT-approved for street use"
      ]
    },
    "16": { 
      name: "Enkei RPF1 Alloy Wheels", 
      price: "$1200", 
      imageSrc: "/images/wheels_icon.webp", 
      description: "Lightweight forged alloy wheels designed for performance and style. Available in multiple sizes and finishes.", 
      specs: {
        rimSize: "17x9",
        boltPattern: "5x114.3",
        offset: "35mm",
        finish: "Silver with Gunmetal Lip"
      },
      features: [
        "One-piece forged construction for strength and light weight",
        "Flow forming process for optimal strength-to-weight ratio",
        "TUV/JWL certified for safety and durability",
        "Available in multiple sizes and finishes",
        "Direct fit for many popular vehicles"
      ]
    },
    "17": { 
      name: "OZ Racing Superturismo", 
      price: "$1800", 
      imageSrc: "/images/wheels_icon.webp", 
      description: "Premium Italian alloy wheels combining classic design with modern performance and durability.", 
      specs: {
        rimSize: "18x8",
        boltPattern: "5x112",
        offset: "40mm",
        finish: "Black with Machined Accents"
      },
      features: [
        "High-pressure die-cast aluminum construction",
        "Classic 5-spoke design with modern aesthetics",
        "TUV certified for European safety standards",
        "Lightweight design for improved performance",
        "Multiple finish options to match any vehicle"
      ]
    },
    "18": { 
      name: "BBS CH-R Alloy Wheels", 
      price: "$2000", 
      imageSrc: "/images/wheels_icon.webp", 
      description: "High-quality German alloy wheels featuring a sporty design and excellent build quality.", 
      specs: {
        rimSize: "19x8.5",
        boltPattern: "5x100",
        offset: "38mm",
        finish: "Bronze Bronze"
      },
      features: [
        "Three-piece construction for customization",
        "Forged center for lightweight strength",
        "Flow formed barrels for optimal performance",
        "TUV certified for safety standards",
        "Available in multiple sizes and offsets"
      ]
    },
    "19": { 
      name: "Rotiform RSE Alloy Wheels", 
      price: "$1500", 
      imageSrc: "/images/wheels_icon.webp", 
      description: "Modern alloy wheels with a distinctive design, perfect for customizing your vehicle's appearance.", 
      specs: {
        rimSize: "18x8.5",
        boltPattern: "5x120",
        offset: "45mm",
        finish: "Gunmetal"
      },
      features: [
        "Monoblock construction for clean aesthetics",
        "Low-pressure casting for consistent quality",
        "Multiple spoke designs available",
        "JWL/VIA certified for safety compliance",
        "Compatible with most modern vehicles"
      ]
    },
    "20": { 
      name: "Steel Wheel Set (15 inch)", 
      price: "$400", 
      imageSrc: "/images/wheels_icon.webp", 
      description: "Durable steel wheels perfect for winter use or as spare wheels. Built to last with excellent corrosion resistance.", 
      specs: {
        rimSize: "15x6",
        boltPattern: "5x114.3",
        offset: "38mm",
        finish: "Black Powder Coat"
      },
      features: [
        "Heavy-duty steel construction for durability",
        "Corrosion-resistant powder coating",
        "Perfect for winter tire mounting",
        "Compatible with most hubcaps",
        "Economical spare wheel option"
      ]
    },
    "21": { 
      name: "Steel Wheel Set (16 inch)", 
      price: "$450", 
      imageSrc: "/images/wheels_icon.webp", 
      description: "Heavy-duty steel wheels offering reliability and affordability for everyday driving.", 
      specs: {
        rimSize: "16x6.5",
        boltPattern: "5x114.3",
        offset: "40mm",
        finish: "Silver Powder Coat"
      },
      features: [
        "Robust steel construction for heavy loads",
        "Powder-coated finish for rust protection",
        "Universal bolt pattern compatibility",
        "Affordable alternative to alloy wheels",
        "Ideal for commercial vehicles"
      ]
    },
    "22": { 
      name: "Steel Wheel Set (17 inch)", 
      price: "$500", 
      imageSrc: "/images/wheels_icon.webp", 
      description: "Larger steel wheels providing strength and durability for larger vehicles.", 
      specs: {
        rimSize: "17x7",
        boltPattern: "5x120",
        offset: "42mm",
        finish: "Gunmetal Powder Coat"
      },
      features: [
        "Heavy-duty steel for maximum strength",
        "Larger diameter for modern vehicle fitment",
        "Powder-coated finish for long-lasting protection",
        "Suitable for SUVs and trucks",
        "Compatible with most tire sizes"
      ]
    },
    "23": { 
      name: "Complete Tire & Wheel Package", 
      price: "$1800", 
      imageSrc: "/images/package_icon.webp", 
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
      features: [
        "Pre-selected compatible tire and wheel combination",
        "Professional mounting and balancing included",
        "Balanced performance and aesthetics",
        "Cost savings compared to separate purchases",
        "Ready for immediate installation"
      ]
    },
    "24": { 
      name: "Winter Tire Package", 
      price: "$1200", 
      imageSrc: "/images/snowPackages_icon.webp", 
      description: "Complete winter tire package with steel wheels, ideal for seasonal tire changes.", 
      specs: {
        size: "205/55R16",
        loadSpeed: "91H",
        season: "Winter",
        type: "Studless Ice & Snow",
        rimSize: "16x6.5",
        boltPattern: "5x114.3",
        offset: "40mm"
      },
      features: [
        "Complete winter setup with dedicated wheels",
        "Easy seasonal tire changes",
        "Steel wheels for durability in harsh conditions",
        "All necessary hardware included",
        "Professional installation available"
      ]
    },
    "25": { 
      name: "Performance Package", 
      price: "$2800", 
      imageSrc: "/images/package_icon.webp", 
      description: "Premium performance package featuring high-performance tires and lightweight alloy wheels.", 
      specs: {
        size: "245/40R18",
        loadSpeed: "97Y",
        season: "Performance",
        type: "Max Performance",
        rimSize: "18x8.5",
        boltPattern: "5x112",
        offset: "38mm"
      },
      features: [
        "High-performance tire and wheel combination",
        "Optimized for sports cars and performance vehicles",
        "Lightweight wheels for improved handling",
        "Professional installation and balancing included",
        "Track-capable setup"
      ]
    },
    "26": { 
      name: "Wheel Lug Nuts Set", 
      price: "$50", 
      imageSrc: "/images/wheels_icon.webp", 
      description: "High-quality lug nuts for secure wheel mounting. Available in various finishes and thread sizes.", 
      specs: {
        threadSize: "M12 x 1.5",
        seatType: "Conical",
        finish: "Chrome"
      },
      features: [
        "Grade 10.9 steel for maximum strength",
        "Chrome finish for corrosion resistance",
        "Conical seat for proper wheel alignment",
        "Sold as a set of 20 lug nuts",
        "Compatible with most vehicles"
      ]
    },
    "27": { 
      name: "Wheel Spacers", 
      price: "$120", 
      imageSrc: "/images/wheels_icon.webp", 
      description: "Precision-machined wheel spacers to adjust wheel offset and improve vehicle stance.", 
      specs: {
        thickness: "15mm",
        boltPattern: "5x114.3",
        centerBore: "67.1mm",
        threadSize: "M12 x 1.5"
      },
      features: [
        "6061-T6 aluminum construction",
        "Precision CNC machined for accuracy",
        "Includes extended wheel studs",
        "Improves vehicle stance and handling",
        "TUV certified for safety compliance"
      ]
    },
    "28": { 
      name: "Wheel Center Caps", 
      price: "$30", 
      imageSrc: "/images/wheels_icon.webp", 
      description: "Decorative center caps to complete your wheel's appearance. Available in multiple designs.", 
      specs: {
        size: "57mm",
        finish: "Chrome",
        design: "OEM Style"
      },
      features: [
        "Chrome-plated for lasting shine",
        "OEM-style design for authentic look",
        "Universal fit for most wheel types",
        "Includes retention clips for secure fit",
        "Sold as a set of 4 center caps"
      ]
    },
    "29": { 
      name: "Tire Pressure Monitoring System", 
      price: "$150", 
      imageSrc: "/images/tires_icon.webp", 
      description: "Wireless TPMS system to monitor tire pressure in real-time for safety and fuel efficiency.", 
      specs: {
        sensorType: "Indirect TPMS",
        batteryLife: "5-7 Years",
        display: "LCD Dashboard Display"
      },
      features: [
        "Real-time tire pressure monitoring",
        "Alerts when pressure drops below safe levels",
        "Improves fuel efficiency and tire life",
        "Easy DIY installation",
        "Compatible with most vehicles"
      ]
    },
    "30": { 
      name: "Tire Valve Stems", 
      price: "$25", 
      imageSrc: "/images/tires_icon.webp", 
      description: "High-quality valve stems for proper tire inflation and pressure maintenance.", 
      specs: {
        type: "Rubber",
        threadSize: "Presta/Schrader",
        length: "42mm"
      },
      features: [
        "Durable rubber construction",
        "Universal fit for all tire types",
        "Prevents air leakage",
        "Includes valve caps for protection",
        "Sold as a set of 4 valve stems"
      ]
    },
    "31": { 
      name: "Tire Repair Kit", 
      price: "$40", 
      imageSrc: "/images/tires_icon.webp", 
      description: "Complete tire repair kit for emergency flat tire repairs on the go.", 
      specs: {
        contents: "Plug strips, insertion tool, reamer, scissors",
        portability: "Compact carrying case"
      },
      features: [
        "Everything needed for roadside tire repair",
        "Easy-to-follow instructions included",
        "Works on most punctures up to 1/4 inch",
        "Compact design fits in glove compartment",
        "Professional-grade materials for reliable repairs"
      ]
    },
  };

  const product = allProducts[productId as keyof typeof allProducts];

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-background text-foreground">
        <p className="text-lg font-medium">Product not found.</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    const product = allProducts[productId as keyof typeof allProducts];
    if (!product) return;
    
    const priceNum = parseFloat(product.price.replace(/[$,]/g, ''));
    
    addToCart({
      id: productId,
      name: product.name,
      price: priceNum,
      quantity: quantity,
      imageSrc: product.imageSrc,
    });
    
    toast.success(`${quantity} x ${product.name} added to cart!`);
  };

  // Get season icon
  const getSeasonIcon = (season?: string) => {
    switch (season) {
      case "Winter": return <Snowflake className="h-4 w-4 mr-1" />;
      case "Summer": return <Sun className="h-4 w-4 mr-1" />;
      case "All-Season": return <CloudRain className="h-4 w-4 mr-1" />;
      case "Performance": return <Zap className="h-4 w-4 mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col items-center bg-white dark:bg-background text-foreground py-8">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
          {product.name}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-7xl mx-auto">
          {/* Product Image */}
          <div className="relative h-80 sm:h-96 md:h-[450px] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
            <Image
              src={product.imageSrc}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "contain" }}
              className="drop-shadow-2xl"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <Card className="bg-white dark:bg-card p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-baseline mb-4">
                <h2 className="text-3xl font-bold text-foreground">{product.name}</h2>
                <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">{product.price}</p>
              </div>
              
              {/* Season Badge */}
              {product.specs?.season && (
                <div className="mb-4">
                  <Badge variant="secondary" className="flex items-center text-sm font-medium bg-gray-100 dark:bg-gray-800 text-foreground">
                    {getSeasonIcon(product.specs.season)}
                    {product.specs.season}
                  </Badge>
                </div>
              )}
              
              <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                {product.description}
              </p>

            <Button
              className="w-full py-3 text-lg font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300 shadow-lg flex items-center justify-center gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
            
            {/* Quantity Selector */}
            <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">Quantity:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-8 w-8 p-0"
              >
                −
              </Button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-12 h-8 text-center border rounded-md bg-background text-foreground"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                className="h-8 w-8 p-0"
              >
                +
              </Button>
            </div>
            </Card>

            {/* Key Specifications */}
            {(product.specs?.size || product.specs?.loadSpeed || product.specs?.loadIndex || product.specs?.speedRating) && (
              <Card className="bg-white dark:bg-card p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl font-bold text-foreground">Specifications</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.specs?.size && (
                      <div className="flex items-center">
                        <Gauge className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                        <div>
                          <p className="text-sm text-muted-foreground">Tire Size</p>
                          <p className="font-medium">{product.specs.size}</p>
                        </div>
                      </div>
                    )}
                    
                    {product.specs?.loadSpeed && (
                      <div className="flex items-center">
                        <Gauge className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                        <div>
                          <p className="text-sm text-muted-foreground">Load Index / Speed Rating</p>
                          <p className="font-medium">{product.specs.loadSpeed}</p>
                        </div>
                      </div>
                    )}
                    
                    {product.specs?.loadIndex && (
                      <div className="flex items-center">
                        <Gauge className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                        <div>
                          <p className="text-sm text-muted-foreground">Load Index</p>
                          <p className="font-medium">{product.specs.loadIndex}</p>
                        </div>
                      </div>
                    )}
                    
                    {product.specs?.speedRating && (
                      <div className="flex items-center">
                        <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                        <div>
                          <p className="text-sm text-muted-foreground">Speed Rating</p>
                          <p className="font-medium">{product.specs.speedRating}</p>
                        </div>
                      </div>
                    )}
                    
                    {product.specs?.rimSize && (
                      <div className="flex items-center">
                        <Gauge className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                        <div>
                          <p className="text-sm text-muted-foreground">Rim Size</p>
                          <p className="font-medium">{product.specs.rimSize}</p>
                        </div>
                      </div>
                    )}
                    
                    {product.specs?.boltPattern && (
                      <div className="flex items-center">
                        <Gauge className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                        <div>
                          <p className="text-sm text-muted-foreground">Bolt Pattern</p>
                          <p className="font-medium">{product.specs.boltPattern}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* UTQG Ratings */}
            {(product.specs?.treadwear || product.specs?.traction || product.specs?.temperature) && (
              <Card className="bg-white dark:bg-card p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl font-bold text-foreground flex items-center">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    UTQG Ratings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Rating</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {product.specs?.treadwear && (
                        <TableRow>
                          <TableCell className="font-medium">Treadwear</TableCell>
                          <TableCell>{product.specs.treadwear}</TableCell>
                          <TableCell>Expected tread life (higher = longer lasting)</TableCell>
                        </TableRow>
                      )}
                      {product.specs?.traction && (
                        <TableRow>
                          <TableCell className="font-medium">Traction</TableCell>
                          <TableCell>{product.specs.traction}</TableCell>
                          <TableCell>Wet stopping ability (AA {'>'} A {'>'} B {'>'} C)</TableCell>
                        </TableRow>
                      )}
                      {product.specs?.temperature && (
                        <TableRow>
                          <TableCell className="font-medium">Temperature</TableCell>
                          <TableCell>{product.specs.temperature}</TableCell>
                          <TableCell>Heat resistance (A {'>'} B {'>'} C)</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Warranty Information */}
            {product.specs?.warranty && (
              <Card className="bg-white dark:bg-card p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl font-bold text-foreground flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    Warranty
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-foreground">{product.specs.warranty}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Features Section */}
        {product.features && product.features.length > 0 && (
          <section className="mt-12 max-w-7xl mx-auto">
            <Card className="bg-white dark:bg-card p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-2xl font-bold text-foreground">Key Features</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="ml-2 text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Technical Specifications Table */}
        <section className="mt-12 max-w-7xl mx-auto">
          <Card className="bg-white dark:bg-card p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-2xl font-bold text-foreground">Detailed Specifications</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  {Object.entries(product.specs || {}).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </TableCell>
                      <TableCell>{value as string}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default ProductDetailScreen;