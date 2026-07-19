import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const client = await clerkClient();
    await client.sessions.revokeSession(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to revoke session:", error);
    return NextResponse.json({ error: "Failed to revoke session" }, { status: 500 });
  }
}
