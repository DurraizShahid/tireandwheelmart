import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase.from("testimonials").select("*").order("display_order");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { author, role, company, avatar_url, content, rating, display_order } = body;

  if (!author || !content) return NextResponse.json({ error: "Author and content are required" }, { status: 400 });

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("testimonials")
    .insert({
      author,
      role: role || null,
      company: company || null,
      avatar_url: avatar_url || null,
      content,
      rating: rating ?? 5,
      display_order: display_order ?? 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
