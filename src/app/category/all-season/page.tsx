import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getProductsByCategory } from "@/lib/supabase/queries";
import CategoryScreen from "@/components/category-screen";
import { Button } from "@/components/ui/button";
import { CloudRain, Shield, Gauge, Snowflake, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All-Season Tires | Tire&Wheel Mart",
  description: "Versatile all-season tires for year-round performance. Shop top brands with confidence.",
};

const benefits = [
  { icon: CloudRain, title: "Year-Round Use", desc: "Perform well in rain, light snow, and dry conditions" },
  { icon: Gauge, title: "Longer Tread Life", desc: "Harder rubber compounds last longer than seasonal tires" },
  { icon: Shield, title: "Balanced Performance", desc: "Great grip and handling across a wide temperature range" },
  { icon: Snowflake, title: "Mild Snow Capable", desc: "Handles light snow with specialized tread patterns" },
];

export default async function AllSeasonTiresPage() {
  let products: Awaited<ReturnType<typeof getProductsByCategory>> = [];

  try {
    products = await getProductsByCategory("all-season");
  } catch {
    // Database may not be seeded yet
  }

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/categories/allseason.png"
            alt=""
            fill
            className="object-contain object-right-bottom"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">All-Season Tires</h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              Versatile performance for every season. Our all-season tires deliver reliable grip, long tread life,
              and peace of mind whether you&apos;re commuting through rain or cruising on dry highways.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50" asChild>
                <a href="#products">
                  Shop All-Season Tires <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                <Link href="/shop/summer-tires">Compare Summer Tires</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose All-Season Tires?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="text-center p-6 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section id="products">
        <CategoryScreen
          categoryTitle="All-Season Tires"
          products={products}
        />
      </section>
    </div>
  );
}
