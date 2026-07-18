"use client"

import { useEffect, useState, useCallback } from "react"
import type { POSSuspendedSale, POSCartItem, POSCustomer } from "@/lib/pos-types"
import { useTranslation } from "@/i18n/use-locale"
import { RefreshCw, Play, Trash2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

interface SuspendedSalesPanelProps {
  onResume: (items: POSCartItem[], customer: POSCustomer | null) => void
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
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (sales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Clock className="mb-3 h-10 w-10 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">{t("pos.no_suspended_sales") || "No suspended sales"}</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-sm font-semibold">
          {t("pos.suspended_sales") || "Suspended Sales"} ({sales.length})
        </h3>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={fetchSales}>
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="divide-y p-3">
          {sales.map((sale) => (
            <div key={sale.id} className="flex items-start gap-3 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(sale.created_at).toLocaleString()}
                  </span>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium">
                    {sale.items.length} {t("pos.items")}
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold">${sale.total.toFixed(2)}</p>
                {sale.customer && (
                  <p className="truncate text-xs text-muted-foreground">
                    {sale.customer.first_name} {sale.customer.last_name}
                  </p>
                )}
                {sale.notes && (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground/70">{sale.notes}</p>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => handleResume(sale)}
                  title="Resume"
                >
                  <Play className="h-3.5 w-3.5 text-green-600" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => handleDelete(sale.id)}
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
