import { Metadata } from "next";
import CategoryScreen from "@/components/category-screen";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata(
  { params }: CategoryPageProps
): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = slug.replace(/-/g, " ").toUpperCase();
  return {
    title: categoryName,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  return <CategoryScreen categorySlug={slug} />;
}