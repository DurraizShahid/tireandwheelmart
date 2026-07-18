import { createServerClient } from "@/lib/supabase/server";
import type { BusinessKnowledge, BusinessInfo } from "@/lib/ai/types";

const cache = new Map<string, { data: BusinessKnowledge; expiry: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

function getCached(key: string): BusinessKnowledge | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: BusinessKnowledge): void {
  cache.set(key, { data, expiry: Date.now() + CACHE_TTL_MS });
}

export async function loadBusinessKnowledge(): Promise<BusinessKnowledge> {
  const cacheKey = "business_knowledge";
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const supabase = createServerClient();

  const [faqsResult, promosResult, productsResult] = await Promise.all([
    supabase
      .from("faqs")
      .select("category, question, answer")
      .eq("is_active", true)
      .order("display_order", { ascending: true }),
    supabase
      .from("promotions")
      .select("name, description, type, value, badge_text, is_active")
      .eq("is_active", true)
      .or(`end_date.is.null,end_date.gte.${new Date().toISOString()}`)
      .order("priority", { ascending: true }),
    supabase
      .from("products")
      .select("name, price, brand, description, in_stock, category_id, categories(name)")
      .eq("featured", true)
      .limit(20),
  ]);

  const faqs = (faqsResult.data ?? []).map((f) => ({
    category: f.category,
    question: f.question,
    answer: f.answer,
  }));

  const promotions = (promosResult.data ?? []).map((p) => ({
    name: p.name,
    description: p.description,
    type: p.type,
    value: p.value,
    badgeText: p.badge_text,
    isActive: p.is_active,
  }));

  const products = (productsResult.data ?? []).map((p) => ({
    name: p.name,
    price: p.price,
    brand: p.brand,
    description: p.description,
    inStock: p.in_stock,
    category: (p as any).categories?.name ?? null,
  }));

  const knowledge: BusinessKnowledge = {
    companyInfo: {} as BusinessInfo,
    faqs,
    promotions,
    products,
    commonQuestions: {},
  };

  for (const faq of faqs) {
    knowledge.commonQuestions[faq.question.toLowerCase()] = faq.answer;
  }

  setCache(cacheKey, knowledge);
  return knowledge;
}
