import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("lead_calls")
    .select("*")
    .eq("lead_id", id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("lead_calls")
    .insert({
      lead_id: id,
      status: body.status ?? "scheduled",
      duration_seconds: body.duration_seconds ?? 0,
      outcome: body.outcome ?? null,
      summary: body.summary ?? null,
      transcript: body.transcript ?? null,
      conversation: body.conversation ?? null,
      scheduled_at: body.scheduled_at ?? null,
      started_at: body.started_at ?? null,
      ended_at: body.ended_at ?? null,
      created_by: body.created_by ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("lead_activities").insert({
    lead_id: id,
    type: "call",
    description: `Call ${body.status || "scheduled"}`,
    metadata: { call_id: data.id, outcome: body.outcome },
    created_by: body.created_by ?? null,
  });

  return NextResponse.json(data, { status: 201 });
}
