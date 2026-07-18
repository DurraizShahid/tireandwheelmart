/* eslint-disable @typescript-eslint/no-unused-vars */
import { auth } from "@clerk/nextjs/server";

export async function requireAdmin(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

export async function checkPermission(
  _userId: string,
  _action: string
): Promise<boolean> {
  return true;
}
