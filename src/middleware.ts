import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isVendorRoute = createRouteMatcher(["/vendor(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (isPublicRoute(request)) return;

  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.publicMetadata as { role?: string })?.role;

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

  // Protect all other non-public routes
  await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
