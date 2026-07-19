export type AppRole = "super_admin" | "admin" | "store_manager" | "cashier" | "vendor" | "customer";

export type AppPermission =
  | "canAccessAdmin"
  | "canAccessPOS"
  | "canAccessVendor"
  | "canManageInventory"
  | "canManageCRM"
  | "canManageOrders"
  | "canManageProducts"
  | "canManageCommunications"
  | "canManageAI"
  | "canViewReports"
  | "canManageUsers"
  | "canManageSettings";

export type Portal = "public" | "admin" | "pos" | "vendor";

export const ROLE_PERMISSIONS: Record<AppRole, AppPermission[]> = {
  super_admin: [
    "canAccessAdmin", "canAccessPOS", "canAccessVendor",
    "canManageInventory", "canManageCRM", "canManageOrders",
    "canManageProducts", "canManageCommunications", "canManageAI",
    "canViewReports", "canManageUsers", "canManageSettings",
  ],
  admin: [
    "canAccessAdmin", "canAccessPOS",
    "canManageInventory", "canManageCRM", "canManageOrders",
    "canManageProducts", "canManageCommunications", "canManageAI",
    "canViewReports", "canManageSettings",
  ],
  store_manager: [
    "canAccessPOS",
    "canManageInventory", "canManageOrders",
    "canViewReports",
  ],
  cashier: [
    "canAccessPOS",
  ],
  vendor: [
    "canAccessVendor",
    "canManageProducts", "canManageOrders",
  ],
  customer: [],
};

export const PORTAL_ROUTES: Record<Portal, string> = {
  public: "/",
  admin: "/admin",
  pos: "/pos",
  vendor: "/vendor",
};

export const PORTAL_LOGIN_ROUTES: Record<Portal, string> = {
  public: "/login",
  admin: "/admin/login",
  pos: "/pos/login",
  vendor: "/vendor/login",
};

export const ROLE_PORTAL: Record<AppRole, Portal> = {
  super_admin: "admin",
  admin: "admin",
  store_manager: "pos",
  cashier: "pos",
  vendor: "vendor",
  customer: "public",
};

export function hasPermission(role: AppRole | undefined, permission: AppPermission): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.includes(permission);
}

export function getRolePortal(role: string | undefined): Portal {
  if (!role) return "public";
  return ROLE_PORTAL[role as AppRole] || "public";
}

export function getPortalLoginUrl(portal: Portal): string {
  return PORTAL_LOGIN_ROUTES[portal];
}
