import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/supabase/queries";
import ProductDetailScreen from "@/components/product-detail-screen";
import type { Product as CatalogProduct } from "@/lib/catalog-types";
import { generateMockProducts } from "@/lib/mock-products";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

function mockToDetailProduct(p: CatalogProduct) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    compare_at_price: p.comparePrice ?? null,
    image_url: p.images[0] ?? "",
    description: p.description ?? null,
    brand: p.brand ?? null,
    sku: p.sku ?? null,
    in_stock: p.stock > 0,
    stock_quantity: p.stock,
    specs: p.specifications as Record<string, unknown>,
    categories: { name: p.category, slug: p.category },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  const dbProduct = await getProductBySlug(slug);
  if (dbProduct) return <ProductDetailScreen product={dbProduct} />;

  const mockProduct = generateMockProducts().find((p) => p.slug === slug);
  if (!mockProduct) notFound();

  return <ProductDetailScreen product={mockToDetailProduct(mockProduct)} />;
}
