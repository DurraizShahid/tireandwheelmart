import { createServerClient } from "@/lib/supabase/server";
import { createEmailService } from "./email-service";
import { createSMSService } from "./sms-service";
import { createTemplateService } from "./template-service";
import type { AutomationRule, CommEventType, CommTemplate, CommConfig } from "@/lib/comm-types";
import { DEFAULT_COMM_CONFIG } from "@/lib/comm-types";

export function createAutomationService(client?: ReturnType<typeof createServerClient>) {
  const db = client ?? createServerClient();
  const emailSvc = createEmailService(client);
  const smsSvc = createSMSService(client);
  const templateSvc = createTemplateService(client);

  async function getConfig(): Promise<CommConfig> {
    const { data, error } = await db
      .from("site_settings")
      .select("value")
      .eq("key", "comm_config")
      .single();
    if (error || !data) return DEFAULT_COMM_CONFIG;
    return { ...DEFAULT_COMM_CONFIG, ...(data.value as Partial<CommConfig>) };
  }

  async function getRules(): Promise<AutomationRule[]> {
    const { data } = await db.from("site_settings").select("value").eq("key", "comm_automation_rules").single();
    return data ? ((data.value as AutomationRule[]) || []) : [];
  }

  async function saveRule(rule: AutomationRule): Promise<AutomationRule> {
    const rules = await getRules();
    const idx = rules.findIndex((r) => r.id === rule.id);
    const now = new Date().toISOString();
    const updated = { ...rule, updatedAt: now };
    if (idx >= 0) rules[idx] = updated;
    else rules.push(updated);
    await db.from("site_settings").upsert({ key: "comm_automation_rules", value: rules }, { onConflict: "key" });
    return updated;
  }

  async function removeRule(id: string): Promise<void> {
    const rules = await getRules();
    await db.from("site_settings").upsert({ key: "comm_automation_rules", value: rules.filter((r) => r.id !== id) }, { onConflict: "key" });
  }

  async function getTemplatesForChannel(channel: "email" | "sms"): Promise<CommTemplate[]> {
    const templates = await templateSvc.getAll();
    return templates.filter((t) => t.channel === channel && t.enabled);
  }

  async function fireEvent(event: CommEventType, variables: Record<string, string>, relatedEntityType?: string, relatedEntityId?: string, metadata?: Record<string, unknown>): Promise<void> {
    const config = await getConfig();
    if (!config.automation.enabled) return;

    if (config.automation.quietHoursEnabled) {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const mins = now.getMinutes().toString().padStart(2, "0");
      const current = `${hours}:${mins}`;
      if (current >= config.automation.quietHoursStart || current < config.automation.quietHoursEnd) return;
    }

    const rules = await getRules();
    const matching = rules.filter((r) => r.event === event && r.enabled);

    for (const rule of matching) {
      for (const action of rule.actions) {
        if (!action.enabled) continue;

        const templates = await getTemplatesForChannel(action.channel);
        const tmpl = templates.find((t) => t.id === action.templateId);
        if (!tmpl) continue;

        const { subject, body } = templateSvc.render(tmpl, variables);
        const to = action.to || variables.customer_name || variables.lead_name || "";

        if (!to) continue;

        try {
          if (action.channel === "email") {
            await emailSvc.sendEmail({ to, subject, html: body, templateId: tmpl.id, templateVersion: tmpl.currentVersion, eventType: event, relatedEntityType, relatedEntityId, metadata });
          } else {
            await smsSvc.sendSMS({ to, body, templateId: tmpl.id, templateVersion: tmpl.currentVersion, eventType: event, relatedEntityType, relatedEntityId, metadata });
          }
        } catch (err) {
          console.error(`[Automation] Failed to send ${action.channel} for event ${event}:`, err);
        }
      }
    }
  }

  return { getRules, saveRule, removeRule, fireEvent };
}
