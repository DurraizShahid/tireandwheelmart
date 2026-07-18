import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createTemplateService } from "@/lib/services/template-service";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();
  const svc = createTemplateService(supabase as any);
  const template = await svc.getById(id);
  if (!template) return NextResponse.json({ error: "Template not found" }, { status: 404 });
  return NextResponse.json(template);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const supabase = createServerClient();
  const svc = createTemplateService(supabase as any);

  const existing = await svc.getById(id);
  if (!existing) return NextResponse.json({ error: "Template not found" }, { status: 404 });

  const updated = await svc.save(
    { ...existing, ...body, id },
    body.updatedBy || existing.updatedBy,
  );
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServerClient();
  const svc = createTemplateService(supabase as any);
  await svc.remove(id);
  return NextResponse.json({ success: true });
}
