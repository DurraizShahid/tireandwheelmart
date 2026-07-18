import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isPOSAllowed } from "@/lib/pos-auth";

export default async function POSAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, sessionClaims } = await auth();

  let role: string | undefined;
  const metadata = (sessionClaims as Record<string, unknown> | null)?.["public_metadata"] as
    | { role?: string }
    | undefined;
  role = metadata?.role;

  if (!role && userId) {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    role = user.publicMetadata?.role as string | undefined;
  }

  if (!isPOSAllowed(role)) {
    redirect("/pos/unauthorized");
  }

  return <>{children}</>;
}
