import { createServerClient } from "./server";
import type { Product, ProductWithCategory, Category, Supplier } from "./types";

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
