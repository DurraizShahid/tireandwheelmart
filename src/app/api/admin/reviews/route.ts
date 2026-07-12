import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*, products(name, slug)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { product_id, author, rating, title, content, vehicle, tire_size } = body;

  if (!product_id || !author || !rating || !content) {
    return NextResponse.json({ error: "product_id, author, rating, and content are required" }, { status: 400 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      product_id,
      author,
      rating,
      title: title || "",
      content,
      vehicle: vehicle || null,
      tire_size: tire_size || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
