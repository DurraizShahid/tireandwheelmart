"use client"

import type { ReactNode } from "react"
import { PosHeader } from "@/components/pos/PosHeader"

export default function ReceiptsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <PosHeader onNewSale={() => window.location.href = "/pos"} cartEmpty />
      <main className="p-6">{children}</main>
    </div>
  )
}
