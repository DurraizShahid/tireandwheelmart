"use client"

import type { POSProduct } from "@/lib/pos-types"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/i18n/use-locale"
import { ShoppingCart, Package, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductGridProps {
  products: POSProduct[]
  onAddToCart: (product: POSProduct) => void
  loading?: boolean
}

function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-3">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
    </div>
  )
}

export function ProductGrid({ products, onAddToCart, loading }: ProductGridProps) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Package className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h3 className="text-lg font-medium text-muted-foreground">
          {t("pos.no_products_found")}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground/70">
          {t("pos.try_different_category")}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => {
        const outOfStock = !product.in_stock || product.stock_quantity <= 0
        const lowStock = product.stock_quantity > 0 && product.stock_quantity <= 5

        return (
          <div
            key={product.id}
            className={cn(
              "group relative rounded-xl border bg-card transition-all duration-150 hover:shadow-lg hover:-translate-y-0.5",
              outOfStock && "opacity-50"
            )}
          >
            {lowStock && !outOfStock && (
              <div className="absolute left-2 top-2 z-10">
                <Badge variant="outline" className="border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 text-[10px] px-1.5 py-0">
                  <AlertTriangle className="mr-0.5 h-3 w-3" />
                  {product.stock_quantity}
                </Badge>
              </div>
            )}
            {outOfStock && (
              <div className="absolute left-2 top-2 z-10">
                <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                  {t("pos.out_of_stock")}
                </Badge>
              </div>
            )}
            <div className="aspect-square overflow-hidden rounded-t-xl bg-muted">
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                className={cn(
                  "h-full w-full object-cover transition-transform duration-200 group-hover:scale-105",
                  outOfStock && "grayscale"
                )}
                loading="lazy"
              />
            </div>
            <div className="p-3">
              {product.brand && (
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {product.brand}
                </p>
              )}
              <h3 className="mt-0.5 text-sm font-medium leading-tight line-clamp-2">
                {product.name}
              </h3>
              <p className="mt-1.5 text-base font-bold text-primary">
                ${product.price.toFixed(2)}
              </p>
              {product.compare_price && product.compare_price > product.price && (
                <p className="text-xs text-muted-foreground line-through">
                  ${product.compare_price.toFixed(2)}
                </p>
              )}
              <Button
                size="sm"
                className="mt-2 w-full min-h-[40px]"
                disabled={outOfStock}
                onClick={() => onAddToCart(product)}
              >
                <ShoppingCart className="mr-1.5 h-4 w-4" />
                {outOfStock ? t("pos.unavailable") : t("pos.add_to_cart")}
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
