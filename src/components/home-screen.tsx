"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Car, 
  Circle, 
  Package, 
  Truck, 
  ShieldCheck, 
  Headset, 
  Snowflake, 
  Sun,
  TrendingUp,
  Wrench,
  MapPin,
  Users
} from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import ProductCard from "@/components/product-card";
import ProductItem from "@/components/product-item";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import TestimonialCard from "@/components/testimonial-card";
import CategoryGridCard from "@/components/category-grid-card";
import BrandCard from "@/components/brand-card";
import HeaderSlideshow from "@/components/header-slideshow";
import ProductCarousel from "@/components/product-carousel";

const CountUp = ({ end, duration = 2000, suffix = "" }: { end: number | string; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      if (typeof end === 'number') {
        setCount(Math.floor(progress * end));
      } else {
        // For strings like "Top 500" or "6M+", we just display them as-is
        setCount(0); // This will be overridden in the render
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [isVisible, end, duration]);

  // If end is a string, just display it
  if (typeof end === 'string') {
    return <div ref={elementRef}>{end}{suffix}</div>;
  }

  return <div ref={elementRef}>{count.toLocaleString()}{suffix}</div>;
};

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
    <div className="flex flex-col items-center bg-white text-foreground">
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
      <section className="w-full bg-white py-16">
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
      <section className="w-full bg-gray-50 py-16">
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
            <Card className="p-6 flex flex-col items-center text-center shadow-lg border-none bg-gradient-to-br from-gray-50 to-gray-100">
              <CardContent className="p-0 flex flex-col items-center">
                <Truck className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Fast & Reliable Shipping</h3>
                <p className="text-muted-foreground">Get your wheels and tires delivered quickly and safely to your doorstep.</p>
              </CardContent>
            </Card>
            <Card className="p-6 flex flex-col items-center text-center shadow-lg border-none bg-gradient-to-br from-gray-50 to-gray-100">
              <CardContent className="p-0 flex flex-col items-center">
                <ShieldCheck className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Quality Guaranteed</h3>
                <p className="text-muted-foreground">We source only the best wheels and tires from trusted manufacturers.</p>
              </CardContent>
            </Card>
            <Card className="p-6 flex flex-col items-center text-center shadow-lg border-none bg-gradient-to-br from-gray-50 to-gray-100">
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
      <section className="w-full bg-gray-50 py-16">
        <div className="px-4 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            BEST PRICE GUARANTEE ON ALL BRANDS
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
      <section className="w-full bg-gray-50 py-16">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-left mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              <span className="font-light text-black">Customers love Us.</span>
            </h2>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              <span className="font-bold text-red-600">Discover why.</span>
            </h2>
            <div className="flex items-center mt-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : (i === 4 && 0.8 >= 0.5 ? 'text-yellow-400' : 'text-gray-300')}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-lg font-semibold text-foreground">4.8</span>
            </div>
            <div className="flex items-center mt-2">
              <svg className="w-4 h-4 text-blue-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-muted-foreground">Rated by 160,900+ verified customers</span>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="w-full md:w-2/3 lg:w-1/2">
              <Marquee vertical pauseOnHover repeat={3} className="h-[500px]">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="mb-8 last:mb-0">
                    <TestimonialCard
                      quote={testimonial.quote}
                      author={testimonial.author}
                      title={testimonial.title}
                      avatarSrc={testimonial.avatarSrc}
                      rating={testimonial.rating}
                    />
                  </div>
                ))}
              </Marquee>
            </div>
          </div>
        </div>
      </section>

      {/* Shop with Confidence Section */}
      <section className="w-full py-16 bg-white">
        <div className="px-0 sm:px-0 lg:px-0 max-w-full mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
            Shop with confidence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 px-4 sm:px-6 lg:px-8">
            <div className="text-left border-r border-gray-200 pr-8 lg:last:border-r-0">
              <div className="flex items-center mb-3">
                <ShieldCheck className="h-6 w-6 text-red-600 mr-2 flex-shrink-0" />
                <div className="text-3xl md:text-4xl font-bold text-red-600">
                  <CountUp end={98} suffix="%" />
                </div>
              </div>
              <p className="text-muted-foreground">of customers approve</p>
            </div>
            <div className="text-left border-r border-gray-200 pr-8 lg:last:border-r-0">
              <div className="flex items-center mb-3">
                <TrendingUp className="h-6 w-6 text-red-600 mr-2 flex-shrink-0" />
                <div className="text-3xl md:text-4xl font-bold text-red-600">
                  <CountUp end="Top 500" />
                </div>
              </div>
              <p className="text-muted-foreground">fastest growing company in US</p>
            </div>
            <div className="text-left border-r border-gray-200 pr-8 lg:last:border-r-0">
              <div className="flex items-center mb-3">
                <Wrench className="h-6 w-6 text-red-600 mr-2 flex-shrink-0" />
                <div className="text-3xl md:text-4xl font-bold text-red-600">
                  <CountUp end={20000} suffix="+" />
                </div>
              </div>
              <p className="text-muted-foreground">certified installers</p>
            </div>
            <div className="text-left border-r border-gray-200 pr-8 lg:last:border-r-0">
              <div className="flex items-center mb-3">
                <MapPin className="h-6 w-6 text-red-600 mr-2 flex-shrink-0" />
                <div className="text-3xl md:text-4xl font-bold text-red-600">
                  <CountUp end={7000} suffix="+" />
                </div>
              </div>
              <p className="text-muted-foreground">local distributors</p>
            </div>
            <div className="text-left">
              <div className="flex items-center mb-3">
                <Users className="h-6 w-6 text-red-600 mr-2 flex-shrink-0" />
                <div className="text-3xl md:text-4xl font-bold text-red-600">
                  <CountUp end={6000000} suffix="+" />
                </div>
              </div>
              <p className="text-muted-foreground">customers served</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;