import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, company, status, source, notes, is_active } = body;

  if (!name) return NextResponse.json({ error: "Lead name is required" }, { status: 400 });

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("leads")
    .insert({
      name,
      email: email || null,
      phone: phone || null,
      company: company || null,
      status: status || "new",
      source: source || null,
      notes: notes || null,
      is_active: is_active ?? true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
