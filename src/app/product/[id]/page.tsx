import ProductDetailScreen from "@/components/product-detail-screen";

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  return <ProductDetailScreen productId={params.id} />;
}