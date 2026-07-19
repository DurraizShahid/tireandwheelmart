"use client"

import { useEffect, useState, useCallback } from "react"
import type { POSProduct } from "@/lib/pos-types"
import { useTranslation } from "@/i18n/use-locale"
import { Star, ShoppingCart } from "lucide-react"
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
          <Skeleton key={i} className="h-[68px] w-[120px] shrink-0 rounded-xl" />
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
            <button
              key={product.id}
              onClick={() => onAddToCart(product)}
              className="group relative flex h-[68px] w-[120px] shrink-0 items-center gap-2 rounded-xl border bg-card p-1.5 shadow-sm transition-all duration-150 hover:shadow-md hover:border-primary/30 hover:bg-accent active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 cursor-pointer"
              aria-label={`${t("pos.add_to_cart")} ${product.name}`}
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
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
                <div className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <ShoppingCart className="h-3 w-3" />
                  <span>{t("pos.add") || "Add"}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
