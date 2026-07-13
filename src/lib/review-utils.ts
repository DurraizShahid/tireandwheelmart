import { createServerClient } from "@/lib/supabase/server";

export async function recalculateProductRating(productId: string) {
  const supabase = createServerClient();

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", productId)
    .eq("is_approved", true);

  if (error) return;

  const reviewCount = reviews?.length ?? 0;
  const total = reviews?.reduce((sum, r) => sum + r.rating, 0) ?? 0;
  const rating = reviewCount > 0 ? Math.round((total / reviewCount) * 10) / 10 : 0;

  await supabase
    .from("products")
    .update({ rating, review_count: reviewCount })
    .eq("id", productId);
}
