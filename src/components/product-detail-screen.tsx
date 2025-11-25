"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProductDetailScreenProps {
  productId: string;
}

const ProductDetailScreen = ({ productId }: ProductDetailScreenProps) => {
  const router = useRouter();

  // Dummy product data for wheels and tires only
  const allProducts = {
    "1": { name: "Michelin CrossClimate2", price: "$250", imageSrc: "/images/tires_icon.webp", description: "Experience exceptional all-season performance with the Michelin CrossClimate2. Designed for year-round reliability in all weather conditions with superior traction and handling." },
    "2": { name: "Enkei RPF1 Alloy Wheels", price: "$1200", imageSrc: "/images/wheels_icon.webp", description: "Lightweight forged alloy wheels designed for performance and style. Available in multiple sizes and finishes. Perfect for track and street use." },
    "3": { name: "Bridgestone Blizzak WS90", price: "$200", imageSrc: "/images/snowTire_icon.webp", description: "The Bridgestone Blizzak WS90 provides exceptional winter traction with advanced tread compound technology for superior grip on snow and ice." },
    "4": { name: "OZ Racing Superturismo", price: "$1800", imageSrc: "/images/wheels_icon.webp", description: "Premium Italian alloy wheels combining classic design with modern performance and durability. Available in various sizes and finishes." },
    "5": { name: "Pirelli P Zero", price: "$290", imageSrc: "/images/tires_icon.webp", description: "The Pirelli P Zero is a high-performance tire, a benchmark for the ultra-high performance segment, characterized by an asymmetric tread pattern." },
    "6": { name: "Goodyear Eagle F1", price: "$240", imageSrc: "/images/tires_icon.webp", description: "Goodyear Eagle F1 Asymmetric 5 delivers outstanding wet and dry performance, offering superior braking and handling." },
    "7": { name: "Continental ExtremeContact", price: "$250", imageSrc: "/images/tires_icon.webp", description: "The Continental ExtremeContact Sport is a summer ultra-high performance tire for passenger cars, offering precise handling and maximum grip." },
    "8": { name: "Michelin X-Ice Snow", price: "$220", imageSrc: "/images/snowTire_icon.webp", description: "Michelin X-Ice Snow offers excellent winter performance with enhanced grip on snow and ice, plus improved tread life." },
    "9": { name: "Continental WinterContact SI", price: "$190", imageSrc: "/images/snowTire_icon.webp", description: "The Continental WinterContact SI delivers reliable winter traction and handling in cold weather conditions with excellent snow and ice grip." },
    "10": { name: "Nokian Hakkapeliitta R3", price: "$250", imageSrc: "/images/snowTire_icon.webp", description: "Nokian Hakkapeliitta R3 is a premium winter tire offering superior grip on snow and ice with excellent handling characteristics." },
    "11": { name: "BBS CH-R Alloy Wheels", price: "$2000", imageSrc: "/images/wheels_icon.webp", description: "High-quality German alloy wheels featuring a sporty design and excellent build quality. Perfect for luxury and performance vehicles." },
    "12": { name: "Rotiform RSE Alloy Wheels", price: "$1500", imageSrc: "/images/wheels_icon.webp", description: "Modern alloy wheels with a distinctive design, perfect for customizing your vehicle's appearance. Available in multiple finishes." },
    "13": { name: "Complete Tire & Wheel Package", price: "$1800", imageSrc: "/images/package_icon.webp", description: "Complete package including 4 tires and 4 alloy wheels, ready for installation. Perfect for upgrading your vehicle with a complete wheel and tire set." },
    "14": { name: "Michelin Pilot Sport Cup 2", price: "$350", imageSrc: "/images/tires_icon.webp", description: "Track-focused performance tire designed for maximum grip and precision handling on both road and track. Ideal for performance enthusiasts." },
    "15": { name: "Pirelli P Zero Trofeo R", price: "$380", imageSrc: "/images/tires_icon.webp", description: "Ultra-high performance tire optimized for track use with exceptional dry grip and handling capabilities. For serious track enthusiasts." },
    "16": { name: "Enkei RPF1 Alloy Wheels", price: "$1200", imageSrc: "/images/wheels_icon.webp", description: "Lightweight forged alloy wheels designed for performance and style. Available in multiple sizes and finishes." },
    "17": { name: "OZ Racing Superturismo", price: "$1800", imageSrc: "/images/wheels_icon.webp", description: "Premium Italian alloy wheels combining classic design with modern performance and durability." },
    "18": { name: "BBS CH-R Alloy Wheels", price: "$2000", imageSrc: "/images/wheels_icon.webp", description: "High-quality German alloy wheels featuring a sporty design and excellent build quality." },
    "19": { name: "Rotiform RSE Alloy Wheels", price: "$1500", imageSrc: "/images/wheels_icon.webp", description: "Modern alloy wheels with a distinctive design, perfect for customizing your vehicle's appearance." },
    "20": { name: "Steel Wheel Set (15 inch)", price: "$400", imageSrc: "/images/wheels_icon.webp", description: "Durable steel wheels perfect for winter use or as spare wheels. Built to last with excellent corrosion resistance." },
    "21": { name: "Steel Wheel Set (16 inch)", price: "$450", imageSrc: "/images/wheels_icon.webp", description: "Heavy-duty steel wheels offering reliability and affordability for everyday driving." },
    "22": { name: "Steel Wheel Set (17 inch)", price: "$500", imageSrc: "/images/wheels_icon.webp", description: "Larger steel wheels providing strength and durability for larger vehicles." },
    "23": { name: "Complete Tire & Wheel Package", price: "$1800", imageSrc: "/images/package_icon.webp", description: "Complete package including 4 tires and 4 alloy wheels, ready for installation. Perfect for upgrading your vehicle." },
    "24": { name: "Winter Tire Package", price: "$1200", imageSrc: "/images/snowPackages_icon.webp", description: "Complete winter tire package with steel wheels, ideal for seasonal tire changes." },
    "25": { name: "Performance Package", price: "$2800", imageSrc: "/images/package_icon.webp", description: "Premium performance package featuring high-performance tires and lightweight alloy wheels." },
    "26": { name: "Wheel Lug Nuts Set", price: "$50", imageSrc: "/images/wheels_icon.webp", description: "High-quality lug nuts for secure wheel mounting. Available in various finishes and thread sizes." },
    "27": { name: "Wheel Spacers", price: "$120", imageSrc: "/images/wheels_icon.webp", description: "Precision-machined wheel spacers to adjust wheel offset and improve vehicle stance." },
    "28": { name: "Wheel Center Caps", price: "$30", imageSrc: "/images/wheels_icon.webp", description: "Decorative center caps to complete your wheel's appearance. Available in multiple designs." },
    "29": { name: "Tire Pressure Monitoring System", price: "$150", imageSrc: "/images/tires_icon.webp", description: "Wireless TPMS system to monitor tire pressure in real-time for safety and fuel efficiency." },
    "30": { name: "Tire Valve Stems", price: "$25", imageSrc: "/images/tires_icon.webp", description: "High-quality valve stems for proper tire inflation and pressure maintenance." },
    "31": { name: "Tire Repair Kit", price: "$40", imageSrc: "/images/tires_icon.webp", description: "Complete tire repair kit for emergency flat tire repairs on the go." },
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
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="flex flex-col items-center bg-white dark:bg-background text-foreground py-8">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
          {product.name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-7xl mx-auto">
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
          <section className="bg-white dark:bg-card p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-baseline mb-4">
              <h2 className="text-3xl font-bold text-foreground">{product.name}</h2>
              <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">{product.price}</p>
            </div>
            <p className="text-base text-muted-foreground mb-8 leading-relaxed">
              {product.description}
            </p>

            <Button
              className="w-full py-3 text-lg font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300 shadow-lg flex items-center justify-center gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailScreen;