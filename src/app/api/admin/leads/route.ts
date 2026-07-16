import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const source = searchParams.get("source") || "";
  const priority = searchParams.get("priority") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10)));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from("leads").select("*", { count: "exact", head: false }).is("deleted_at", null);

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,company.ilike.%${search}%`
    );
  }
  if (status) query = query.eq("status", status);
  if (source) query = query.eq("source", source);
  if (priority) query = query.eq("priority", priority);

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, total: count ?? 0 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, company, status, source, notes, is_active, assigned_to, priority, tags, next_follow_up_at } = body;

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
      assigned_to: assigned_to || null,
      priority: priority || "medium",
      tags: tags || [],
      next_follow_up_at: next_follow_up_at || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("lead_activities").insert({
    lead_id: data.id,
    type: "created",
    description: `Lead created with status "${data.status}"`,
    metadata: { source: data.source, priority: data.priority },
  });

  return NextResponse.json(data, { status: 201 });
}
