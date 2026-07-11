import type { Metadata } from "next";
import HomeScreen from "@/components/home-screen";
import { getFeaturedProducts, getProductsByCategory } from "@/lib/supabase/queries";

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

  try {
    [featuredProducts, summerTires] = await Promise.all([
      getFeaturedProducts(),
      getProductsByCategory("summer"),
    ]);
  } catch {
    // Database may not be seeded yet — render with empty arrays
  }

  return (
    <HomeScreen
      featuredProducts={featuredProducts}
      summerTires={summerTires}
    />
  );
}
