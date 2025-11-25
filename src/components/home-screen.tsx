"use client";

import React from "react";
import { Car, Circle, Package, Truck, ShieldCheck, Headset, Snowflake, Sun } from "lucide-react";
import ProductCard from "@/components/product-card";
import ProductItem from "@/components/product-item";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import TestimonialCard from "@/components/testimonial-card";
import CategoryGridCard from "@/components/category-grid-card";
import BrandCard from "@/components/brand-card";
import HeaderSlideshow from "@/components/header-slideshow";
import ProductCarousel from "@/components/product-carousel";

const HomeScreen = () => {
  // Product images for wheel and tire categories
  const productImages = {
    tires: "/images/tires_icon.webp",
    wheels: "/images/wheels_icon.webp",
    packages: "/images/package_icon.webp",
    snowTires: "/images/snowTire_icon.webp",
  };

  // Featured products from all-season-tires category
  const featuredProducts = [
    {
      id: "1",
      name: "Michelin CrossClimate2",
      price: "$250",
      imageSrc: "/tires/Michelin CrossClimate2/mi_crossclimate2_suv_full.webp",
      href: "/product/1",
      specs: {
        size: "225/45R17",
        loadSpeed: "94V",
        season: "All-Season" as const,
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
      href: "/product/2",
      specs: {
        size: "205/55R16",
        loadSpeed: "91H",
        season: "All-Season" as const,
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
      imageSrc: "/tires/Goodyear Eagle F1/images.jpg",
      href: "/product/3",
      specs: {
        size: "215/60R16",
        loadSpeed: "95H",
        season: "All-Season" as const,
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
      href: "/product/4",
      specs: {
        size: "235/50R18",
        loadSpeed: "97V",
        season: "All-Season" as const,
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
  ];

  // Featured tires from summer-tires category
  const featuredTires = [
    {
      id: "5",
      name: "Michelin Pilot Sport Cup 2",
      price: "$280",
      imageSrc: "/tires/Michelin Pilot Sport Cup 2/4w-368_3528703112235_tire_michelin_pilot-sport-cup-2-r_325-slash-30-zr21-108y-xl_n0_a_main_5-quarterzoom_nopad.webp",
      href: "/product/5",
      specs: {
        size: "245/40R19",
        loadSpeed: "98Y",
        season: "Summer" as const,
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
      href: "/product/6",
      specs: {
        size: "255/35R19",
        loadSpeed: "96Y",
        season: "Summer" as const,
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
      imageSrc: "/tires/Goodyear Eagle F1/images.jpg",
      href: "/product/7",
      specs: {
        size: "225/40R18",
        loadSpeed: "92Y",
        season: "Summer" as const,
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
      href: "/product/8",
      specs: {
        size: "235/40R18",
        loadSpeed: "95Y",
        season: "Summer" as const,
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

  // Dummy data for tire brands
  const brands = [
    {
      name: "Michelin",
      imageSrc: "/brands/logo_michelin.png",
      href: "/category/michelin",
    },
    {
      name: "Bridgestone",
      imageSrc: "/brands/logo_bridgestone.png",
      href: "/category/bridgestone",
    },
    {
      name: "Continental",
      imageSrc: "/brands/logo_continental.png",
      href: "/category/continental",
    },
    {
      name: "Toyo",
      imageSrc: "/brands/logo_toyo.png",
      href: "/category/toyo",
    },
    {
      name: "Cooper",
      imageSrc: "/brands/logo_cooper.png",
      href: "/category/cooper",
    },
    {
      name: "Firestone",
      imageSrc: "/brands/logo_firestone.png",
      href: "/category/firestone",
    },
    {
      name: "Hercules",
      imageSrc: "/brands/logo_hercules.png",
      href: "/category/hercules",
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
      {/* Hero Section - Slideshow */}
      <HeaderSlideshow
        slides={[
          "/header/pexels-gustavo-fring-6870311.jpg",
          "/header/pexels-olly-3806249.jpg",
          "/header/pexels-olly-3806252.jpg",
          "/header/pexels-olly-3807386.jpg",
          "/header/pexels-tima-miroshnichenko-5640626.jpg",
        ]}
      />

      {/* Main Categories Grid - Horizontal Scroll */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <div className="max-w-7xl mx-auto w-full" >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8">Featured Categories</h2>
          <ProductCarousel autoScrollSpeed={2000}>
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
          </ProductCarousel>
        </div>
      </section>

      {/* Remade Featured Categories Section */}
      <section className="w-full bg-white dark:bg-background py-16">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center sm:text-left">
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
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="w-full py-16">
        <div className="px-4 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-10">
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
                specs={product.specs}
                rating={product.rating}
                reviews={product.reviews}
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-10">
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
                specs={tire.specs}
                rating={tire.rating}
                reviews={tire.reviews}
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-10">
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

      {/* Explore via Brands Section */}
      <section className="w-full bg-gray-50 dark:bg-gray-900 py-16">
        <div className="px-4 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore via Brands
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            Shop from the most trusted tire and wheel brands in the industry
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {brands.map((brand, index) => (
              <BrandCard
                key={index}
                name={brand.name}
                imageSrc={brand.imageSrc}
                href={brand.href}
              />
            ))}
          </div>
        </div>
      </section>

      {/* What Our Customers Say Section */}
      <section className="w-full bg-gray-50 dark:bg-gray-900 py-16">
        <div className="px-4 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-10">
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