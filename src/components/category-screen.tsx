"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductItem from "@/components/product-item";

interface CategoryScreenProps {
  categorySlug: string;
}

const CategoryScreen = ({ categorySlug }: CategoryScreenProps) => {
  const router = useRouter();

  // Dummy data for demonstration
  const products = {
    tires: [
      { id: "1", name: "Michelin Pilot Sport 4S", price: "$250", imageSrc: "/images/tire1.png", description: "Experience exceptional grip and precision handling with the Michelin Pilot Sport 4S. Designed for ultimate performance on both road and track." },
      { id: "2", name: "Pirelli P Zero", price: "$280", imageSrc: "/images/tire2.png", description: "The Pirelli P Zero is a high-performance tire, a benchmark for the ultra-high performance segment, characterized by an asymmetric tread pattern." },
      { id: "3", name: "Goodyear Eagle F1", price: "$220", imageSrc: "/images/tire3.png", description: "Goodyear Eagle F1 Asymmetric 5 delivers outstanding wet and dry performance, offering superior braking and handling." },
      { id: "4", name: "Continental ExtremeContact", price: "$230", imageSrc: "/images/tire4.png", description: "The Continental ExtremeContact Sport is a summer ultra-high performance tire for passenger cars, offering precise handling and maximum grip." },
    ],
    brakes: [
      { id: "5", name: "Brembo GT Kit", price: "$2500", imageSrc: "/images/brake1.png", description: "Upgrade to the Brembo GT Kit for unparalleled stopping power and track-ready performance. Includes calipers, rotors, and pads." },
      { id: "6", name: "StopTech Sport Kit", price: "$1800", imageSrc: "/images/brake2.png", description: "The StopTech Sport Kit offers improved braking performance for street and occasional track use, featuring slotted rotors and performance pads." },
      { id: "7", name: "EBC Yellowstuff Pads", price: "$150", imageSrc: "/images/brake3.png", description: "EBC Yellowstuff pads are high-performance street and track day brake pads, offering excellent bite from cold and fade resistance." },
    ],
    suspension: [
      { id: "8", name: "Ohlins Road & Track Coilovers", price: "$3200", imageSrc: "/images/suspension1.png", description: "Ohlins Road & Track Coilovers provide superior handling and comfort, allowing for precise adjustments for both street and track driving." },
      { id: "9", name: "KW V3 Coilovers", price: "$2800", imageSrc: "/images/suspension2.png", description: "KW V3 Coilovers are state-of-the-art suspension systems, independently adjustable in compression and rebound damping for personalized driving dynamics." },
      { id: "10", name: "Bilstein B16 PSS10", price: "$2000", imageSrc: "/images/suspension3.png", description: "The Bilstein B16 PSS10 coilover kit offers 10-stage damping adjustment and ride height adjustment for optimal performance and comfort." },
    ],
    engine: [
      { id: "11", name: "APR Stage 1 ECU Tune", price: "$700", imageSrc: "/images/engine1.png", description: "Unlock hidden power with the APR Stage 1 ECU Tune, providing significant gains in horsepower and torque without additional hardware." },
      { id: "12", name: "K&N Cold Air Intake", price: "$350", imageSrc: "/images/engine2.png", description: "Improve engine performance and sound with the K&N Cold Air Intake system, designed for increased airflow and filtration." },
      { id: "13", name: "Akrapovic Exhaust System", price: "$4000", imageSrc: "/images/engine3.png", description: "Experience a thrilling exhaust note and weight reduction with the Akrapovic Exhaust System, crafted from premium materials for ultimate performance." },
    ],
  };

  const categoryTitleMap: { [key: string]: string } = {
    tires: "Tires & Wheels",
    brakes: "Brake Systems",
    suspension: "Suspension Kits",
    engine: "Engine Components",
  };

  const currentCategoryProducts = products[categorySlug as keyof typeof products] || [];
  const currentCategoryTitle = categoryTitleMap[categorySlug] || "Category";

  return (
    <div className="min-h-screen bg-white dark:bg-background text-foreground flex flex-col items-center p-4 sm:p-6 md:p-8">
      {/* Header */}
      <header className="w-full max-w-md flex items-center justify-between py-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-primary dark:text-primary-foreground">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold text-primary dark:text-primary-foreground">{currentCategoryTitle}</h1>
        <Button variant="ghost" size="icon" className="text-primary dark:text-primary-foreground">
          <Search className="h-6 w-6" />
        </Button>
      </header>

      {/* Search Bar with Glassmorphism Effect */}
      <div className="w-full max-w-md relative mb-8">
        <Input
          type="text"
          placeholder={`Search in ${currentCategoryTitle}...`}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {/* Product Grid */}
      <section className="w-full max-w-md grid grid-cols-2 gap-4">
        {currentCategoryProducts.map((product) => (
          <ProductItem
            key={product.id}
            name={product.name}
            price={product.price}
            imageSrc={product.imageSrc}
            href={`/product/${product.id}`} // Link to product detail page
            // You can add specific accent colors here if needed
          />
        ))}
      </section>
    </div>
  );
};

export default CategoryScreen;