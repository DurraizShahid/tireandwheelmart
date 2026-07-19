"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ReceiptPreview } from "@/components/pos/ReceiptPreview"
import { ArrowLeft, Printer, Receipt } from "lucide-react"
import { toast } from "sonner"
import type { POSReceipt } from "@/lib/pos-types"

export default function ReceiptDetailPage() {
  const params = useParams()
  const [receipt, setReceipt] = useState<POSReceipt | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!params.id) return
    setLoading(true)
    setError(false)
    fetch(`/api/pos/receipt/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found")
        return res.json()
      })
      .then((data) => setReceipt(data))
      .catch(() => {
        setReceipt(null)
        setError(true)
      })
      .finally(() => setLoading(false))
  }, [params.id])

  const handlePrint = () => window.print()

  const handleEmail = async () => {
    try {
      const res = await fetch("/api/pos/receipt/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: params.id }),
      })
      if (!res.ok) throw new Error("Failed to send email")
    } catch {
      toast.error("Failed to email receipt")
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    )
  }

  if (error || !receipt) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="mb-4 flex items-center justify-between no-print">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/pos/receipts">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Receipts
            </Link>
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Receipt className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-lg font-medium text-muted-foreground">Receipt not found</h3>
          <p className="mt-1 text-sm text-muted-foreground/60">
            This receipt could not be found or may have been deleted.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-4 flex items-center justify-between no-print">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/pos/receipts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Receipts
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-1.5 h-4 w-4" />
            Reprint
          </Button>
        </div>
      </div>
      <ReceiptPreview
        receipt={receipt}
        loading={false}
        onPrint={handlePrint}
        onEmail={handleEmail}
        onNewSale={() => window.location.href = "/pos"}
        layout="thermal"
      />
    </div>
  )
}
