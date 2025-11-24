"use client";

import React from "react";
import { Car, Wrench, Zap, Package } from "lucide-react";
import ProductCard from "@/components/product-card";

const HomeScreen = () => {
  // Placeholder for product images - you'll need to add these to your public/images directory
  const productImages = {
    tires: "/images/tires.png",
    brakes: "/images/brakes.png",
    suspension: "/images/suspension.png",
    engine: "/images/engine.png",
  };

  return (
    <div className="flex flex-col items-center bg-white dark:bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-cover bg-center flex items-center justify-center text-center p-4"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }} // Placeholder image
      >
        <div className="absolute inset-0 bg-black/50"></div> {/* Overlay */}
        <div className="relative z-10 max-w-3xl text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-lg">
            Your Ultimate Destination for Car Parts
          </h1>
          <p className="text-lg md:text-xl mb-8 drop-shadow-md">
            Explore a wide range of high-quality tires, brakes, suspension, and engine components.
          </p>
          <a
            href="/category/tires" // Link to a default category or shop page
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300 shadow-lg"
          >
            Shop Now
          </a>
        </div>
      </section>

      {/* Categories/Featured Products Grid */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          title="Tires & Wheels"
          description="Performance and style"
          icon={Car}
          imageSrc={productImages.tires}
          accentColor="bg-blue-600"
          href="/category/tires"
        />
        <ProductCard
          title="Brake Systems"
          description="Superior stopping power"
          icon={Wrench}
          imageSrc={productImages.brakes}
          accentColor="bg-red-600"
          href="/category/brakes"
        />
        <ProductCard
          title="Suspension Kits"
          description="Enhance handling"
          icon={Zap}
          imageSrc={productImages.suspension}
          accentColor="bg-green-600"
          href="/category/suspension"
        />
        <ProductCard
          title="Engine Components"
          description="Unleash true power"
          icon={Package}
          imageSrc={productImages.engine}
          accentColor="bg-purple-600"
          href="/category/engine"
        />
      </section>
    </div>
  );
};

export default HomeScreen;