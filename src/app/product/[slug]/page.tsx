import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/supabase/queries";
import type { Product as CatalogProduct } from "@/lib/catalog-types";
import { generateMockProducts } from "@/lib/mock-products";
import { getUrlSlug } from "@/lib/category-configs";
import { formatPrice } from "@/lib/catalog-helpers";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import ProductDetailScreen from "@/components/product-detail-screen";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  const dbProduct = await getProductBySlug(slug);
  if (dbProduct) {
    return {
      title: `${dbProduct.name} | Tire&Wheel Mart`,
      description: dbProduct.description ?? `Shop ${dbProduct.name} at Tire&Wheel Mart.`,
      openGraph: { title: dbProduct.name, description: dbProduct.description ?? undefined, images: [{ url: dbProduct.image_url }] },
    };
  }

  const mockProduct = generateMockProducts().find((p) => p.slug === slug);
  if (mockProduct) {
    return {
      title: `${mockProduct.name} | Tire&Wheel Mart`,
      description: mockProduct.description ?? `Shop ${mockProduct.name} at Tire&Wheel Mart.`,
      openGraph: {
        title: mockProduct.name,
        description: mockProduct.description,
        images: mockProduct.images[0] ? [{ url: mockProduct.images[0] }] : undefined,
      },
    };
  }

  return {};
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  const dbProduct = await getProductBySlug(slug);
  if (dbProduct) return <ProductDetailScreen product={dbProduct} />;

  const mockProduct = generateMockProducts().find((p) => p.slug === slug);
  if (!mockProduct) notFound();

  return <ProductDetailClient product={mockProduct} />;
}
