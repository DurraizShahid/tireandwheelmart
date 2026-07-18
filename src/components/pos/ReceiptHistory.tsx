"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Receipt, Printer } from "lucide-react"
import type { POSOrder } from "@/lib/pos-types"

export function ReceiptHistory() {
  const router = useRouter()
  const [orders, setOrders] = useState<POSOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("status", "confirmed")
      params.set("limit", "10")
      params.set("offset", String(page * 10))

      const res = await fetch(`/api/pos/orders?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      const list = Array.isArray(data) ? data : []
      setOrders(list)
      setHasMore(list.length === 10)
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const filtered = searchQuery.trim()
    ? orders.filter(
        (o) =>
          o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (o.customer_name && o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : orders

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (!loading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Receipt className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h3 className="text-lg font-medium text-muted-foreground">No completed orders</h3>
        <p className="text-sm text-muted-foreground/60 mt-1">Completed orders will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by order number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="divide-y rounded-xl border bg-card">
        {filtered.map((order) => (
          <div key={order.id} className="flex items-center justify-between px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{order.order_number}</span>
                <Badge variant="outline" className="text-[10px]">
                  {order.status.replace(/_/g, " ")}
                </Badge>
              </div>
              <div className="mt-0.5 flex items-center gap-3 text-sm text-muted-foreground">
                <span>
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="font-medium tabular-nums">${order.total.toFixed(2)}</span>
                {order.customer_name && <span className="truncate">{order.customer_name}</span>}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 ml-3"
              onClick={() => router.push(`/pos/receipts/${order.id}`)}
            >
              <Printer className="mr-1.5 h-3.5 w-3.5" />
              Reprint
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        >
          Previous
        </Button>
        <span>Page {page + 1}</span>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasMore}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
