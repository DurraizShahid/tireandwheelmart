"use client"

import { useEffect, useState, useCallback } from "react"
import { useTranslation } from "@/i18n/use-locale"
import { Clock, RefreshCw, ReceiptText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

interface CustomerOrderSummary {
  id: string
  order_number: string
  total: number
  status: string
  created_at: string
}

interface CustomerHistoryProps {
  customerId: string
  customerName: string
  onSelectOrder?: (orderId: string) => void
}

const statusColor: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  refunded: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
  partially_refunded: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
}

export function CustomerHistory({ customerId, customerName, onSelectOrder }: CustomerHistoryProps) {
  const { t } = useTranslation()
  const [orders, setOrders] = useState<CustomerOrderSummary[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/pos/customers/${customerId}/orders`)
      if (!res.ok) throw new Error("Failed to fetch orders")
      const data = await res.json()
      setOrders(data)
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [customerId])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  if (loading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border p-3">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-14" />
          </div>
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <ReceiptText className="h-7 w-7 text-muted-foreground/50" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">{t("pos.no_orders") || "No orders yet"}</p>
        <p className="mt-1 text-xs text-muted-foreground/60">Complete a checkout to see orders here</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold truncate">{customerName}</h3>
          <p className="text-xs text-muted-foreground">{orders.length} {t("pos.orders") || "orders"}</p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 min-h-[44px] min-w-[44px] shrink-0 active:scale-[0.97] transition-all duration-150" onClick={fetchOrders} aria-label="Refresh orders">
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1.5 p-3">
          {orders.map((order) => (
            <button
              key={order.id}
              className="flex w-full items-center gap-3 rounded-xl border bg-card p-3 text-left shadow-sm transition-all duration-150 hover:bg-accent hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 cursor-pointer"
              onClick={() => onSelectOrder?.(order.id)}
              aria-label={`${t("pos.order") || "Order"} ${order.order_number}`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <ReceiptText className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{order.order_number}</span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0 font-medium ${statusColor[order.status] || ""}`}
                  >
                    {order.status}
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className="text-sm font-bold text-primary">${order.total.toFixed(2)}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
