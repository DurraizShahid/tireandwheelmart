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

  // Dummy product data for demonstration
  const allProducts = {
    "1": { name: "Michelin Pilot Sport 4S", price: "$250", imageSrc: "/images/tire1.png", description: "Experience exceptional grip and precision handling with the Michelin Pilot Sport 4S. Designed for ultimate performance on both road and track." },
    "2": { name: "Pirelli P Zero", price: "$280", imageSrc: "/images/tire2.png", description: "The Pirelli P Zero is a high-performance tire, a benchmark for the ultra-high performance segment, characterized by an asymmetric tread pattern." },
    "3": { name: "Goodyear Eagle F1", price: "$220", imageSrc: "/images/tire3.png", description: "Goodyear Eagle F1 Asymmetric 5 delivers outstanding wet and dry performance, offering superior braking and handling." },
    "4": { name: "Continental ExtremeContact", price: "$230", imageSrc: "/images/tire4.png", description: "The Continental ExtremeContact Sport is a summer ultra-high performance tire for passenger cars, offering precise handling and maximum grip." },
    "5": { name: "Brembo GT Kit", price: "$2500", imageSrc: "/images/brake1.png", description: "Upgrade to the Brembo GT Kit for unparalleled stopping power and track-ready performance. Includes calipers, rotors, and pads." },
    "6": { name: "StopTech Sport Kit", price: "$1800", imageSrc: "/images/brake2.png", description: "The StopTech Sport Kit offers improved braking performance for street and occasional track use, featuring slotted rotors and performance pads." },
    "7": { name: "EBC Yellowstuff Pads", price: "$150", imageSrc: "/images/brake3.png", description: "EBC Yellowstuff pads are high-performance street and track day brake pads, offering excellent bite from cold and fade resistance." },
    "8": { name: "Ohlins Road & Track Coilovers", price: "$3200", imageSrc: "/images/suspension1.png", description: "Ohlins Road & Track Coilovers provide superior handling and comfort, allowing for precise adjustments for both street and track driving." },
    "9": { name: "KW V3 Coilovers", price: "$2800", imageSrc: "/images/suspension2.png", description: "KW V3 Coilovers are state-of-the-art suspension systems, independently adjustable in compression and rebound damping for personalized driving dynamics." },
    "10": { name: "Bilstein B16 PSS10", price: "$2000", imageSrc: "/images/suspension3.png", description: "The Bilstein B16 PSS10 coilover kit offers 10-stage damping adjustment and ride height adjustment for optimal performance and comfort." },
    "11": { name: "APR Stage 1 ECU Tune", price: "$700", imageSrc: "/images/engine1.png", description: "Unlock hidden power with the APR Stage 1 ECU Tune, providing significant gains in horsepower and torque without additional hardware." },
    "12": { name: "K&N Cold Air Intake", price: "$350", imageSrc: "/images/engine2.png", description: "Improve engine performance and sound with the K&N Cold Air Intake system, designed for increased airflow and filtration." },
    "13": { name: "Akrapovic Exhaust System", price: "$4000", imageSrc: "/images/engine3.png", description: "Experience a thrilling exhaust note and weight reduction with the Akrapovic Exhaust System, crafted from premium materials for ultimate performance." },
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
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-primary dark:text-primary-foreground mb-8 text-center">
          {product.name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
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
              <h2 className="text-3xl font-bold text-primary dark:text-primary-foreground">{product.name}</h2>
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