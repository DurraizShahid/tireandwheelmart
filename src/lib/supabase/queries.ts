import { createServerClient } from "./server";
import type { Product, ProductWithCategory, Category, Supplier, Promotion, Brand, Testimonial, VehicleFitment, Lead, LeadActivity, LeadCall, Faq } from "./types";

export async function getCategories(): Promise<Category[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order");

  if (error) throw error;
  return data ?? [];
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

export async function getProductsByCategory(
  categorySlug: string
): Promise<Product[]> {
  const supabase = createServerClient();

  const { data: category, error: catErr } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (catErr || !category) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", category.id)
    .order("name");

  if (error) throw error;
  return data ?? [];
}

export async function getProductBySlug(
  slug: string
): Promise<ProductWithCategory | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data as ProductWithCategory;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .order("name");

  if (error) throw error;
  return data ?? [];
}

export async function getHomepageFeaturedDeals(): Promise<Promotion[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .eq("show_on_homepage", true)
    .eq("is_active", true)
    .order("homepage_order");

  if (error) throw error;
  return data ?? [];
}

export async function searchProductsInDb(
  query: string
): Promise<Product[]> {
  const supabase = createServerClient();
  const term = `%${query}%`;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .or(`name.ilike.${term},brand.ilike.${term},description.ilike.${term}`)
    .order("name");

  if (error) throw error;
  return data ?? [];
}

// ---- Homepage Categories ----

export async function getHomepageCategories(): Promise<Category[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("homepage_category", true)
    .order("display_order");

  if (error) throw error;
  return data ?? [];
}

// ---- Site Settings ----

export async function getSiteSettings(): Promise<Record<string, unknown>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*");

  if (error) throw error;
  const settings: Record<string, unknown> = {};
  for (const row of data ?? []) {
    settings[row.key] = row.value;
  }
  return settings;
}

// ---- Brand & Testimonial Queries ----

export async function getBrands(): Promise<Brand[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .eq("show_on_homepage", true)
    .not("image_url", "is", null)
    .order("display_order");

  if (error) throw error;
  return data ?? [];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .eq("is_approved", true)
    .order("display_order");

  if (error) throw error;
  return data ?? [];
}

// ---- Vehicle Fitment Queries ----

export async function getMakes(): Promise<string[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("vehicle_fitments")
    .select("make")
    .order("make");

  if (error) throw error;
  return [...new Set(data?.map((r) => r.make) ?? [])];
}

export async function getModels(make: string): Promise<{ model: string; year_start: number; year_end: number }[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("vehicle_fitments")
    .select("model, year_start, year_end")
    .eq("make", make)
    .order("model");

  if (error) throw error;
  const seen = new Set<string>();
  return (data ?? []).filter((r) => {
    const key = r.model;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function lookupFitment(
  make: string,
  model: string,
  year: number
): Promise<VehicleFitment[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("vehicle_fitments")
    .select("*")
    .eq("make", make)
    .eq("model", model)
    .lte("year_start", year)
    .gte("year_end", year);

  if (error) throw error;
  return data ?? [];
}

// ---- FAQ Queries ----

export async function getFaqs(): Promise<Faq[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_active", true)
    .order("category")
    .order("display_order");

  if (error) throw error;
  return data ?? [];
}

// ---- Supplier Queries ----

export async function getSuppliers(): Promise<Supplier[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .order("business_name");

  if (error) throw error;
  return data ?? [];
}

export async function getSupplierByClerkId(
  clerkUserId: string
): Promise<Supplier | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .single();

  if (error) return null;
  return data;
}

export async function getProductsBySupplier(
  supplierId: string
): Promise<Product[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("supplier_id", supplierId)
    .order("name");

  if (error) throw error;
  return data ?? [];
}

export async function getSupplierOrders(
  supplierId: string
): Promise<unknown[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("order_items")
    .select("*, orders(*), products!inner(*)")
    .eq("products.supplier_id", supplierId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// ---- Lead Queries ----

export async function getLeads(options?: {
  search?: string;
  status?: string;
  source?: string;
  priority?: string;
  assignedTo?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ data: Lead[]; total: number }> {
  const supabase = createServerClient();
  const page = options?.page ?? 1;
  const pageSize = options?.pageSize ?? 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("leads")
    .select("*", { count: "exact", head: false })
    .is("deleted_at", null);

  if (options?.search) {
    const s = options.search;
    query = query.or(`name.ilike.%${s}%,email.ilike.%${s}%,phone.ilike.%${s}%,company.ilike.%${s}%`);
  }
  if (options?.status) query = query.eq("status", options.status);
  if (options?.source) query = query.eq("source", options.source);
  if (options?.priority) query = query.eq("priority", options.priority);
  if (options?.assignedTo) query = query.eq("assigned_to", options.assignedTo);

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { data: data ?? [], total: count ?? 0 };
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();
  if (error) return null;
  return data;
}

export async function getLeadActivities(leadId: string): Promise<LeadActivity[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("lead_activities")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getLeadCalls(leadId: string): Promise<LeadCall[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("lead_calls")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getLeadDashboardStats(): Promise<{
  total: number;
  new: number;
  qualified: number;
  won: number;
  lost: number;
  followupsDue: number;
  sourceDistribution: { source: string; count: number }[];
  statusDistribution: { status: string; count: number }[];
}> {
  const supabase = createServerClient();



  const { data: leads, error } = await supabase
    .from("leads")
    .select("id, status, source, next_follow_up_at, created_at")
    .is("deleted_at", null);

  if (error) throw error;

  const total = leads?.length ?? 0;
  const newLeads = leads?.filter((l) => l.status === "new").length ?? 0;
  const qualified = leads?.filter((l) => l.status === "qualified").length ?? 0;
  const won = leads?.filter((l) => l.status === "won" || l.status === "converted").length ?? 0;
  const lost = leads?.filter((l) => l.status === "lost" || l.status === "closed").length ?? 0;

  const followupsDue = leads?.filter((l) => {
    if (!l.next_follow_up_at) return false;
    const d = new Date(l.next_follow_up_at);
    return d <= new Date() && (l.status !== "won" && l.status !== "lost" && l.status !== "converted" && l.status !== "closed");
  }).length ?? 0;

  const sourceMap = new Map<string, number>();
  const statusMap = new Map<string, number>();
  for (const l of leads ?? []) {
    const src = l.source || "unknown";
    sourceMap.set(src, (sourceMap.get(src) ?? 0) + 1);
    statusMap.set(l.status, (statusMap.get(l.status) ?? 0) + 1);
  }

  return {
    total,
    new: newLeads,
    qualified,
    won,
    lost,
    followupsDue,
    sourceDistribution: Array.from(sourceMap.entries()).map(([source, count]) => ({ source, count })),
    statusDistribution: Array.from(statusMap.entries()).map(([status, count]) => ({ status, count })),
  };
}
