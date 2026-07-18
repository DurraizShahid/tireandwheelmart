"use client"

import { useEffect, useState, useCallback } from "react"
import type { POSProduct } from "@/lib/pos-types"
import { useTranslation } from "@/i18n/use-locale"
import { Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

interface QuickProductsProps {
  onAddToCart: (product: POSProduct) => void
}

export function QuickProducts({ onAddToCart }: QuickProductsProps) {
  const { t } = useTranslation()
  const [products, setProducts] = useState<POSProduct[]>([])
  const [loading, setLoading] = useState(true)

  const fetchQuickProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/pos/products/quick")
      if (!res.ok) throw new Error("Failed to fetch quick products")
      const data = await res.json()
      setProducts(data)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQuickProducts()
  }, [fetchQuickProducts])

  useEffect(() => {
    const handleFocus = () => fetchQuickProducts()
    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [fetchQuickProducts])

  if (loading) {
    return (
      <div className="flex gap-2 px-4 py-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-24 shrink-0 rounded-lg" />
        ))}
      </div>
    )
  }

  if (products.length === 0) return null

  return (
    <div className="border-b bg-muted/30">
      <div className="flex items-center gap-1.5 px-4 pt-2 pb-1">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        <span className="text-xs font-medium text-muted-foreground">{t("pos.quick_products") || "Quick Products"}</span>
      </div>
      <ScrollArea className="w-full pb-2">
        <div className="flex gap-2 px-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex h-16 w-28 shrink-0 items-center gap-2 rounded-lg border bg-card p-1.5 transition-colors hover:bg-accent"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                <Image
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <p className="truncate text-[11px] font-medium leading-tight">{product.name}</p>
                <p className="text-xs font-bold text-primary">${product.price.toFixed(2)}</p>
                <Button
                  size="icon"
                  variant="ghost"
                  className="mt-0.5 h-5 w-5"
                  onClick={() => onAddToCart(product)}
                  title={t("pos.add_to_cart")}
                >
                  <ShoppingCart className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
