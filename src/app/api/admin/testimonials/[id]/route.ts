import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();
  const { data, error } = await supabase.from("testimonials").select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { author, role, company, avatar_url, content, rating, display_order, is_approved, is_active } = body;

  const supabase = createServerClient();
  const updates: Record<string, unknown> = {};
  if (author !== undefined) updates.author = author;
  if (role !== undefined) updates.role = role || null;
  if (company !== undefined) updates.company = company || null;
  if (avatar_url !== undefined) updates.avatar_url = avatar_url || null;
  if (content !== undefined) updates.content = content;
  if (rating !== undefined) updates.rating = rating;
  if (display_order !== undefined) updates.display_order = display_order;
  if (is_approved !== undefined) updates.is_approved = is_approved;
  if (is_active !== undefined) updates.is_active = is_active;

  const { data, error } = await supabase.from("testimonials").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
