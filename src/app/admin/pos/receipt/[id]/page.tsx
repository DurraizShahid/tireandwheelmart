"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Printer, Mail, AlertCircle } from "lucide-react";
import { useTranslation } from "@/i18n/use-locale";
import type { POSReceipt } from "@/lib/pos-types";

export default function ReceiptDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const [receipt, setReceipt] = useState<POSReceipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const id = params?.id;
    if (!id) return;
    setLoading(true);
    setError(false);
    fetch(`/api/admin/pos/receipt/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setReceipt(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params?.id]);

  const handlePrint = () => window.print();

  const handleEmail = () => {
    console.log("Email receipt:", receipt?.order_number);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t("pos.receiptNotFound")}</h2>
          <p className="text-muted-foreground mb-6">{t("pos.receiptNotFoundDesc")}</p>
          <Link href="/admin/pos">
            <Button variant="default">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("pos.backToPOS")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6 no-print">
          <Link href="/admin/pos">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("pos.backToPOS")}
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleEmail}>
              <Mail className="h-4 w-4 mr-2" />
              {t("pos.emailReceipt")}
            </Button>
            <Button variant="default" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              {t("pos.print")}
            </Button>
          </div>
        </div>

        <div
          id="receipt-content"
          className="bg-card border rounded-lg shadow-sm p-8 print:shadow-none print:border-0 print:p-0"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">{t("pos.storeName")}</h1>
            <p className="text-sm text-muted-foreground">{t("pos.receipt")}</p>
          </div>

          <div className="text-center mb-6">
            <p className="text-lg font-semibold">{receipt.order_number}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(receipt.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              {new Date(receipt.created_at).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            {receipt.cashier && (
              <p className="text-sm text-muted-foreground">
                {t("pos.cashier")}: {receipt.cashier}
              </p>
            )}
          </div>

          {receipt.customer && (
            <div className="mb-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium">{receipt.customer.name}</p>
              <p className="text-sm text-muted-foreground">{receipt.customer.email}</p>
            </div>
          )}

          <Separator className="mb-4" />

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm font-medium text-muted-foreground pb-2">
              <span className="flex-1">{t("pos.item")}</span>
              <span className="w-16 text-right">{t("pos.qty")}</span>
              <span className="w-24 text-right">{t("pos.price")}</span>
              <span className="w-24 text-right">{t("pos.total")}</span>
            </div>
            {receipt.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm py-1">
                <span className="flex-1 truncate mr-2">{item.name}</span>
                <span className="w-16 text-right text-muted-foreground">{item.quantity}</span>
                <span className="w-24 text-right text-muted-foreground">
                  ${item.unit_price.toFixed(2)}
                </span>
                <span className="w-24 text-right font-medium">${item.total.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <Separator className="mb-4" />

          <div className="space-y-1 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("pos.subtotal")}</span>
              <span>${receipt.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("pos.tax")}</span>
              <span>${receipt.tax.toFixed(2)}</span>
            </div>
            {receipt.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("pos.discount")}</span>
                <span className="text-green-600">-${receipt.discount.toFixed(2)}</span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>{t("pos.total")}</span>
              <span>${receipt.total.toFixed(2)}</span>
            </div>
          </div>

          {receipt.payments.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                {t("pos.payments")}
              </h4>
              {receipt.payments.map((pmt, idx) => (
                <div key={idx} className="flex justify-between text-sm py-1">
                  <span className="capitalize">{pmt.method.replace(/_/g, " ")}</span>
                  <span className="font-medium">${pmt.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          <Separator className="mb-4" />

          <div className="text-center text-xs text-muted-foreground">
            <p>{t("pos.thankYou")}</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          #receipt-content {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}
