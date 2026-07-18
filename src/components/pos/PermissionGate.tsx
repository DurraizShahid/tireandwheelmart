"use client"

import type React from "react";
import { useUser } from "@clerk/nextjs";
import { checkPOSPermission } from "@/lib/pos-auth";

interface PermissionGateProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGate({ permission, children, fallback }: PermissionGateProps) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  const role = user?.publicMetadata?.role as string | undefined;
  if (!role) return fallback ?? null;

  if (!checkPOSPermission(role as never, permission)) {
    return fallback ?? null;
  }

  return <>{children}</>;
}
