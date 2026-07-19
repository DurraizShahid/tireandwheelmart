import { createServerClient } from "@/lib/supabase/server";
import { clerkClient } from "@clerk/nextjs/server";
import type { AppRole, AppPermission } from "@/lib/auth-types";
import { hasPermission } from "@/lib/auth-types";

const SESSION_TIMEOUT_MINUTES = 60;
const SESSION_REFRESH_INTERVAL_MINUTES = 15;

export function createAuthService() {
  async function getUserRole(userId: string): Promise<AppRole | undefined> {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return user.publicMetadata?.role as AppRole | undefined;
  }

  async function getUserSessions(userId: string) {
    const client = await clerkClient();
    const { data: sessions } = await client.sessions.getSessionList({ userId });
    return sessions.map((s) => ({
      id: s.id,
      status: s.status,
      lastActiveAt: s.lastActiveAt ? new Date(s.lastActiveAt).toISOString() : null,
      createdAt: s.createdAt ? new Date(s.createdAt).toISOString() : null,
      device: s.latestActivity?.deviceType ?? "Unknown",
      isCurrent: false,
    }));
  }

  async function revokeAllSessions(userId: string): Promise<void> {
    const client = await clerkClient();
    const { data: sessions } = await client.sessions.getSessionList({ userId });
    await Promise.all(
      sessions.map((s) => client.sessions.revokeSession(s.id)),
    );
  }

  async function revokeSession(sessionId: string): Promise<void> {
    const client = await clerkClient();
    await client.sessions.revokeSession(sessionId);
  }

  async function checkPermission(userId: string, permission: AppPermission): Promise<boolean> {
    const role = await getUserRole(userId);
    return hasPermission(role, permission);
  }

  return {
    getUserRole,
    getUserSessions,
    revokeAllSessions,
    revokeSession,
    checkPermission,
    SESSION_TIMEOUT_MINUTES,
    SESSION_REFRESH_INTERVAL_MINUTES,
  };
}
