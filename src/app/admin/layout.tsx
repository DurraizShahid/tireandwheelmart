"use client";

import { AdminProvider } from "@/contexts/admin-context";
import { ReactNode } from "react";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AdminProvider>
      {children}
    </AdminProvider>
  );
}
