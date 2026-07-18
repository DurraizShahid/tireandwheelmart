import { createServerClient } from "@/lib/supabase/server";
import type { POSAuditAction, POSAuditLogEntry } from "@/lib/pos-types";

function generateKey(): string {
  return `pos_audit:${Date.now()}:${Math.random().toString(36).substring(2, 8)}`;
}

export function createAuditService(client?: ReturnType<typeof createServerClient>) {
  const db = client ?? createServerClient();

  async function logAction(params: {
    userId: string;
    userName?: string;
    action: POSAuditAction;
    details: Record<string, unknown>;
    ipAddress?: string;
  }): Promise<void> {
    const key = generateKey();
    const entry: POSAuditLogEntry = {
      id: key,
      user_id: params.userId,
      user_name: params.userName,
      action: params.action,
      details: params.details,
      ip_address: params.ipAddress,
      created_at: new Date().toISOString(),
    };

    const { error: insertError } = await db
      .from("site_settings")
      .insert({ key, value: entry as never });

    if (insertError) throw new Error(`Failed to log audit entry: ${insertError.message}`);

    const { data: keysData } = await db
      .from("site_settings")
      .select("value")
      .eq("key", "pos_audit_keys")
      .maybeSingle();

    const keys: string[] = keysData?.value
      ? (keysData.value as unknown as string[])
      : [];

    keys.push(key);

    const { error: upsertError } = await db
      .from("site_settings")
      .upsert({ key: "pos_audit_keys", value: keys as never }, { onConflict: "key" });

    if (upsertError) throw new Error(`Failed to update audit keys: ${upsertError.message}`);
  }

  async function getAuditLog(options?: {
    userId?: string;
    action?: POSAuditAction;
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<{ data: POSAuditLogEntry[]; total: number }> {
    const limit = options?.limit ?? 50;
    const offset = options?.offset ?? 0;

    const { data: keysData } = await db
      .from("site_settings")
      .select("value")
      .eq("key", "pos_audit_keys")
      .maybeSingle();

    const keys: string[] = keysData?.value
      ? (keysData.value as unknown as string[])
      : [];

    if (keys.length === 0) {
      return { data: [], total: 0 };
    }

    const { data: entries, error } = await db
      .from("site_settings")
      .select("key, value")
      .in("key", keys);

    if (error) throw new Error(`Failed to fetch audit log: ${error.message}`);

    let auditEntries: POSAuditLogEntry[] = (entries ?? [])
      .map((e) => e.value as POSAuditLogEntry)
      .filter(Boolean);

    if (options?.userId) {
      auditEntries = auditEntries.filter((e) => e.user_id === options.userId);
    }
    if (options?.action) {
      auditEntries = auditEntries.filter((e) => e.action === options.action);
    }
    if (options?.startDate) {
      auditEntries = auditEntries.filter((e) => e.created_at >= options.startDate!);
    }
    if (options?.endDate) {
      auditEntries = auditEntries.filter((e) => e.created_at <= options.endDate!);
    }

    auditEntries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const total = auditEntries.length;
    const paginated = auditEntries.slice(offset, offset + limit);

    return { data: paginated, total };
  }

  async function getAuditSummary(options?: {
    startDate?: string;
    endDate?: string;
  }): Promise<{ action: POSAuditAction; count: number }[]> {
    const { data: keysData } = await db
      .from("site_settings")
      .select("value")
      .eq("key", "pos_audit_keys")
      .maybeSingle();

    const keys: string[] = keysData?.value
      ? (keysData.value as unknown as string[])
      : [];

    if (keys.length === 0) return [];

    const { data: entries } = await db
      .from("site_settings")
      .select("value")
      .in("key", keys);

    let auditEntries: POSAuditLogEntry[] = (entries ?? [])
      .map((e) => e.value as POSAuditLogEntry)
      .filter(Boolean);

    if (options?.startDate) {
      auditEntries = auditEntries.filter((e) => e.created_at >= options.startDate!);
    }
    if (options?.endDate) {
      auditEntries = auditEntries.filter((e) => e.created_at <= options.endDate!);
    }

    const counts: Record<string, number> = {};
    for (const entry of auditEntries) {
      counts[entry.action] = (counts[entry.action] || 0) + 1;
    }

    return Object.entries(counts).map(([action, count]) => ({
      action: action as POSAuditAction,
      count,
    }));
  }

  return { logAction, getAuditLog, getAuditSummary };
}

export type AuditService = ReturnType<typeof createAuditService>;
