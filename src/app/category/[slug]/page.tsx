import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/supabase/queries";
import CategoryScreen from "@/components/category-screen";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  return {
    title: category?.name ?? slug.replace(/-/g, " ").toUpperCase(),
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(slug);

  return (
    <CategoryScreen
      categoryTitle={category.name}
      products={products}
    />
  );
}
