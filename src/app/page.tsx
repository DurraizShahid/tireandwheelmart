import type { Metadata } from "next";
import HomeScreen from "@/components/home-screen";
import { getFeaturedProducts, getProductsByCategory, getHomepageFeaturedDeals, getBrands, getTestimonials, getSiteSettings, getHomepageCategories } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Your ultimate destination for premium tires, wheels, and automotive accessories. Shop all-season, summer, winter tires and more.",
  openGraph: {
    title: "Tire&Wheel Mart – Home",
    description:
      "Your ultimate destination for premium tires, wheels, and automotive accessories.",
  },
};

export default async function Home() {
  let featuredProducts: Awaited<ReturnType<typeof getFeaturedProducts>> = [];
  let summerTires: Awaited<ReturnType<typeof getProductsByCategory>> = [];
  let featuredDeals: Awaited<ReturnType<typeof getHomepageFeaturedDeals>> = [];
  let brands: Awaited<ReturnType<typeof getBrands>> = [];
  let testimonials: Awaited<ReturnType<typeof getTestimonials>> = [];
  let siteSettings: Record<string, unknown> = {};
  let homepageCategories: Awaited<ReturnType<typeof getHomepageCategories>> = [];

  try {
    [featuredProducts, summerTires, featuredDeals, brands, testimonials, siteSettings, homepageCategories] = await Promise.all([
      getFeaturedProducts(),
      getProductsByCategory("summer"),
      getHomepageFeaturedDeals(),
      getBrands(),
      getTestimonials(),
      getSiteSettings(),
      getHomepageCategories(),
    ]);
  } catch {
    // Database may not be seeded yet — render with empty arrays
  }

  return (
    <HomeScreen
      featuredProducts={featuredProducts}
      summerTires={summerTires}
      featuredDeals={featuredDeals}
      brands={brands}
      testimonials={testimonials}
      siteSettings={siteSettings}
      homepageCategories={homepageCategories}
    />
  );
}
