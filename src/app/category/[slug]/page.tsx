import CategoryScreen from "@/components/category-screen";

interface CategoryPageProps {
  params: any; // Workaround for a persistent Next.js type generation issue expecting Promise<any>
  searchParams?: any; // Workaround for a persistent Next.js type generation issue expecting Promise<any>
}

export default function CategoryPage({ params }: CategoryPageProps) {
  // We still expect params.slug to be a string at runtime for this route
  const categorySlug = params.slug as string;
  return <CategoryScreen categorySlug={categorySlug} />;
}