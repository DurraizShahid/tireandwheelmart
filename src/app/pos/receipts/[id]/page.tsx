"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ReceiptPreview } from "@/components/pos/ReceiptPreview"
import { ArrowLeft, Printer } from "lucide-react"
import { toast } from "sonner"
import type { POSReceipt } from "@/lib/pos-types"

export default function ReceiptDetailPage() {
  const params = useParams()
  const [receipt, setReceipt] = useState<POSReceipt | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params.id) return
    setLoading(true)
    fetch(`/api/pos/receipt/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found")
        return res.json()
      })
      .then((data) => setReceipt(data))
      .catch(() => setReceipt(null))
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
      toast.success("Receipt emailed successfully")
    } catch {
      toast.error("Failed to email receipt")
    }
  }

  const handleDownloadPdf = () => {
    window.open(`/api/pos/receipt/pdf?orderId=${params.id}`, "_blank")
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-[500px] w-full" />
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
            Print
          </Button>
        </div>
      </div>
      <ReceiptPreview
        receipt={receipt}
        loading={false}
        onPrint={handlePrint}
        onEmail={handleEmail}
        onNewSale={() => window.location.href = "/pos"}
        onDownloadPdf={handleDownloadPdf}
        layout="thermal"
      />
    </div>
  )
}
