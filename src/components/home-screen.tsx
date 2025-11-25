"use client";

import React from "react";
import { Car, Circle, Package, Truck, ShieldCheck, Headset, Snowflake, Sun } from "lucide-react";
import ProductCard from "@/components/product-card";
import ProductItem from "@/components/product-item";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import TestimonialCard from "@/components/testimonial-card";
import CategoryGridCard from "@/components/category-grid-card";

const HomeScreen = () => {
  // Product images for wheel and tire categories
  const productImages = {
    tires: "/images/tires_icon.webp",
    wheels: "/images/wheels_icon.webp",
    packages: "/images/package_icon.webp",
    snowTires: "/images/snowTire_icon.webp",
  };

  // Dummy data for featured products (wheels and tires only)
  const featuredProducts = [
    { id: "1", name: "Michelin Pilot Sport 4S", price: "$250", imageSrc: "/images/tires_icon.webp", href: "/product/1" },
    { id: "2", name: "Enkei RPF1 Alloy Wheels", price: "$1200", imageSrc: "/images/wheels_icon.webp", href: "/product/2" },
    { id: "3", name: "Bridgestone Blizzak Winter Tire", price: "$280", imageSrc: "/images/snowTire_icon.webp", href: "/product/3" },
    { id: "4", name: "OZ Racing Superturismo Wheels", price: "$1800", imageSrc: "/images/wheels_icon.webp", href: "/product/4" },
  ];

  // Dummy data for featured tires
  const featuredTires = [
    { id: "1", name: "Michelin Pilot Sport 4S", price: "$250", imageSrc: "/images/tires_icon.webp", href: "/product/1" },
    { id: "5", name: "Pirelli P Zero", price: "$280", imageSrc: "/images/tires_icon.webp", href: "/product/5" },
    { id: "6", name: "Goodyear Eagle F1", price: "$220", imageSrc: "/images/tires_icon.webp", href: "/product/6" },
    { id: "7", name: "Continental ExtremeContact", price: "$230", imageSrc: "/images/tires_icon.webp", href: "/product/7" },
  ];

  // Updated categories - only wheel and tire related
  const featuredCategories = [
    {
      title: "All-Season Tires",
      imageSrc: "/categories/allseason.png",
      description: "Year-round performance for all weather conditions. Perfect for daily driving.",
      href: "/category/all-season-tires",
    },
    {
      title: "Summer Tires",
      imageSrc: "/categories/summertires.png",
      description: "Superior dry and wet traction for warm weather. Maximum performance in summer.",
      href: "/category/summer-tires",
    },
    {
      title: "Winter Tires",
      imageSrc: "/categories/wintertires.png",
      description: "Advanced grip on snow and ice. Essential for safe winter driving.",
      href: "/category/winter-tires",
    },
    {
      title: "Performance Tires",
      imageSrc: "/categories/performancetires.png",
      description: "Track-ready tires for maximum grip and precision handling on road and track.",
      href: "/category/performance-tires",
    },
    {
      title: "Alloy Wheels",
      imageSrc: "/categories/alloywheels.webp",
      description: "Lightweight and stylish alloy wheels. Enhance performance and appearance.",
      href: "/category/alloy-wheels",
    },
    {
      title: "Steel Wheels",
      imageSrc: "/categories/steelwheels.png",
      description: "Durable and affordable steel wheels. Perfect for winter use and reliability.",
      href: "/category/steel-wheels",
    },
    {
      title: "Tire & Wheel Packages",
      imageSrc: "/categories/tireandwheel.png",
      description: "Complete sets ready for installation. Save with bundled tire and wheel packages.",
      href: "/category/packages",
    },
    {
      title: "Wheel Accessories",
      imageSrc: "/categories/wheelaccessories.png",
      description: "Lug nuts, spacers, center caps, and more. Complete your wheel setup.",
      href: "/category/wheel-accessories",
    },
    {
      title: "Tire Accessories",
      imageSrc: "/categories/tireaccessories.png",
      description: "TPMS sensors, valve stems, and repair kits. Essential tire maintenance items.",
      href: "/category/tire-accessories",
    },
  ];

  // Dummy data for testimonials (updated for tire shop)
  const testimonials = [
    {
      quote: "The best tire shop online! Found the perfect set of winter tires for my SUV. Fast shipping and excellent quality. My car handles like a dream now.",
      author: "Alex Johnson",
      title: "Satisfied Customer",
      avatarSrc: "https://api.dicebear.com/7.x/initials/svg?seed=AJ",
      rating: 5,
    },
    {
      quote: "I needed new wheels for my sports car and found exactly what I was looking for. The product description was accurate, and delivery was quick. Highly recommend!",
      author: "Maria Rodriguez",
      title: "Car Enthusiast",
      avatarSrc: "https://api.dicebear.com/7.x/initials/svg?seed=MR",
      rating: 5,
    },
    {
      quote: "Fantastic customer service! They helped me choose the right tire package for my vehicle. The installation was smooth and the tires perform excellently!",
      author: "David Lee",
      title: "Happy Customer",
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
            Your Ultimate Destination for Wheels & Tires
          </h1>
          <p className="text-lg md:text-xl mb-8 drop-shadow-md">
            Explore a wide range of high-quality tires, wheels, and wheel accessories for every vehicle and season.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/category/all-season-tires"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors duration-300 shadow-lg"
            >
              Shop Now
            </Link>
            <Link
              href="/track-order"
              className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:text-primary transition-colors duration-300 shadow-lg"
            >
              Track Order
            </Link>
          </div>
        </div>
      </section>

      {/* Main Categories Grid */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          <ProductCard
            title="All-Season Tires"
            description="Year-round performance"
            icon={Car}
            imageSrc={productImages.tires}
            accentColor="bg-blue-600"
            href="/category/all-season-tires"
          />
          <ProductCard
            title="Alloy Wheels"
            description="Style and durability"
            icon={Circle}
            imageSrc={productImages.wheels}
            accentColor="bg-red-600"
            href="/category/alloy-wheels"
          />
          <ProductCard
            title="Winter Tires"
            description="Superior grip in snow"
            icon={Snowflake}
            imageSrc={productImages.snowTires}
            accentColor="bg-green-600"
            href="/category/winter-tires"
          />
          <ProductCard
            title="Tire Packages"
            description="Complete wheel sets"
            icon={Package}
            imageSrc={productImages.packages}
            accentColor="bg-purple-600"
            href="/category/packages"
          />
        </div>
      </section>

      {/* Remade Featured Categories Section */}
      <section className="w-full bg-white dark:bg-background py-16">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center sm:text-left">
              Category Selection
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> {/* 3x3 grid */}
            {featuredCategories.map((category, index) => (
              <CategoryGridCard
                key={index}
                title={category.title}
                href={category.href}
                imageSrc={category.imageSrc}
                description={category.description}
                backgroundColor={category.backgroundColor}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="w-full py-16">
        <div className="px-4 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground mb-10">
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
          <Link href="/category/all-season-tires" className="mt-12 inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors duration-300 shadow-lg">
            View All Products
          </Link>
        </div>
      </section>

      {/* Featured Tires Section */}
      <section className="w-full bg-gray-50 dark:bg-gray-900 py-16">
        <div className="px-4 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground mb-10">
            Featured Tires
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredTires.map((tire) => (
              <ProductItem
                key={tire.id}
                name={tire.name}
                price={tire.price}
                imageSrc={tire.imageSrc}
                href={tire.href}
              />
            ))}
          </div>
          <Link href="/category/all-season-tires" className="mt-12 inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors duration-300 shadow-lg">
            View All Tires
          </Link>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="w-full py-16">
        <div className="px-4 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground mb-10">
            Why Choose Tire&Wheel?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 flex flex-col items-center text-center shadow-lg border-none bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
              <CardContent className="p-0 flex flex-col items-center">
                <Truck className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Fast & Reliable Shipping</h3>
                <p className="text-muted-foreground">Get your wheels and tires delivered quickly and safely to your doorstep.</p>
              </CardContent>
            </Card>
            <Card className="p-6 flex flex-col items-center text-center shadow-lg border-none bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
              <CardContent className="p-0 flex flex-col items-center">
                <ShieldCheck className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Quality Guaranteed</h3>
                <p className="text-muted-foreground">We source only the best wheels and tires from trusted manufacturers.</p>
              </CardContent>
            </Card>
            <Card className="p-6 flex flex-col items-center text-center shadow-lg border-none bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
              <CardContent className="p-0 flex flex-col items-center">
                <Headset className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">24/7 Customer Support</h3>
                <p className="text-muted-foreground">Our dedicated team is always here to help you with any queries.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What Our Customers Say Section */}
      <section className="w-full bg-gray-50 dark:bg-gray-900 py-16">
        <div className="px-4 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground mb-10">
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