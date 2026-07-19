"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DollarSign,
  RefreshCw,
  Printer,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus,
  Banknote,
  CreditCard,
  ShoppingBag,
  RotateCcw,
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
      <Badge variant="outline" className="border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 gap-1.5 px-2.5 py-1 text-xs font-medium">
        <ArrowUp className="h-3 w-3" />
        Surplus {currencyFormatter.format(variance)}
      </Badge>
    )
  }
  if (variance < 0) {
    return (
      <Badge variant="outline" className="border-red-500 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 gap-1.5 px-2.5 py-1 text-xs font-medium">
        <ArrowDown className="h-3 w-3" />
        Shortage {currencyFormatter.format(Math.abs(variance))}
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="border-muted-foreground bg-muted/50 text-muted-foreground gap-1.5 px-2.5 py-1 text-xs font-medium">
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
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <Skeleton className="h-5 w-32" />
          <div className="flex gap-1">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-28" />
              </div>
            ))}
          </div>
          <Separator />
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <div className="space-y-1.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!summary) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="mb-3 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Clock className="h-6 w-6 text-muted-foreground/50" />
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground">No shift summary available</p>
          <p className="mt-1 text-xs text-muted-foreground/60">Open the register to start tracking your shift</p>
        </CardContent>
      </Card>
    )
  }

  const { shift, total_sales, total_orders, total_refunds, cash_sales, card_sales, payment_breakdown } = summary

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base font-semibold">Shift Summary</CardTitle>
        <div className="flex items-center gap-1">
          {onRefresh && (
            <Button variant="ghost" size="icon" className="h-8 w-8 min-h-[44px] min-w-[44px] active:scale-[0.97] transition-all duration-150" onClick={onRefresh} aria-label="Refresh summary">
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          {onPrint && (
            <Button variant="ghost" size="icon" className="h-8 w-8 min-h-[44px] min-w-[44px] active:scale-[0.97] transition-all duration-150" onClick={onPrint} aria-label="Print summary">
              <Printer className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent ref={printRef} className="space-y-5 print:space-y-3">
        {/* Shift Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-muted/50 p-3">
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              <Clock className="h-3 w-3" />
              Opened
            </span>
            <p className="mt-1 font-semibold">{formatTime(shift.opened_at)}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              <Clock className="h-3 w-3" />
              Closed
            </span>
            <p className="mt-1 font-semibold">{shift.closed_at ? formatTime(shift.closed_at) : "—"}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              <Clock className="h-3 w-3" />
              Duration
            </span>
            <p className="mt-1 font-semibold flex items-center gap-1">
              {formatDuration(shift.opened_at, shift.closed_at)}
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <span className="block text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Status</span>
            <p className="mt-1 font-semibold capitalize">{shift.status}</p>
          </div>
        </div>

        <Separator />

        {/* Totals */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Sales Overview</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border bg-card p-3 space-y-1">
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                <ShoppingBag className="h-3 w-3" />
                Total Sales
              </span>
              <p className="text-lg font-bold">{currencyFormatter.format(total_sales)}</p>
            </div>
            <div className="rounded-lg border bg-card p-3 space-y-1">
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                <ShoppingBag className="h-3 w-3" />
                Total Orders
              </span>
              <p className="text-lg font-bold">{total_orders}</p>
            </div>
            <div className="rounded-lg border bg-card p-3 space-y-1">
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                <RotateCcw className="h-3 w-3" />
                Refunds
              </span>
              <p className="font-semibold text-red-500">{total_refunds}</p>
            </div>
            <div className="rounded-lg border bg-card p-3 space-y-1">
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                <Banknote className="h-3 w-3" />
                Cash Sales
              </span>
              <p className="font-semibold">{currencyFormatter.format(cash_sales)}</p>
            </div>
            <div className="col-span-2 rounded-lg border bg-card p-3 space-y-1">
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                <CreditCard className="h-3 w-3" />
                Card Sales
              </span>
              <p className="font-semibold">{currencyFormatter.format(card_sales)}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Cash Drawer */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Cash Drawer</h4>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between items-center rounded-lg bg-muted/30 px-3 py-2.5">
              <span className="text-muted-foreground">Opening Float</span>
              <span className="font-semibold">{currencyFormatter.format(shift.opening_cash)}</span>
            </div>
            <div className="flex justify-between items-center rounded-lg bg-muted/30 px-3 py-2.5">
              <span className="text-muted-foreground">Expected Cash</span>
              <span className="font-semibold">{currencyFormatter.format(shift.expected_closing_cash ?? 0)}</span>
            </div>
            <div className="flex justify-between items-center rounded-lg bg-muted/30 px-3 py-2.5">
              <span className="text-muted-foreground">Actual Cash</span>
              <span className="font-semibold">{currencyFormatter.format(shift.actual_closing_cash ?? 0)}</span>
            </div>
            <div className="flex justify-between items-center rounded-lg border border-border px-3 py-3 mt-1">
              <span className="font-semibold">Variance</span>
              <VarianceBadge variance={shift.variance ?? 0} />
            </div>
          </div>
        </div>

        <Separator />

        {/* Payment Breakdown */}
        {payment_breakdown.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Payment Breakdown
            </h4>
            <div className="space-y-2 text-sm">
              {payment_breakdown.map((pm) => (
                <div key={pm.method} className="flex justify-between items-center rounded-lg bg-muted/30 px-3 py-2.5">
                  <span className="capitalize font-medium">{pm.method.replace(/_/g, " ")}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">({pm.count})</span>
                    <span className="font-semibold tabular-nums">{currencyFormatter.format(pm.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {shift.notes && (
          <>
            <Separator />
            <div className="rounded-lg bg-muted/30 p-3 text-sm">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Notes</span>
              <p className="mt-1 text-foreground/80">{shift.notes}</p>
            </div>
          </>
        )}

        {/* Actions */}
        {shift.status === "open" && onCloseRegister && (
          <div className="pt-1 print:hidden">
            <Button className="w-full min-h-[44px] active:scale-[0.97] transition-all duration-150" variant="destructive" onClick={onCloseRegister}>
              <DollarSign className="h-4 w-4 mr-2" />
              Close Register
            </Button>
          </div>
        )}

        {onPrint && (
          <div className="pt-1 print:hidden">
            <Button className="w-full min-h-[44px] active:scale-[0.97] transition-all duration-150" variant="outline" onClick={onPrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print Summary
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
