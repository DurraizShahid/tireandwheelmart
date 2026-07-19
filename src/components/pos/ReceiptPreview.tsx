"use client"

import { useState } from "react"
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
  Barcode,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

const BARCODE_PATTERN = [2, 4, 1, 3, 5, 2, 4, 3, 1, 5, 2, 3, 4, 1, 3, 2, 5, 1, 4, 3, 2, 4, 1, 5, 3, 2, 4, 1, 3, 5]

interface ReceiptPreviewProps {
  receipt: POSReceipt | null
  loading?: boolean
  layout?: "thermal" | "a4"
  onPrint: () => void
  onEmail: () => void
  onNewSale: () => void
  onDownloadPdf?: () => void
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
  layout: propLayout,
  onPrint,
  onEmail,
  onNewSale,
  onDownloadPdf,
}: ReceiptPreviewProps) {
  const { t } = useTranslation()
  const [layout, setLayout] = useState<"thermal" | "a4">(propLayout ?? "thermal")

  const currentLayout = propLayout ?? layout

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

  const handleEmailClick = () => {
    onEmail()
    toast.success("Receipt emailed successfully")
  }

  const layoutToggle = propLayout === undefined && (
    <div className="flex items-center gap-1 rounded-lg border p-0.5 bg-muted/50 no-print">
      <button
        onClick={() => setLayout("thermal")}
        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
          currentLayout === "thermal"
            ? "bg-background shadow-sm text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        80mm
      </button>
      <button
        onClick={() => setLayout("a4")}
        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
          currentLayout === "a4"
            ? "bg-background shadow-sm text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        A4 Invoice
      </button>
    </div>
  )

  return (
    <div className="space-y-6 print:space-y-0">
      <style jsx global>{`
        .layout-thermal .print-only { display: none; }

        @media print {
          @page { size: 80mm auto; margin: 0; }
          html, body { margin: 0 !important; padding: 0 !important; overflow: hidden !important; height: auto !important; }
          body > * { visibility: hidden !important; height: 0 !important; overflow: hidden !important; }
          #receipt-area { visibility: visible !important; }
          #receipt-area * { visibility: visible !important; }
          #receipt-area {
            position: fixed !important;
            left: 50% !important;
            top: 0 !important;
            transform: translateX(-50%) !important;
            width: 80mm !important;
            padding: 0 !important;
            margin: 0 !important;
            font-size: 10px !important;
            background: white !important;
            color: black !important;
          }
          #receipt-area .no-print { display: none !important; }
          #receipt-area .print-only { display: block !important; }
        }

        @media print {
          @page { size: A4; margin: 15mm 20mm; }
          #receipt-area-a4 { visibility: visible !important; }
          #receipt-area-a4 * { visibility: visible !important; }
          #receipt-area-a4 {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            color: black !important;
          }
          #receipt-area-a4 .no-print { display: none !important; }
          #receipt-area-a4 .page-break { page-break-before: always; }
        }
      `}</style>

      {/* ── Thermal layout ── */}
      {currentLayout === "thermal" && (
        <div id="receipt-area" className="mx-auto max-w-sm rounded-xl border bg-white p-6 shadow-sm layout-thermal">
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

          <div className="mt-3 rounded-md border-2 border-dashed border-primary/20 bg-primary/5 p-2 text-center">
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Receipt #</p>
            <p className="text-sm font-bold tracking-tight">{receipt.order_number}</p>
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

          {/* Barcode placeholder */}
          <div className="flex flex-col items-center gap-1 py-1">
            <div className="flex items-end gap-[1px]">
              {BARCODE_PATTERN.map((w, i) => (
                <div
                  key={i}
                  className="bg-foreground/40"
                  style={{ width: `${w}px`, height: `${12 + (i % 3) * 5}px` }}
                />
              ))}
            </div>
            <span className="text-[8px] text-muted-foreground tracking-[2px]">{receipt.order_number}</span>
          </div>

          <p className="text-center text-[9px] text-muted-foreground">
            {t("pos.receipt_footer")}
          </p>
        </div>
      )}

      {/* ── A4 Invoice layout ── */}
      {currentLayout === "a4" && (
        <div id="receipt-area-a4" className="layout-a4">
          <div className="mx-auto max-w-[210mm] rounded-xl border bg-white p-8 shadow-sm">
            {/* Letterhead */}
            <div className="flex items-start justify-between border-b-2 border-primary/20 pb-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{STORE_INFO.name}</h1>
                <div className="mt-1 space-y-0.5 text-sm text-muted-foreground">
                  <p>{STORE_INFO.address}</p>
                  <p>{STORE_INFO.cityStateZip}</p>
                  <p>{STORE_INFO.phone}</p>
                  <p>Tax ID: {STORE_INFO.taxId}</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-lg font-semibold uppercase tracking-wider text-muted-foreground/60">
                  Invoice
                </h2>
                <p className="mt-2 text-sm font-medium">{receipt.order_number}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(receipt.created_at)} {formatTime(receipt.created_at)}
                </p>
              </div>
            </div>

            {/* Customer */}
            {receipt.customer && (
              <div className="mt-6 rounded-lg bg-muted/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Bill To
                </p>
                <p className="mt-1 font-medium">{receipt.customer.name}</p>
                {receipt.customer.email && (
                  <p className="text-sm text-muted-foreground">{receipt.customer.email}</p>
                )}
              </div>
            )}

            {/* Items table */}
            <table className="mt-6 w-full text-sm">
              <thead>
                <tr className="border-b-2 border-muted-foreground/20">
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Item
                  </th>
                  <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Unit Price
                  </th>
                  <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Qty
                  </th>
                  <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {receipt.items.map((item, i) => (
                  <tr key={i} className="border-b border-muted/30">
                    <td className="py-3 pr-4 font-medium">{item.name}</td>
                    <td className="py-3 text-right tabular-nums">{formatCurrency(item.unit_price)}</td>
                    <td className="py-3 text-right tabular-nums">{item.quantity}</td>
                    <td className="py-3 text-right font-medium tabular-nums">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="mt-6 flex justify-end">
              <div className="w-72 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="tabular-nums">{formatCurrency(receipt.subtotal)}</span>
                </div>
                {receipt.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-destructive tabular-nums">-{formatCurrency(receipt.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="tabular-nums">{formatCurrency(receipt.tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="tabular-nums">{formatCurrency(receipt.total)}</span>
                </div>
              </div>
            </div>

            {/* Payments */}
            {receipt.payments.length > 0 && (
              <div className="mt-6 border-t border-muted/30 pt-4">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Payment Details
                </h4>
                <div className="w-72 space-y-1 text-sm">
                  {receipt.payments.map((payment, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="capitalize text-muted-foreground">
                        {payment.method.replace(/_/g, " ")}
                      </span>
                      <span className="tabular-nums">{formatCurrency(payment.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Signature */}
            <div className="mt-10 pt-6 border-t border-muted/30">
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-muted-foreground">Authorized Signature</p>
                  <div className="mt-6 w-52 border-b border-muted-foreground/30" />
                  <p className="mt-1 text-xs text-muted-foreground/60">Signature</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{STORE_INFO.name}</p>
                  <p className="text-sm text-muted-foreground">{receipt.order_number}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Action buttons ── */}
      <div className="flex flex-col gap-3 sm:flex-row no-print">
        <div className="flex items-center gap-2 flex-1">
          {layoutToggle}
        </div>
        <Button
          variant="outline"
          size="lg"
          className="min-h-[48px]"
          onClick={onPrint}
        >
          <Printer className="mr-2 h-5 w-5" />
          {t("pos.print_receipt")}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="min-h-[48px]"
          onClick={handleEmailClick}
        >
          <Mail className="mr-2 h-5 w-5" />
          {t("pos.email_receipt")}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="min-h-[48px]"
          onClick={() => window.print()}
        >
          <FileDigit className="mr-2 h-5 w-5" />
          Download PDF
        </Button>
        <Button
          size="lg"
          className="min-h-[48px]"
          onClick={onNewSale}
        >
          <Plus className="mr-2 h-5 w-5" />
          {t("pos.new_sale")}
        </Button>
      </div>
    </div>
  )
}
