"use client";

import React from "react";
import { Car, Wrench, Zap, Package, Truck, ShieldCheck, Headset } from "lucide-react";
import ProductCard from "@/components/product-card";
import ProductItem from "@/components/product-item";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import TestimonialCard from "@/components/testimonial-card"; // Import the new TestimonialCard

const HomeScreen = () => {
  // Placeholder for product images - you'll need to add these to your public/images directory
  const productImages = {
    tires: "/images/tires.png",
    brakes: "/images/brakes.png",
    suspension: "/images/suspension.png",
    engine: "/images/engine.png",
  };

  // Dummy data for featured products
  const featuredProducts = [
    { id: "1", name: "Michelin Pilot Sport 4S", price: "$250", imageSrc: "/images/tire1.png", href: "/product/1" },
    { id: "5", name: "Brembo GT Kit", price: "$2500", imageSrc: "/images/brake1.png", href: "/product/5" },
    { id: "8", name: "Ohlins Road & Track Coilovers", price: "$3200", imageSrc: "/images/suspension1.png", href: "/product/8" },
    { id: "11", name: "APR Stage 1 ECU Tune", price: "$700", imageSrc: "/images/engine1.png", href: "/product/11" },
  ];

  // Dummy data for testimonials
  const testimonials = [
    {
      quote: "The best place to buy car parts online! Fast shipping and excellent quality. My car feels brand new.",
      author: "Alex Johnson",
      title: "Performance Enthusiast",
      avatarSrc: "https://api.dicebear.com/7.x/initials/svg?seed=AJ",
      rating: 5,
    },
    {
      quote: "I found exactly what I needed for my brake upgrade. The product description was accurate, and delivery was quick.",
      author: "Maria Rodriguez",
      title: "DIY Mechanic",
      avatarSrc: "https://api.dicebear.com/7.x/initials/svg?seed=MR",
      rating: 4,
    },
    {
      quote: "Fantastic customer service! They helped me choose the right suspension kit for my vehicle. Highly recommend!",
      author: "David Lee",
      title: "Car Tuner",
      avatarSrc: "https://api.dicebear.com/7.x/initials/svg?seed=DL",
      rating: 5,
    },
  ];

  return (
    <div className="flex flex-col items-center bg-white dark:bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-cover bg-center flex items-center justify-center text-center p-4"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 max-w-3xl text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-lg">
            Your Ultimate Destination for Car Parts
          </h1>
          <p className="text-lg md:text-xl mb-8 drop-shadow-md">
            Explore a wide range of high-quality tires, brakes, suspension, and engine components.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/category/tires"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300 shadow-lg"
            >
              Shop Now
            </Link>
            <Link
              href="/track-order"
              className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:text-blue-600 transition-colors duration-300 shadow-lg"
            >
              Track Order
            </Link>
          </div>
        </div>
      </section>

      {/* Categories/Featured Products Grid */}
      <section className="container px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Featured Products Section */}
      <section className="w-full bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-primary dark:text-primary-foreground mb-10">
            Our Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductItem
                key={product.id}
                name={product.name}
                price={product.price}
                imageSrc={product.imageSrc}
                href={product.href}
              />
            ))}
          </div>
          <Link href="/category/tires" className="mt-12 inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300 shadow-lg">
            View All Products
          </Link>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="w-full py-16">
        <div className="container px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-primary dark:text-primary-foreground mb-10">
            Why Choose Tire&Wheel?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 flex flex-col items-center text-center shadow-lg border-none bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
              <CardContent className="p-0 flex flex-col items-center">
                <Truck className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-primary dark:text-primary-foreground mb-2">Fast & Reliable Shipping</h3>
                <p className="text-muted-foreground">Get your parts delivered quickly and safely to your doorstep.</p>
              </CardContent>
            </Card>
            <Card className="p-6 flex flex-col items-center text-center shadow-lg border-none bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
              <CardContent className="p-0 flex flex-col items-center">
                <ShieldCheck className="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
                <h3 className="text-xl font-semibold text-primary dark:text-primary-foreground mb-2">Quality Guaranteed</h3>
                <p className="text-muted-foreground">We source only the best products from trusted manufacturers.</p>
              </CardContent>
            </Card>
            <Card className="p-6 flex flex-col items-center text-center shadow-lg border-none bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
              <CardContent className="p-0 flex flex-col items-center">
                <Headset className="h-12 w-12 text-purple-600 dark:text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-primary dark:text-primary-foreground mb-2">24/7 Customer Support</h3>
                <p className="text-muted-foreground">Our dedicated team is always here to help you with any queries.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What Our Customers Say Section */}
      <section className="w-full bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-primary dark:text-primary-foreground mb-10">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                quote={testimonial.quote}
                author={testimonial.author}
                title={testimonial.title}
                avatarSrc={testimonial.avatarSrc}
                rating={testimonial.rating}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;