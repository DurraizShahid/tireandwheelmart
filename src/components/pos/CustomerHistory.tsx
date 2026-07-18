"use client"

import { useEffect, useState, useCallback } from "react"
import { useTranslation } from "@/i18n/use-locale"
import { Clock, RefreshCw } from "lucide-react"
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
      <div className="space-y-3 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Clock className="mb-3 h-10 w-10 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">{t("pos.no_orders") || "No orders yet"}</p>
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
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={fetchOrders}>
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {orders.map((order) => (
            <button
              key={order.id}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
              onClick={() => onSelectOrder?.(order.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{order.order_number}</span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0 ${statusColor[order.status] || ""}`}
                  >
                    {order.status}
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className="text-sm font-semibold">${order.total.toFixed(2)}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
