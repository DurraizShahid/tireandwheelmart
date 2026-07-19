import { clerkClient, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isPOSAllowed } from "@/lib/pos-auth";
import { getRolePortal } from "@/lib/auth-types";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isVendorRoute = createRouteMatcher(["/vendor(.*)"]);
const isPOSRoute = createRouteMatcher(["/pos(.*)"]);

const isPublicAuthRoute = createRouteMatcher([
  "/login",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/unauthorized",
  "/pos/unauthorized",
]);

async function getUserRole(userId: string): Promise<string | undefined> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return user.publicMetadata?.role as string | undefined;
}

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();
  const { pathname } = request.nextUrl;

  // Public auth pages — always allow (prevent redirect loops)
  if (isPublicAuthRoute(request) || pathname.startsWith("/admin/login") || pathname.startsWith("/pos/login")) {
    return;
  }

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
      const signInUrl = new URL("/admin/login", request.url);
      signInUrl.searchParams.set("redirect_url", request.url);
      return NextResponse.redirect(signInUrl);
    }
    if (role !== "admin" && role !== "super_admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    return;
  }

  // Protect vendor routes — require signed-in user with vendor or admin role
  if (isVendorRoute(request)) {
    if (!userId) {
      const signInUrl = new URL("/login", request.url);
      signInUrl.searchParams.set("redirect_url", request.url);
      return NextResponse.redirect(signInUrl);
    }
    if (role !== "vendor" && role !== "admin" && role !== "super_admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    return;
  }

  // Protect POS routes — require signed-in user with POS role
  if (isPOSRoute(request)) {
    if (!userId) {
      const signInUrl = new URL("/pos/login", request.url);
      signInUrl.searchParams.set("redirect_url", request.url);
      return NextResponse.redirect(signInUrl);
    }
    if (!isPOSAllowed(role)) {
      return NextResponse.redirect(new URL("/pos/unauthorized", request.url));
    }
    return;
  }

  // After sign-in, redirect authenticated users to their portal
  if (userId && role && pathname === "/") {
    const portal = getRolePortal(role);
    if (portal !== "public") {
      return NextResponse.redirect(new URL(`/${portal}`, request.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
