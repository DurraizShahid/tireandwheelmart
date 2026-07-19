import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId, sessionId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clerkClient();
    const { data: sessions } = await client.sessions.getSessionList({ userId });

    const mapped = sessions.map((s) => ({
      id: s.id,
      status: s.status,
      lastActiveAt: s.lastActiveAt ? new Date(s.lastActiveAt).toISOString() : null,
      createdAt: s.createdAt ? new Date(s.createdAt).toISOString() : null,
      device: (s.latestActivity?.deviceType ?? "Unknown device"),
      isCurrent: s.id === sessionId,
    }));

    return NextResponse.json({ sessions: mapped });
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    return NextResponse.json({ sessions: [] });
  }
}
