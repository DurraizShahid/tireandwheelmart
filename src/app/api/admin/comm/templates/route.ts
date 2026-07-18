import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createTemplateService } from "@/lib/services/template-service";
import type { CommTemplate } from "@/lib/comm-types";

export async function GET() {
  const supabase = createServerClient();
  const svc = createTemplateService(supabase as any);
  const templates = await svc.getAll();
  return NextResponse.json(templates);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = createServerClient();
  const svc = createTemplateService(supabase as any);

  const template: CommTemplate = {
    id: crypto.randomUUID(),
    name: body.name || "",
    description: body.description || "",
    channel: body.channel || "email",
    category: body.category || "general",
    subject: body.subject || "",
    body: body.body || "",
    variables: body.variables || [],
    enabled: body.enabled ?? true,
    versions: [],
    currentVersion: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updatedBy: body.updatedBy || "",
  };

  const saved = await svc.save(template, body.updatedBy || "");
  return NextResponse.json(saved);
}
