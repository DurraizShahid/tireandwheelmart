"use client";

import { ReactNode, useState } from "react";
import { VendorSidebar } from "@/components/vendor-sidebar";
import { VendorHeader } from "@/components/vendor-header";

export default function VendorLayout({ children }: { children: ReactNode }) {
  const [collapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <VendorSidebar collapsed={collapsed} />
      <div className="flex-1 flex flex-col">
        <VendorHeader />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
