import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/supabase/queries";
import ProductDetailScreen from "@/components/product-detail-screen";

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailScreen product={product} />;
}
