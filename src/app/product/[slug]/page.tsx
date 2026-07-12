import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug as getDbProductBySlug } from "@/lib/supabase/queries";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import ProductDetailScreen from "@/components/product-detail-screen";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

async function getCatalogProduct(slug: string) {
  const { createServerClient } = await import("@/lib/supabase/server");
  const { toCatalogProduct } = await import("@/lib/supabase/mappers");
  const supabase = createServerClient();
  const { data: rows } = await supabase.from("products").select("*").eq("slug", slug).limit(1);
  const product = (rows as any)?.[0] ?? null;
  if (!product) return null;
  return toCatalogProduct(product);
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  const dbProduct = await getDbProductBySlug(slug);
  if (dbProduct) {
    return {
      title: `${dbProduct.name} | Tire&Wheel Mart`,
      description: dbProduct.description ?? `Shop ${dbProduct.name} at Tire&Wheel Mart.`,
      openGraph: { title: dbProduct.name, description: dbProduct.description ?? undefined, images: [{ url: dbProduct.image_url }] },
    };
  }

  const catalogProduct = await getCatalogProduct(slug);
  if (catalogProduct) {
    return {
      title: `${catalogProduct.name} | Tire&Wheel Mart`,
      description: catalogProduct.description ?? `Shop ${catalogProduct.name} at Tire&Wheel Mart.`,
      openGraph: {
        title: catalogProduct.name,
        description: catalogProduct.description,
        images: catalogProduct.images[0] ? [{ url: catalogProduct.images[0] }] : undefined,
      },
    };
  }

  return {};
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  const dbProduct = await getDbProductBySlug(slug);
  if (dbProduct) return <ProductDetailScreen product={dbProduct} />;

  const catalogProduct = await getCatalogProduct(slug);
  if (!catalogProduct) notFound();

  return <ProductDetailClient product={catalogProduct} />;
}
