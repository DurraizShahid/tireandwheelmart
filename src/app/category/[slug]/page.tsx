import CategoryScreen from "@/components/category-screen";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return <CategoryScreen categorySlug={params.slug} />;
}