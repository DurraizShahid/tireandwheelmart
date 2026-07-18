import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createTemplateService } from "@/lib/services/template-service";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const supabase = createServerClient();
  const svc = createTemplateService(supabase as any);

  const template = await svc.getById(id);
  if (!template) return NextResponse.json({ error: "Template not found" }, { status: 404 });

  const rendered = svc.render(template, body.variables || {});
  return NextResponse.json(rendered);
}
