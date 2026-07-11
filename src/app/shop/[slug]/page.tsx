import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryPageTemplate } from "@/components/category/CategoryPageTemplate";
import { CATEGORY_CONFIGS, URL_SLUG_MAP, getConfigKey } from "@/lib/category-configs";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Object.keys(URL_SLUG_MAP).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const configKey = getConfigKey(slug);
  if (!configKey) return {};
  const config = CATEGORY_CONFIGS[configKey];
  return {
    title: config.seoTitle,
    description: config.seoDescription,
    openGraph: {
      title: config.seoTitle,
      description: config.seoDescription,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const configKey = getConfigKey(slug);
  if (!configKey) notFound();
  const config = CATEGORY_CONFIGS[configKey];
  return <CategoryPageTemplate config={config} />;
}
