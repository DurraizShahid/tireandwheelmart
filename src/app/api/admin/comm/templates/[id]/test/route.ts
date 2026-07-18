import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createTemplateService } from "@/lib/services/template-service";
import { createEmailService } from "@/lib/services/email-service";
import { createSMSService } from "@/lib/services/sms-service";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { to, variables } = body;

  if (!to) return NextResponse.json({ error: "Recipient (to) is required" }, { status: 400 });

  const supabase = createServerClient();
  const templateSvc = createTemplateService(supabase as any);
  const template = await templateSvc.getById(id);
  if (!template) return NextResponse.json({ error: "Template not found" }, { status: 404 });

  const rendered = templateSvc.render(template, variables || {});

  try {
    if (template.channel === "email") {
      const emailSvc = createEmailService(supabase as any);
      const result = await emailSvc.sendEmail({ to, subject: rendered.subject, html: rendered.body, templateId: template.id, templateVersion: template.currentVersion });
      return NextResponse.json(result);
    } else {
      const smsSvc = createSMSService(supabase as any);
      const result = await smsSvc.sendSMS({ to, body: rendered.body, templateId: template.id, templateVersion: template.currentVersion });
      return NextResponse.json(result);
    }
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
