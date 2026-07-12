"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Car,
  Circle,
  Package,
  Truck,
  ShieldCheck,
  Headset,
  Snowflake,
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
import { getUrlSlug } from "@/lib/category-configs";
import { CATEGORIES } from "@/lib/catalog-constants";
import { HomepageDeals } from "@/components/promotions/HomepageDeals";
import type { Promotion as DbPromotion, Brand as DbBrand, Testimonial as DbTestimonial, Category as DbCategory } from "@/lib/supabase/types";

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
  rating: number | null;
  review_count: number | null;
}

interface HomeScreenProps {
  featuredProducts?: DbProduct[];
  summerTires?: DbProduct[];
  featuredDeals?: DbPromotion[];
  brands?: DbBrand[];
  testimonials?: DbTestimonial[];
  siteSettings?: Record<string, unknown>;
  homepageCategories?: DbCategory[];
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

const HomeScreen = ({ featuredProducts = [], summerTires = [], featuredDeals = [], brands = [], testimonials = [], siteSettings = {}, homepageCategories = [] }: HomeScreenProps) => {
  const productImages = {
    tires: "/images/tires_icon.webp",
    wheels: "/images/wheels_icon.webp",
    packages: "/images/package_icon.webp",
    snowTires: "/images/snowTire_icon.webp",
  };

  const defaultCategories = [
    { title: "All-Season Tires", imageSrc: "/categories/allseason.png", description: "Year-round performance for all weather conditions.", href: "/shop/all-season-tires" },
    { title: "Summer Tires", imageSrc: "/categories/summertires.png", description: "Superior dry and wet traction for warm weather.", href: "/shop/summer-tires" },
    { title: "Winter Tires", imageSrc: "/categories/wintertires.png", description: "Advanced grip on snow and ice.", href: "/shop/winter-tires" },
    { title: "Performance Tires", imageSrc: "/categories/performancetires.png", description: "Track-ready tires for maximum grip.", href: "/shop/performance-tires" },
    { title: "Alloy Wheels", imageSrc: "/categories/alloywheels.webp", description: "Lightweight and stylish alloy wheels.", href: "/shop/alloy-wheels" },
    { title: "Steel Wheels", imageSrc: "/categories/steelwheels.png", description: "Durable and affordable steel wheels.", href: "/shop/steel-wheels" },
    { title: "Tire & Wheel Packages", imageSrc: "/categories/tireandwheel.png", description: "Complete sets ready for installation.", href: "/shop/tire-wheel-packages" },
    { title: "Wheel Accessories", imageSrc: "/categories/wheelaccessories.png", description: "Lug nuts, spacers, center caps, and more.", href: "/shop/wheel-accessories" },
    { title: "Tire Accessories", imageSrc: "/categories/tireaccessories.png", description: "TPMS sensors, valve stems, and repair kits.", href: "/shop/tire-accessories" },
  ];

  const categoryImageBySlug = Object.fromEntries(
    CATEGORIES.map((c) => [c.slug, c.image])
  );

  const featuredCategories = homepageCategories.length > 0
    ? homepageCategories.map((c) => ({
        title: c.name,
        imageSrc: c.image_url || categoryImageBySlug[c.slug] || categoryImageBySlug[getUrlSlug(c.slug)] || "/categories/allseason.png",
        description: c.homepage_description ?? c.description ?? "",
        href: `/shop/${getUrlSlug(c.slug)}`,
      }))
    : defaultCategories;

  const displayBrands = brands.length > 0
    ? brands.map((b) => ({
        name: b.name,
        imageSrc: b.image_url ?? "/placeholder.svg",
        href: `/shop?brand=${b.slug}`,
      }))
    : [
        { name: "Michelin", imageSrc: "/brands/logo_michelin.png", href: "/shop/all-season-tires" },
        { name: "Bridgestone", imageSrc: "/brands/logo_bridgestone.png", href: "/shop/all-season-tires" },
        { name: "Continental", imageSrc: "/brands/logo_continental.png", href: "/shop/all-season-tires" },
        { name: "Toyo", imageSrc: "/brands/logo_toyo.png", href: "/shop/all-season-tires" },
        { name: "Cooper", imageSrc: "/brands/logo_cooper.png", href: "/shop/all-season-tires" },
        { name: "Firestone", imageSrc: "/brands/logo_firestone.png", href: "/shop/all-season-tires" },
        { name: "Hercules", imageSrc: "/brands/logo_hercules.png", href: "/shop/all-season-tires" },
      ];

  const displayTestimonials = testimonials.length > 0
    ? testimonials.map((t) => ({
        quote: t.content,
        author: t.author,
        title: t.role ?? (t.company ? `${t.company}` : "Customer"),
        avatarSrc: t.avatar_url ?? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(t.author)}`,
        rating: t.rating,
      }))
    : [
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

  type StatValue = { end: number | string; suffix: string; label: string };
  const getStat = (key: string, fallback: StatValue): StatValue => {
    const val = siteSettings[key];
    if (val && typeof val === "object" && "end" in val) return val as StatValue;
    return fallback;
  };
  const statApproval = getStat("stat_approval", { end: 98, suffix: "%", label: "of customers approve" });
  const statGrowth = getStat("stat_growth", { end: "Top 500", suffix: "", label: "fastest growing company in US" });
  const statInstallers = getStat("stat_installers", { end: 20000, suffix: "+", label: "certified installers" });
  const statDistributors = getStat("stat_distributors", { end: 7000, suffix: "+", label: "local distributors" });
  const statCustomers = getStat("stat_customers", { end: 6000000, suffix: "+", label: "customers served" });

  const toProductItemProps = (p: DbProduct) => {
    const specs = p.specs ?? {};
    const size = specs.rim_diameter
      ? `${specs.width}/${specs.aspect_ratio}R${specs.rim_diameter}`
      : specs.diameter
        ? `${specs.width}x${specs.diameter}`
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
      rating: p.rating ?? 4.5,
      reviews: p.review_count ?? 0,
    };
  };

  return (
    <div className="flex flex-col bg-white text-foreground">
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
              href="/shop/all-season-tires"
            />
            <ProductCard
              title="Alloy Wheels"
              description="Style and durability"
              icon={Circle}
              imageSrc={productImages.wheels}
              accentColor="bg-red-600"
              href="/shop/alloy-wheels"
            />
            <ProductCard
              title="Winter Tires"
              description="Superior grip in snow"
              icon={Snowflake}
              imageSrc={productImages.snowTires}
              accentColor="bg-green-600"
              href="/shop/winter-tires"
            />
            <ProductCard
              title="Tire Packages"
              description="Complete wheel sets"
              icon={Package}
              imageSrc={productImages.packages}
              accentColor="bg-purple-600"
              href="/shop/tire-wheel-packages"
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

      <HomepageDeals dbPromotions={featuredDeals} />

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
              href="/shop"
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
              href="/shop/summer-tires"
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
            {displayBrands.map((brand, index) => (
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
                  {displayTestimonials
                    .slice(0, Math.ceil(displayTestimonials.length / 2))
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
                  {displayTestimonials
                    .slice(Math.ceil(displayTestimonials.length / 2))
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
                  <CountUp end={statApproval.end} suffix={statApproval.suffix} />
                </div>
              </div>
              <p className="text-muted-foreground">{statApproval.label}</p>
            </div>
            <div className="text-left border-r border-gray-200 pr-8 lg:last:border-r-0">
              <div className="flex items-center mb-3">
                <TrendingUp className="h-6 w-6 text-red-600 mr-2 flex-shrink-0" />
                <div className="text-3xl md:text-4xl font-bold text-red-600">
                  <CountUp end={statGrowth.end} suffix={statGrowth.suffix} />
                </div>
              </div>
              <p className="text-muted-foreground">{statGrowth.label}</p>
            </div>
            <div className="text-left border-r border-gray-200 pr-8 lg:last:border-r-0">
              <div className="flex items-center mb-3">
                <Wrench className="h-6 w-6 text-red-600 mr-2 flex-shrink-0" />
                <div className="text-3xl md:text-4xl font-bold text-red-600">
                  <CountUp end={statInstallers.end} suffix={statInstallers.suffix} />
                </div>
              </div>
              <p className="text-muted-foreground">{statInstallers.label}</p>
            </div>
            <div className="text-left border-r border-gray-200 pr-8 lg:last:border-r-0">
              <div className="flex items-center mb-3">
                <MapPin className="h-6 w-6 text-red-600 mr-2 flex-shrink-0" />
                <div className="text-3xl md:text-4xl font-bold text-red-600">
                  <CountUp end={statDistributors.end} suffix={statDistributors.suffix} />
                </div>
              </div>
              <p className="text-muted-foreground">{statDistributors.label}</p>
            </div>
            <div className="text-left">
              <div className="flex items-center mb-3">
                <Users className="h-6 w-6 text-red-600 mr-2 flex-shrink-0" />
                <div className="text-3xl md:text-4xl font-bold text-red-600">
                  <CountUp end={statCustomers.end} suffix={statCustomers.suffix} />
                </div>
              </div>
              <p className="text-muted-foreground">{statCustomers.label}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
