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
  Building2,
  FileDigit,
  Phone,
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

const STORE_INFO = {
  name: "Tire & Wheel Mart",
  address: "1234 Auto Lane, Suite 100",
  cityStateZip: "Phoenix, AZ 85001",
  phone: "(602) 555-0123",
  taxId: "TX-47-1234567",
};

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

function formatCurrency(amount: number): string {
  return `$${Math.abs(amount).toFixed(2)}`;
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
    <div className="space-y-6 print:space-y-0">
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #receipt-area, #receipt-area * { visibility: visible; }
          #receipt-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm;
            padding: 0;
            margin: 0;
            font-size: 10px;
          }
          #receipt-area .no-print { display: none !important; }
          #receipt-area .print-only { display: block !important; }
          @page { margin: 0; size: 80mm auto; }
        }
        .print-only { display: none; }
      `}</style>

      <div id="receipt-area" className="mx-auto max-w-sm rounded-xl border bg-white p-6 shadow-sm dark:bg-black">
        <div className="text-center">
          <div className="mb-1 flex items-center justify-center gap-1.5">
            <Store className="h-4 w-4 text-primary print-only" />
            <h2 className="text-base font-bold tracking-tight">
              {STORE_INFO.name}
            </h2>
          </div>
          <div className="mt-1 space-y-0.5 text-[10px] text-muted-foreground">
            <div className="flex items-center justify-center gap-1">
              <Building2 className="h-2.5 w-2.5" />
              <span>{STORE_INFO.address}</span>
            </div>
            <span>{STORE_INFO.cityStateZip}</span>
            <div className="flex items-center justify-center gap-1">
              <Phone className="h-2.5 w-2.5" />
              <span>{STORE_INFO.phone}</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <FileDigit className="h-2.5 w-2.5" />
              <span>Tax ID: {STORE_INFO.taxId}</span>
            </div>
          </div>
          <h3 className="mt-2 text-xs text-muted-foreground">
            {t("pos.receipt")}
          </h3>
        </div>

        <Separator className="my-3" />

        <div className="space-y-1 text-[10px]">
          <div className="flex items-center gap-1">
            <Hash className="h-2.5 w-2.5 text-muted-foreground" />
            <span className="text-muted-foreground">{t("pos.order")}:</span>
            <span className="font-medium">{receipt.order_number}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-2.5 w-2.5 text-muted-foreground" />
            <span className="text-muted-foreground">{t("pos.date")}:</span>
            <span className="font-medium">
              {formatDate(receipt.created_at)} {formatTime(receipt.created_at)}
            </span>
          </div>
          {receipt.cashier && (
            <div className="flex items-center gap-1">
              <User className="h-2.5 w-2.5 text-muted-foreground" />
              <span className="text-muted-foreground">{t("pos.cashier")}:</span>
              <span className="font-medium">{receipt.cashier}</span>
            </div>
          )}
        </div>

        {receipt.customer && (
          <>
            <Separator className="my-3" />
            <div className="space-y-0.5 text-[10px]">
              <p className="text-muted-foreground">{t("pos.customer")}:</p>
              <p className="font-medium">{receipt.customer.name}</p>
              {receipt.customer.email && (
                <p className="text-muted-foreground">{receipt.customer.email}</p>
              )}
            </div>
          </>
        )}

        <Separator className="my-3" />

        <table className="w-full text-[10px]">
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
                <td className="py-0.5 pr-2 leading-tight">{item.name}</td>
                <td className="py-0.5 text-right tabular-nums">{item.quantity}</td>
                <td className="py-0.5 text-right tabular-nums">{formatCurrency(item.unit_price)}</td>
                <td className="py-0.5 text-right font-medium tabular-nums">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Separator className="my-3" />

        <div className="space-y-0.5 text-[10px]">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("pos.subtotal")}</span>
            <span className="tabular-nums">{formatCurrency(receipt.subtotal)}</span>
          </div>
          {receipt.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("pos.discount")}</span>
              <span className="text-destructive tabular-nums">-{formatCurrency(receipt.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("pos.tax")}</span>
            <span className="tabular-nums">{formatCurrency(receipt.tax)}</span>
          </div>
          <Separator className="my-0.5" />
          <div className="flex justify-between text-xs font-bold">
            <span>{t("pos.total")}</span>
            <span className="tabular-nums">{formatCurrency(receipt.total)}</span>
          </div>
        </div>

        {receipt.payments.length > 0 && (
          <>
            <Separator className="my-3" />
            <div className="space-y-0.5 text-[10px]">
              <p className="text-muted-foreground">{t("pos.payments")}:</p>
              {receipt.payments.map((payment, i) => (
                <div key={i} className="flex justify-between">
                  <span className="capitalize">{payment.method.replace(/_/g, " ")}</span>
                  <span className="tabular-nums">{formatCurrency(payment.amount)}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <Separator className="my-3" />

        <p className="text-center text-[9px] text-muted-foreground">
          {t("pos.receipt_footer")}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row no-print">
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
