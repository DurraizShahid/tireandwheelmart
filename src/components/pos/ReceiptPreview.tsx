"use client"

import type { POSReceipt } from "@/lib/pos-types"
import { useTranslation } from "@/i18n/use-locale"
import {
  Printer,
  Mail,
  Plus,
  Store,
  Hash,
  Calendar,
  User,
  Receipt,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

interface ReceiptPreviewProps {
  receipt: POSReceipt | null
  loading?: boolean
  onPrint: () => void
  onEmail: () => void
  onNewSale: () => void
}

function ReceiptSkeleton() {
  return (
    <div className="mx-auto max-w-sm space-y-4 bg-white p-8 dark:bg-black">
      <div className="space-y-2 text-center">
        <Skeleton className="mx-auto h-5 w-40" />
        <Skeleton className="mx-auto h-3 w-24" />
        <Skeleton className="mx-auto h-3 w-36" />
      </div>
      <Separator />
      <div className="space-y-2">
        <Skeleton className="h-3 w-56" />
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-3 w-52" />
      </div>
      <Separator />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex justify-between">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
      <Separator />
      <div className="space-y-1">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </div>
  )
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch {
    return dateStr
  }
}

function formatTime(dateStr: string) {
  try {
    const d = new Date(dateStr)
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return ""
  }
}

export function ReceiptPreview({
  receipt,
  loading,
  onPrint,
  onEmail,
  onNewSale,
}: ReceiptPreviewProps) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className="flex justify-center p-6">
        <ReceiptSkeleton />
      </div>
    )
  }

  if (!receipt) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Receipt className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h3 className="text-lg font-medium text-muted-foreground">
          {t("pos.no_receipt")}
        </h3>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-sm rounded-xl border bg-white p-6 shadow-sm dark:bg-black">
        <div className="text-center">
          <div className="mb-1 flex items-center justify-center gap-1.5">
            <Store className="h-4 w-4 text-primary" />
            <h2 className="text-base font-bold tracking-tight">
              Tire &amp; Wheel Mart
            </h2>
          </div>
          <h3 className="text-xs text-muted-foreground">
            {t("pos.receipt")}
          </h3>
        </div>

        <Separator className="my-4" />

        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5">
            <Hash className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">
              {t("pos.order")}:
            </span>
            <span className="font-medium">{receipt.order_number}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">
              {t("pos.date")}:
            </span>
            <span className="font-medium">
              {formatDate(receipt.created_at)} {formatTime(receipt.created_at)}
            </span>
          </div>
          {receipt.cashier && (
            <div className="flex items-center gap-1.5">
              <User className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">
                {t("pos.cashier")}:
              </span>
              <span className="font-medium">{receipt.cashier}</span>
            </div>
          )}
        </div>

        {receipt.customer && (
          <>
            <Separator className="my-4" />
            <div className="space-y-1 text-xs">
              <p className="text-muted-foreground">{t("pos.customer")}:</p>
              <p className="font-medium">{receipt.customer.name}</p>
              {receipt.customer.email && (
                <p className="text-muted-foreground">
                  {receipt.customer.email}
                </p>
              )}
            </div>
          </>
        )}

        <Separator className="my-4" />

        <table className="w-full text-xs">
          <thead>
            <tr className="text-muted-foreground">
              <th className="pb-1 text-left font-medium">{t("pos.item")}</th>
              <th className="pb-1 text-right font-medium">{t("pos.qty")}</th>
              <th className="pb-1 text-right font-medium">{t("pos.price")}</th>
              <th className="pb-1 text-right font-medium">{t("pos.total")}</th>
            </tr>
          </thead>
          <tbody>
            {receipt.items.map((item, i) => (
              <tr key={i}>
                <td className="py-1 pr-2 leading-tight">{item.name}</td>
                <td className="py-1 text-right tabular-nums">
                  {item.quantity}
                </td>
                <td className="py-1 text-right tabular-nums">
                  ${item.unit_price.toFixed(2)}
                </td>
                <td className="py-1 text-right font-medium tabular-nums">
                  ${item.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Separator className="my-4" />

        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {t("pos.subtotal")}
            </span>
            <span className="tabular-nums">${receipt.subtotal.toFixed(2)}</span>
          </div>
          {receipt.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t("pos.discount")}
              </span>
              <span className="text-destructive tabular-nums">
                -${receipt.discount.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("pos.tax")}</span>
            <span className="tabular-nums">${receipt.tax.toFixed(2)}</span>
          </div>
          <Separator className="my-1" />
          <div className="flex justify-between text-sm font-bold">
            <span>{t("pos.total")}</span>
            <span className="tabular-nums">${receipt.total.toFixed(2)}</span>
          </div>
        </div>

        {receipt.payments.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="space-y-1 text-xs">
              <p className="text-muted-foreground">
                {t("pos.payments")}:
              </p>
              {receipt.payments.map((payment, i) => (
                <div key={i} className="flex justify-between">
                  <span className="capitalize">{payment.method.replace(/_/g, " ")}</span>
                  <span className="tabular-nums">
                    ${payment.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        <Separator className="my-4" />

        <p className="text-center text-[10px] text-muted-foreground">
          {t("pos.receipt_footer")}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="outline"
          size="lg"
          className="flex-1 min-h-[48px]"
          onClick={onPrint}
        >
          <Printer className="mr-2 h-5 w-5" />
          {t("pos.print_receipt")}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="flex-1 min-h-[48px]"
          onClick={onEmail}
        >
          <Mail className="mr-2 h-5 w-5" />
          {t("pos.email_receipt")}
        </Button>
        <Button
          size="lg"
          className="flex-1 min-h-[48px]"
          onClick={onNewSale}
        >
          <Plus className="mr-2 h-5 w-5" />
          {t("pos.new_sale")}
        </Button>
      </div>
    </div>
  )
}
