import HomeScreen from "@/components/home-screen";
import { getFeaturedProducts, getProductsByCategory } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

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
