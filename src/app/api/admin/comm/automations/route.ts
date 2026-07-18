import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createAutomationService } from "@/lib/services/automation-service";
import type { AutomationRule } from "@/lib/comm-types";

export async function GET() {
  const supabase = createServerClient();
  const svc = createAutomationService(supabase as any);
  const rules = await svc.getRules();
  return NextResponse.json(rules);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = createServerClient();
  const svc = createAutomationService(supabase as any);

  const rule: AutomationRule = {
    id: crypto.randomUUID(),
    name: body.name || "",
    event: body.event || "",
    description: body.description || "",
    actions: body.actions || [],
    enabled: body.enabled ?? true,
    conditions: body.conditions || undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const saved = await svc.saveRule(rule);
  return NextResponse.json(saved);
}
