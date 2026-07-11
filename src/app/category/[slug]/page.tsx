import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/supabase/queries";
import { CategoryPageTemplate } from "@/components/category/CategoryPageTemplate";
import { CATEGORY_CONFIGS } from "@/lib/category-configs";
import CategoryScreen from "@/components/category-screen";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (category) return { title: category.name };
  const config = CATEGORY_CONFIGS[slug];
  if (config) return { title: config.seoTitle };
  return { title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (category) {
    const products = await getProductsByCategory(slug);
    return <CategoryScreen categoryTitle={category.name} products={products} />;
  }

  const config = CATEGORY_CONFIGS[slug];
  if (config) return <CategoryPageTemplate config={config} />;

  notFound();
}
