export type POSRole = "super_admin" | "admin" | "store_manager" | "cashier";

export const POS_ALLOWED_ROLES: POSRole[] = ["super_admin", "admin", "store_manager", "cashier"];

export const POS_PERMISSIONS: Record<POSRole, string[]> = {
  super_admin: [
    "process_sale",
    "process_refund",
    "apply_discount",
    "price_override",
    "void_sale",
    "open_register",
    "close_register",
    "view_register_history",
    "view_shift_summary",
    "view_audit_log",
    "manage_registers",
    "manage_stores",
    "manage_users",
    "view_reports",
    "view_analytics",
  ],
  admin: [
    "process_sale",
    "process_refund",
    "apply_discount",
    "price_override",
    "void_sale",
    "open_register",
    "close_register",
    "view_register_history",
    "view_shift_summary",
    "view_audit_log",
    "manage_registers",
    "manage_stores",
    "manage_users",
    "view_reports",
    "view_analytics",
  ],
  store_manager: [
    "process_sale",
    "process_refund",
    "apply_discount",
    "price_override",
    "void_sale",
    "open_register",
    "close_register",
    "view_register_history",
    "view_shift_summary",
    "manage_registers",
    "view_reports",
    "view_analytics",
  ],
  cashier: [
    "process_sale",
    "process_refund",
    "open_register",
    "close_register",
    "view_own_sales",
  ],
};

export function isPOSAllowed(role?: string): boolean {
  if (!role) return false;
  return POS_ALLOWED_ROLES.includes(role as POSRole);
}

export function checkPOSPermission(role: POSRole, action: string): boolean {
  const permissions = POS_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.includes(action);
}

export function getPOSPermissions(role: POSRole): string[] {
  return POS_PERMISSIONS[role] ?? [];
}
