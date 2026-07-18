import { createServerClient } from "@/lib/supabase/server";
import type { CommTemplate, CommTemplateVersion } from "@/lib/comm-types";

export function createTemplateService(client?: ReturnType<typeof createServerClient>) {
  const db = client ?? createServerClient();

  async function getAll(): Promise<CommTemplate[]> {
    const { data } = await db.from("site_settings").select("value").eq("key", "comm_templates").single();
    return data ? ((data.value as CommTemplate[]) || []) : [];
  }

  async function getById(id: string): Promise<CommTemplate | null> {
    const templates = await getAll();
    return templates.find((t) => t.id === id) || null;
  }

  async function save(template: CommTemplate, userId: string): Promise<CommTemplate> {
    const templates = await getAll();
    const existingIndex = templates.findIndex((t) => t.id === template.id);

    const now = new Date().toISOString();
    const version: CommTemplateVersion = {
      version: (template.currentVersion || 0) + 1,
      subject: template.subject,
      body: template.body,
      createdBy: userId,
      createdAt: now,
    };

    const updated: CommTemplate = {
      ...template,
      currentVersion: (template.currentVersion || 0) + 1,
      versions: [...(template.versions || []), version],
      updatedAt: now,
      updatedBy: userId,
    };

    if (existingIndex >= 0) {
      templates[existingIndex] = updated;
    } else {
      templates.push(updated);
    }

    await db.from("site_settings").upsert({ key: "comm_templates", value: templates }, { onConflict: "key" });
    return updated;
  }

  async function remove(id: string): Promise<void> {
    const templates = await getAll();
    const filtered = templates.filter((t) => t.id !== id);
    await db.from("site_settings").upsert({ key: "comm_templates", value: filtered }, { onConflict: "key" });
  }

  function render(template: CommTemplate, variables: Record<string, string>): { subject: string; body: string } {
    let subject = template.subject;
    let body = template.body;
    for (const [key, value] of Object.entries(variables)) {
      const re = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g");
      subject = subject.replace(re, value);
      body = body.replace(re, value);
    }
    return { subject, body };
  }

  return { getAll, getById, save, remove, render };
}
