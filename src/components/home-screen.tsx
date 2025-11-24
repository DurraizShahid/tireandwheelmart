"use client";

import React from "react";
import { Search, Car, Wrench, Zap, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/product-card";
import MobileHeader from "@/components/mobile-header"; // Import MobileHeader

const HomeScreen = () => {
  // Placeholder for product images - you'll need to add these to your public/images directory
  const productImages = {
    tires: "/images/tires.png",
    brakes: "/images/brakes.png",
    suspension: "/images/suspension.png",
    engine: "/images/engine.png",
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background text-foreground flex flex-col items-center p-4 sm:p-6 md:p-8">
      {/* Header */}
      <MobileHeader
        title="AutoLux"
        rightAction={
          <Button variant="ghost" size="icon" className="text-primary dark:text-primary-foreground">
            <Search className="h-6 w-6" />
          </Button>
        }
      />

      {/* Search Bar with Glassmorphism Effect */}
      <div className="w-full max-w-md relative mb-8">
        <Input
          type="text"
          placeholder="Search for parts, accessories..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {/* Categories/Featured Products Grid */}
      <section className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-6">
        <ProductCard
          title="Tires & Wheels"
          description="Performance and style"
          icon={Car}
          imageSrc={productImages.tires}
          accentColor="bg-blue-600"
          href="/category/tires" // Added href
        />
        <ProductCard
          title="Brake Systems"
          description="Superior stopping power"
          icon={Wrench}
          imageSrc={productImages.brakes}
          accentColor="bg-red-600"
          href="/category/brakes" // Added href
        />
        <ProductCard
          title="Suspension Kits"
          description="Enhance handling"
          icon={Zap}
          imageSrc={productImages.suspension}
          accentColor="bg-green-600"
          href="/category/suspension" // Added href
        />
        <ProductCard
          title="Engine Components"
          description="Unleash true power"
          icon={Package}
          imageSrc={productImages.engine}
          accentColor="bg-purple-600"
          href="/category/engine" // Added href
        />
      </section>
    </div>
  );
};

export default HomeScreen;