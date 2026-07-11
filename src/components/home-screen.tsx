"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
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
  Users,
} from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import ProductCard from "@/components/product-card";
import ProductItem from "@/components/product-item";
import { Card, CardContent } from "@/components/ui/card";
import TestimonialCard from "@/components/testimonial-card";
import CategoryGridCard from "@/components/category-grid-card";
import BrandCard from "@/components/brand-card";
import HeaderSlideshow from "@/components/header-slideshow";
import ProductCarousel from "@/components/product-carousel";

interface DbProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  brand: string | null;
  description: string | null;
  specs: Record<string, unknown>;
  featured: boolean;
}

interface HomeScreenProps {
  featuredProducts?: DbProduct[];
  summerTires?: DbProduct[];
}

const CountUp = ({
  end,
  duration = 2000,
  suffix = "",
}: {
  end: number | string;
  duration?: number;
  suffix?: string;
}) => {
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
    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      if (typeof end === "number") setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [isVisible, end, duration]);

  if (typeof end === "string") {
    return (
      <div ref={elementRef}>
        {end}
        {suffix}
      </div>
    );
  }
  return (
    <div ref={elementRef}>
      {count.toLocaleString()}
      {suffix}
    </div>
  );
};

const HomeScreen = ({ featuredProducts = [], summerTires = [] }: HomeScreenProps) => {
  const productImages = {
    tires: "/images/tires_icon.webp",
    wheels: "/images/wheels_icon.webp",
    packages: "/images/package_icon.webp",
    snowTires: "/images/snowTire_icon.webp",
  };

  const featuredCategories = [
    {
      title: "All-Season Tires",
      imageSrc: "/categories/allseason.png",
      description: "Year-round performance for all weather conditions.",
      href: "/category/all-season",
    },
    {
      title: "Summer Tires",
      imageSrc: "/categories/summertires.png",
      description: "Superior dry and wet traction for warm weather.",
      href: "/category/summer",
    },
    {
      title: "Winter Tires",
      imageSrc: "/categories/wintertires.png",
      description: "Advanced grip on snow and ice.",
      href: "/category/winter",
    },
    {
      title: "Performance Tires",
      imageSrc: "/categories/performancetires.png",
      description: "Track-ready tires for maximum grip.",
      href: "/category/performance",
    },
    {
      title: "Alloy Wheels",
      imageSrc: "/categories/alloywheels.webp",
      description: "Lightweight and stylish alloy wheels.",
      href: "/category/alloy-wheels",
    },
    {
      title: "Steel Wheels",
      imageSrc: "/categories/steelwheels.png",
      description: "Durable and affordable steel wheels.",
      href: "/category/steel-wheels",
    },
    {
      title: "Tire & Wheel Packages",
      imageSrc: "/categories/tireandwheel.png",
      description: "Complete sets ready for installation.",
      href: "/category/packages",
    },
    {
      title: "Wheel Accessories",
      imageSrc: "/categories/wheelaccessories.png",
      description: "Lug nuts, spacers, center caps, and more.",
      href: "/category/wheel-accessories",
    },
    {
      title: "Tire Accessories",
      imageSrc: "/categories/tireaccessories.png",
      description: "TPMS sensors, valve stems, and repair kits.",
      href: "/category/tire-accessories",
    },
  ];

  const brands = [
    { name: "Michelin", imageSrc: "/brands/logo_michelin.png", href: "/category/all-season" },
    { name: "Bridgestone", imageSrc: "/brands/logo_bridgestone.png", href: "/category/all-season" },
    { name: "Continental", imageSrc: "/brands/logo_continental.png", href: "/category/all-season" },
    { name: "Toyo", imageSrc: "/brands/logo_toyo.png", href: "/category/all-season" },
    { name: "Cooper", imageSrc: "/brands/logo_cooper.png", href: "/category/all-season" },
    { name: "Firestone", imageSrc: "/brands/logo_firestone.png", href: "/category/all-season" },
    { name: "Hercules", imageSrc: "/brands/logo_hercules.png", href: "/category/all-season" },
  ];

  const testimonials = [
    {
      quote: "The best tire shop online! Found the perfect set of winter tires for my SUV. Fast shipping and excellent quality.",
      author: "Alex Johnson",
      title: "Satisfied Customer",
      avatarSrc: "https://api.dicebear.com/7.x/initials/svg?seed=AJ",
      rating: 5,
    },
    {
      quote: "I needed new wheels for my sports car and found exactly what I was looking for. The product description was accurate, and delivery was quick.",
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

  const toProductItemProps = (p: DbProduct) => {
    const specs = p.specs ?? {};
    const size = specs.width
      ? `${specs.width}/${specs.aspect_ratio}R${specs.rim_diameter}`
      : undefined;
    return {
      name: p.name,
      price: `$${p.price.toLocaleString()}`,
      imageSrc: p.image_url,
      href: `/product/${p.slug}`,
      specs: {
        size,
        loadSpeed: specs.load_index && specs.speed_rating
          ? `${specs.load_index}${specs.speed_rating}`
          : undefined,
        season: specs.season as "All-Season" | "Summer" | "Winter" | "Performance" | undefined,
        type: specs.tire_type as string | undefined,
        treadwear: specs.treadwear != null ? String(specs.treadwear) : undefined,
        traction: specs.traction as string | undefined,
        temperature: specs.temperature as string | undefined,
        loadIndex: specs.load_index as string | undefined,
        speedRating: specs.speed_rating as string | undefined,
      },
      rating: 4.5 + Math.random() * 0.4,
      reviews: Math.floor(100 + Math.random() * 2000),
    };
  };

  return (
    <div className="flex flex-col items-center bg-white text-foreground">
      {/* Hero Section */}
      <HeaderSlideshow
        slides={[
          "/header/pexels-gustavo-fring-6870311.jpg",
          "/header/pexels-olly-3806249.jpg",
          "/header/pexels-olly-3806252.jpg",
          "/header/pexels-olly-3807386.jpg",
          "/header/pexels-tima-miroshnichenko-5640626.jpg",
        ]}
      />

      {/* Featured Categories Carousel */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8">
            Featured Categories
          </h2>
          <ProductCarousel autoScrollSpeed={2000}>
            <ProductCard
              title="All-Season Tires"
              description="Year-round performance"
              icon={Car}
              imageSrc={productImages.tires}
              accentColor="bg-blue-600"
              href="/category/all-season"
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
              href="/category/winter"
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

      {/* Category Selection Grid */}
      <section className="w-full bg-white py-16">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center sm:text-left">
              Category Selection
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="w-full py-16">
          <div className="px-4 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-10">
              Our Featured Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => {
                const props = toProductItemProps(product);
                return (
                  <ProductItem
                    key={product.id}
                    name={props.name}
                    price={props.price}
                    imageSrc={props.imageSrc}
                    href={props.href}
                    specs={props.specs}
                    rating={props.rating}
                    reviews={props.reviews}
                  />
                );
              })}
            </div>
            <Link
              href="/category/all-season"
              className="mt-12 inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors duration-300 shadow-lg"
            >
              View All Products
            </Link>
          </div>
        </section>
      )}

      {/* Summer Tires */}
      {summerTires.length > 0 && (
        <section className="w-full bg-gray-50 py-16">
          <div className="px-4 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-10">
              Featured Tires
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {summerTires.slice(0, 4).map((tire) => {
                const props = toProductItemProps(tire);
                return (
                  <ProductItem
                    key={tire.id}
                    name={props.name}
                    price={props.price}
                    imageSrc={props.imageSrc}
                    href={props.href}
                    specs={props.specs}
                    rating={props.rating}
                    reviews={props.reviews}
                  />
                );
              })}
            </div>
            <Link
              href="/category/summer"
              className="mt-12 inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors duration-300 shadow-lg"
            >
              View All Tires
            </Link>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="w-full py-16">
        <div className="px-4 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-10">
            Why Choose Tire&amp;Wheel?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 flex flex-col items-center text-center shadow-lg border-none bg-gradient-to-br from-gray-50 to-gray-100">
              <CardContent className="p-0 flex flex-col items-center">
                <Truck className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Fast &amp; Reliable Shipping
                </h3>
                <p className="text-muted-foreground">
                  Get your wheels and tires delivered quickly and safely.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6 flex flex-col items-center text-center shadow-lg border-none bg-gradient-to-br from-gray-50 to-gray-100">
              <CardContent className="p-0 flex flex-col items-center">
                <ShieldCheck className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Quality Guaranteed
                </h3>
                <p className="text-muted-foreground">
                  We source only the best wheels and tires from trusted manufacturers.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6 flex flex-col items-center text-center shadow-lg border-none bg-gradient-to-br from-gray-50 to-gray-100">
              <CardContent className="p-0 flex flex-col items-center">
                <Headset className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  24/7 Customer Support
                </h3>
                <p className="text-muted-foreground">
                  Our dedicated team is always here to help you.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Brands */}
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

      {/* Testimonials */}
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
                    className={`w-5 h-5 ${i < 5 ? "text-yellow-400" : "text-gray-300"}`}
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
              <svg
                className="w-4 h-4 text-blue-500 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-muted-foreground">
                Rated by 160,900+ verified customers
              </span>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="w-full md:w-2/3 lg:w-1/2">
              <div className="relative flex h-[500px] w-full flex-row items-center justify-center overflow-hidden">
                <Marquee pauseOnHover vertical className="[--duration:20s]">
                  {testimonials
                    .slice(0, Math.ceil(testimonials.length / 2))
                    .map((testimonial, index) => (
                      <div key={index} className="mb-4 last:mb-0 min-h-[200px]">
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
                <Marquee
                  reverse
                  pauseOnHover
                  vertical
                  className="[--duration:20s]"
                >
                  {testimonials
                    .slice(Math.ceil(testimonials.length / 2))
                    .map((testimonial, index) => (
                      <div key={index} className="mb-4 last:mb-0 min-h-[200px]">
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
                <div className="from-gray-50 pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b" />
                <div className="from-gray-50 pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop with Confidence */}
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
              <p className="text-muted-foreground">
                fastest growing company in US
              </p>
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
