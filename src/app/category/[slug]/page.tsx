import CategoryScreen from "@/components/category-screen";

interface CategoryPageProps {
  params: {
    slug: string;
  };
  // Added searchParams to align with Next.js's PageProps type
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return <CategoryScreen categorySlug={params.slug} />;
}