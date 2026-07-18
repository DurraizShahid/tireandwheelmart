import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createAutomationService } from "@/lib/services/automation-service";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();
  const svc = createAutomationService(supabase as any);
  const rules = await svc.getRules();
  const rule = rules.find((r) => r.id === id);
  if (!rule) return NextResponse.json({ error: "Rule not found" }, { status: 404 });
  return NextResponse.json(rule);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const supabase = createServerClient();
  const svc = createAutomationService(supabase as any);

  const rules = await svc.getRules();
  const existing = rules.find((r) => r.id === id);
  if (!existing) return NextResponse.json({ error: "Rule not found" }, { status: 404 });

  const updated = await svc.saveRule({ ...existing, ...body, id });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();
  const svc = createAutomationService(supabase as any);
  await svc.removeRule(id);
  return NextResponse.json({ success: true });
}
