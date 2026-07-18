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
import { supabase } from "@/lib/supabase";
import type { Promotion as DbPromotion, Brand as DbBrand, Testimonial as DbTestimonial, Category as DbCategory } from "@/lib/supabase/types";
import { useTranslation } from "@/i18n/use-locale";

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
  stock_quantity: number;
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
  const { t } = useTranslation();
  const [liveDeals, setLiveDeals] = useState<DbPromotion[]>(featuredDeals);

  useEffect(() => {
    supabase
      .from("promotions")
      .select("*")
      .eq("show_on_homepage", true)
      .eq("is_active", true)
      .order("homepage_order")
      .then(({ data }) => {
        if (data) setLiveDeals(data);
      });
  }, []);

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
    ? brands.filter((b) => b.image_url).map((b) => ({
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
          rating: 0,
        },
        {
          quote: "I needed new wheels for my sports car and found exactly what I was looking for. The product description was accurate, and delivery was quick.",
          author: "Maria Rodriguez",
          title: "Car Enthusiast",
          avatarSrc: "https://api.dicebear.com/7.x/initials/svg?seed=MR",
          rating: 0,
        },
        {
          quote: "Fantastic customer service! They helped me choose the right tire package for my vehicle. The installation was smooth and the tires perform excellently!",
          author: "David Lee",
          title: "Happy Customer",
          avatarSrc: "https://api.dicebear.com/7.x/initials/svg?seed=DL",
          rating: 0,
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
      rating: p.rating ?? undefined,
      reviews: p.review_count ?? undefined,
      stock: p.stock_quantity,
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
{t("home.featuredCategories")}
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

      <HomepageDeals dbPromotions={liveDeals} />

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="w-full py-16">
          <div className="px-4 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-10">
              {t("home.ourFeaturedProducts")}
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
                    stock={props.stock}
                  />
                );
              })}
            </div>
            <Link
              href="/shop"
              className="mt-12 inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors duration-300 shadow-lg"
            >
              {t("home.viewAllProducts")}
            </Link>
          </div>
        </section>
      )}

      {/* Summer Tires */}
      {summerTires.length > 0 && (
        <section className="w-full bg-gray-50 py-16">
          <div className="px-4 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-10">
              {t("home.featuredTires")}
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
                    stock={props.stock}
                  />
                );
              })}
            </div>
            <Link
              href="/shop/summer-tires"
              className="mt-12 inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors duration-300 shadow-lg"
            >
              {t("home.viewAllTires")}
            </Link>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="w-full py-16">
        <div className="px-4 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-10">
            {t("home.whyChooseUs")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 flex flex-col items-center text-center shadow-lg border-none bg-gradient-to-br from-gray-50 to-gray-100">
              <CardContent className="p-0 flex flex-col items-center">
                <Truck className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {t("home.fastShipping")}
                </h3>
                <p className="text-muted-foreground">
                  {t("home.fastShippingDesc")}
                </p>
              </CardContent>
            </Card>
            <Card className="p-6 flex flex-col items-center text-center shadow-lg border-none bg-gradient-to-br from-gray-50 to-gray-100">
              <CardContent className="p-0 flex flex-col items-center">
                <ShieldCheck className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {t("home.qualityGuaranteed")}
                </h3>
                <p className="text-muted-foreground">
                  {t("home.qualityGuaranteedDesc")}
                </p>
              </CardContent>
            </Card>
            <Card className="p-6 flex flex-col items-center text-center shadow-lg border-none bg-gradient-to-br from-gray-50 to-gray-100">
              <CardContent className="p-0 flex flex-col items-center">
                <Headset className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {t("home.support247")}
                </h3>
                <p className="text-muted-foreground">
                  {t("home.support247Desc")}
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
            {t("home.bestPriceGuarantee")}
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            {t("home.trustedBrands")}
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
              <span className="font-light text-black">{t("home.customersLoveUs")}</span>
            </h2>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              <span className="font-bold text-red-600">{t("home.discoverWhy")}</span>
            </h2>
            <div className="flex items-center mt-4">
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
                {t("home.trustedNationwide")}
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
            {t("home.shopWithConfidence")}
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
