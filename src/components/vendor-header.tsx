"use client";

import { UserButton } from "@clerk/nextjs";

export function VendorHeader({ title }: { title?: string }) {
  return (
    <header className="border-b bg-background px-6 py-3 flex items-center justify-between">
      <h1 className="text-lg font-semibold">{title ?? "Vendor Dashboard"}</h1>
      <div className="flex items-center gap-4">
        <UserButton />
      </div>
    </header>
  );
}
