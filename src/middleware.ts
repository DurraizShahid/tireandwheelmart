import { clerkClient, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isVendorRoute = createRouteMatcher(["/vendor(.*)"]);

async function getUserRole(userId: string): Promise<string | undefined> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return user.publicMetadata?.role as string | undefined;
}

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();

  let role: string | undefined;
  const metadata = (sessionClaims as Record<string, unknown> | null)?.["public_metadata"] as
    | { role?: string }
    | undefined;
  role = metadata?.role;

  if (!role && userId) {
    role = await getUserRole(userId);
  }

  // Protect admin routes — require signed-in user with admin role
  if (isAdminRoute(request)) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect_url", request.url);
      return NextResponse.redirect(signInUrl);
    }

    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return;
  }

  // Protect vendor routes — require signed-in user with vendor role
  if (isVendorRoute(request)) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect_url", request.url);
      return NextResponse.redirect(signInUrl);
    }

    if (role !== "vendor" && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return;
  }

  // All other routes are public — no auth required
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
