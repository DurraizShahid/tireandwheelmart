import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { recalculateProductRating } from "@/lib/review-utils";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();
  const { data, error } = await supabase.from("reviews").select("*, products(name, slug)").eq("id", id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Review not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { author, rating, title, content, is_approved, verified } = body;

  const supabase = createServerClient();

  const { data: existing } = await supabase
    .from("reviews")
    .select("product_id")
    .eq("id", id)
    .maybeSingle();
  if (!existing) return NextResponse.json({ error: "Review not found" }, { status: 404 });

  const updates: Record<string, unknown> = {};
  if (author !== undefined) updates.author = author;
  if (rating !== undefined) updates.rating = rating;
  if (title !== undefined) updates.title = title;
  if (content !== undefined) updates.content = content;
  if (is_approved !== undefined) updates.is_approved = is_approved;
  if (verified !== undefined) updates.verified = verified;

  const { data, error } = await supabase.from("reviews").update(updates).eq("id", id).select("*, products(name, slug)").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await recalculateProductRating(existing.product_id);

  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();

  const { data: existing } = await supabase
    .from("reviews")
    .select("product_id")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (existing) await recalculateProductRating(existing.product_id);

  return NextResponse.json({ success: true });
}
