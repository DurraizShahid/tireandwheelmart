import ProductDetailScreen from "@/components/product-detail-screen";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  return <ProductDetailScreen productId={id} />;
}