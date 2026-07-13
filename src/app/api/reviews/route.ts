import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import { recalculateProductRating } from "@/lib/review-utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId query param required" }, { status: 400 });

  const supabase = createServerClient();
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(reviews ?? []);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  const supabase = createServerClient();

  const body = await req.json();
  const { product_id, author, rating, title, content, vehicle, tire_size } = body;

  if (!product_id || !author || !rating || !title || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
  }

  if (!userId) {
    return NextResponse.json({ error: "You must be signed in to review a product" }, { status: 401 });
  }

  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  const customerId = customer?.id ?? null;
  if (!customerId) {
    return NextResponse.json({ error: "No customer account found. Purchase a product first." }, { status: 403 });
  }

  const { data: userOrderIds } = await supabase
    .from("orders")
    .select("id")
    .eq("customer_id", customerId);

  const orderIdList = (userOrderIds ?? []).map((o) => o.id);
  if (orderIdList.length === 0) {
    return NextResponse.json({ error: "You can only review products you have purchased" }, { status: 403 });
  }

  const { data: purchase } = await supabase
    .from("order_items")
    .select("id")
    .eq("product_id", product_id)
    .in("order_id", orderIdList)
    .maybeSingle();

  if (!purchase) {
    return NextResponse.json({ error: "You can only review products you have purchased" }, { status: 403 });
  }

  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("product_id", product_id)
    .eq("customer_id", customerId)
    .maybeSingle();

  if (existingReview) {
    return NextResponse.json({ error: "You have already reviewed this product" }, { status: 409 });
  }

  const { data: review, error } = await supabase
    .from("reviews")
    .insert({
      product_id,
      customer_id: customerId,
      author,
      rating,
      title,
      content,
      vehicle: vehicle ?? null,
      tire_size: tire_size ?? null,
      verified: !!customerId,
      is_approved: false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await recalculateProductRating(product_id);

  return NextResponse.json(review);
}
