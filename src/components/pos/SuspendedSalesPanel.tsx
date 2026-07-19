"use client"

import { useEffect, useState, useCallback } from "react"
import type { POSSuspendedSale, POSCartItem, POSCustomer } from "@/lib/pos-types"
import { useTranslation } from "@/i18n/use-locale"
import { RefreshCw, Play, Trash2, Clock, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

interface SuspendedSalesPanelProps {
  onResume: (items: POSCartItem[], customer: POSCustomer | null) => void
}

function formatRelativeTime(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return "Just now"
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export function SuspendedSalesPanel({ onResume }: SuspendedSalesPanelProps) {
  const { t } = useTranslation()
  const [sales, setSales] = useState<POSSuspendedSale[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSales = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/pos/sales/suspended")
      if (!res.ok) throw new Error("Failed to fetch suspended sales")
      const data = await res.json()
      setSales(data)
    } catch {
      setSales([])
      toast.error("Failed to load suspended sales")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSales()
  }, [fetchSales])

  const handleResume = async (sale: POSSuspendedSale) => {
    try {
      const res = await fetch("/api/pos/sales/suspended", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ saleId: sale.id }),
      })
      if (!res.ok) throw new Error("Failed to resume sale")
      onResume(sale.items, sale.customer)
      setSales((prev) => prev.filter((s) => s.id !== sale.id))
      toast.success("Sale resumed")
    } catch {
      toast.error("Failed to resume sale")
    }
  }

  const handleDelete = async (saleId: string) => {
    try {
      const res = await fetch("/api/pos/sales/suspended", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ saleId }),
      })
      if (!res.ok) throw new Error("Failed to delete")
      setSales((prev) => prev.filter((s) => s.id !== saleId))
      toast.success("Suspended sale deleted")
    } catch {
      toast.error("Failed to delete suspended sale")
    }
  }

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (sales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Inbox className="h-7 w-7 text-muted-foreground/50" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">{t("pos.no_suspended_sales") || "No suspended sales"}</p>
        <p className="mt-1 text-xs text-muted-foreground/60">Start a sale and suspend it to see it here</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-sm font-semibold">
          {t("pos.suspended_sales") || "Suspended Sales"} ({sales.length})
        </h3>
        <Button variant="ghost" size="icon" className="h-8 w-8 min-h-[44px] min-w-[44px] active:scale-[0.97] transition-all duration-150" onClick={fetchSales} aria-label="Refresh">
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-3">
          {sales.map((sale) => (
            <div key={sale.id} className="flex items-start gap-3 rounded-xl border bg-card p-3 shadow-sm transition-all duration-150 hover:shadow-md">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatRelativeTime(sale.created_at)}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
                    {sale.items.length} {t("pos.items")}
                  </span>
                </div>
                <p className="mt-1.5 text-base font-bold text-foreground">${sale.total.toFixed(2)}</p>
                {sale.customer && (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground flex items-center gap-1">
                    {sale.customer.first_name} {sale.customer.last_name}
                  </p>
                )}
                {sale.notes && (
                  <p className="mt-1 truncate text-[11px] text-muted-foreground/60 italic">&quot;{sale.notes}&quot;</p>
                )}
              </div>
              <div className="flex shrink-0 gap-1.5 pt-0.5">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 min-h-[44px] min-w-[44px] active:scale-[0.97] transition-all duration-150 focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => handleResume(sale)}
                  aria-label="Resume sale"
                  title="Resume"
                >
                  <Play className="h-3.5 w-3.5 text-green-600" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 min-h-[44px] min-w-[44px] active:scale-[0.97] transition-all duration-150 focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => handleDelete(sale.id)}
                  aria-label="Delete suspended sale"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
