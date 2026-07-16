import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { name, email, phone, company, status, source, notes, is_active, assigned_to, priority, tags, next_follow_up_at, last_contacted_at } = body;

  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email || null;
  if (phone !== undefined) updates.phone = phone || null;
  if (company !== undefined) updates.company = company || null;
  if (status !== undefined) updates.status = status;
  if (source !== undefined) updates.source = source || null;
  if (notes !== undefined) updates.notes = notes || null;
  if (is_active !== undefined) updates.is_active = is_active;
  if (assigned_to !== undefined) updates.assigned_to = assigned_to || null;
  if (priority !== undefined) updates.priority = priority;
  if (tags !== undefined) updates.tags = tags;
  if (next_follow_up_at !== undefined) updates.next_follow_up_at = next_follow_up_at;
  if (last_contacted_at !== undefined) updates.last_contacted_at = last_contacted_at;

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("leads")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (status !== undefined) {
    await supabase.from("lead_activities").insert({
      lead_id: id,
      type: "status_change",
      description: `Status changed to "${status}"`,
      metadata: { previous_status: body._previous_status, new_status: status },
    });
  }
  if (assigned_to !== undefined && assigned_to) {
    await supabase.from("lead_activities").insert({
      lead_id: id,
      type: "assignment",
      description: `Assigned to ${assigned_to}`,
      metadata: { assigned_to },
    });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServerClient();
  const { error } = await supabase
    .from("leads")
    .update({ deleted_at: new Date().toISOString(), is_active: false })
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("lead_activities").insert({
    lead_id: id,
    type: "archived",
    description: "Lead archived",
    metadata: {},
  });

  return NextResponse.json({ success: true });
}
