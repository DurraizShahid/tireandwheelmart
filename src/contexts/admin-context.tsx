"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface AdminContextType {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  return (
    <AdminContext.Provider value={{ sidebarCollapsed, toggleSidebar }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
}
