"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  DollarSign,
  RefreshCw,
  Printer,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react"
import type { POSShiftSummary } from "@/lib/pos-types"

interface ShiftSummaryProps {
  summary: POSShiftSummary | null
  loading?: boolean
  onRefresh?: () => void
  onPrint?: () => void
  onCloseRegister?: () => void
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatDuration(start: string, end?: string): string {
  const from = new Date(start)
  const to = end ? new Date(end) : new Date()
  const diffMs = to.getTime() - from.getTime()
  const hours = Math.floor(diffMs / 3600000)
  const minutes = Math.floor((diffMs % 3600000) / 60000)
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

function VarianceBadge({ variance }: { variance: number }) {
  if (variance > 0) {
    return (
      <Badge variant="outline" className="border-green-500 text-green-600 gap-1">
        <ArrowUp className="h-3 w-3" />
        Surplus {currencyFormatter.format(variance)}
      </Badge>
    )
  }
  if (variance < 0) {
    return (
      <Badge variant="outline" className="border-red-500 text-red-600 gap-1">
        <ArrowDown className="h-3 w-3" />
        Shortage {currencyFormatter.format(Math.abs(variance))}
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="border-muted-foreground text-muted-foreground gap-1">
      <Minus className="h-3 w-3" />
      Balanced
    </Badge>
  )
}

export function ShiftSummary({
  summary,
  loading,
  onRefresh,
  onPrint,
  onCloseRegister,
}: ShiftSummaryProps) {
  const printRef = useRef<HTMLDivElement>(null)

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!summary) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-sm text-muted-foreground">
          No shift summary available.
        </CardContent>
      </Card>
    )
  }

  const { shift, total_sales, total_orders, total_refunds, cash_sales, card_sales, payment_breakdown } = summary

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">Shift Summary</CardTitle>
        <div className="flex items-center gap-1">
          {onRefresh && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          {onPrint && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onPrint}>
              <Printer className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent ref={printRef} className="space-y-4 print:space-y-3">
        {/* Shift Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Opened</span>
            <p className="font-medium">{formatTime(shift.opened_at)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Closed</span>
            <p className="font-medium">{shift.closed_at ? formatTime(shift.closed_at) : "—"}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Duration</span>
            <p className="font-medium flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(shift.opened_at, shift.closed_at)}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Status</span>
            <p className="font-medium capitalize">{shift.status}</p>
          </div>
        </div>

        <Separator />

        {/* Totals */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <span className="text-muted-foreground">Total Sales</span>
            <p className="text-lg font-bold">{currencyFormatter.format(total_sales)}</p>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">Total Orders</span>
            <p className="text-lg font-bold">{total_orders}</p>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">Refunds</span>
            <p className="font-medium text-red-500">{total_refunds}</p>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">Cash Sales</span>
            <p className="font-medium">{currencyFormatter.format(cash_sales)}</p>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">Card Sales</span>
            <p className="font-medium">{currencyFormatter.format(card_sales)}</p>
          </div>
        </div>

        <Separator />

        {/* Cash Drawer */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Cash Drawer
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Opening Float</span>
              <span>{currencyFormatter.format(shift.opening_cash)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expected Cash</span>
              <span>{currencyFormatter.format(shift.expected_closing_cash ?? 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Actual Cash</span>
              <span className="font-medium">{currencyFormatter.format(shift.actual_closing_cash ?? 0)}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="font-medium">Variance</span>
              <VarianceBadge variance={shift.variance ?? 0} />
            </div>
          </div>
        </div>

        <Separator />

        {/* Payment Breakdown */}
        {payment_breakdown.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Payment Breakdown
            </h4>
            <div className="space-y-2 text-sm">
              {payment_breakdown.map((pm) => (
                <div key={pm.method} className="flex justify-between">
                  <span className="capitalize">{pm.method.replace(/_/g, " ")} ({pm.count})</span>
                  <span>{currencyFormatter.format(pm.total)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {shift.notes && (
          <>
            <Separator />
            <div className="text-sm">
              <span className="text-muted-foreground">Notes</span>
              <p className="mt-0.5">{shift.notes}</p>
            </div>
          </>
        )}

        {/* Actions */}
        {shift.status === "open" && onCloseRegister && (
          <div className="pt-2 print:hidden">
            <Button className="w-full" variant="destructive" onClick={onCloseRegister}>
              <DollarSign className="h-4 w-4 mr-2" />
              Close Register
            </Button>
          </div>
        )}

        {onPrint && (
          <div className="pt-1 print:hidden">
            <Button className="w-full" variant="outline" onClick={onPrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print Summary
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
