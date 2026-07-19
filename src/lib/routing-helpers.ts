export type Portal = "public" | "admin" | "pos" | "vendor";

const PORTAL_BASE_URLS: Record<Portal, string> = {
  public: process.env.NEXT_PUBLIC_PORTAL_URL || "",
  admin: process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || "",
  pos: process.env.NEXT_PUBLIC_POS_PORTAL_URL || "",
  vendor: process.env.NEXT_PUBLIC_VENDOR_PORTAL_URL || "",
};

export function getPortalBaseUrl(portal: Portal): string {
  return PORTAL_BASE_URLS[portal] || process.env.NEXT_PUBLIC_APP_URL || "";
}

export function portalUrl(portal: Portal, path: string = "/"): string {
  const base = getPortalBaseUrl(portal);
  if (!base) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function adminUrl(path: string = "/"): string {
  return portalUrl("admin", path);
}

export function posUrl(path: string = "/"): string {
  return portalUrl("pos", path);
}
