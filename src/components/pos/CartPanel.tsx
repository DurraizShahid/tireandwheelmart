"use client"

import type { POSCartItem } from "@/lib/pos-types"
import { useTranslation } from "@/i18n/use-locale"
import {
  Trash2,
  Plus,
  Minus,
  User,
  Percent,
  Receipt,
  ShoppingBag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CartPanelProps {
  items: POSCartItem[]
  onUpdateQuantity: (productId: string, qty: number) => void
  onRemove: (productId: string) => void
  onClear: () => void
  subtotal: number
  tax: number
  discount: number
  total: number
  onCheckout: () => void
  onCustomerClick: () => void
  customerName?: string
}

export function CartPanel({
  items,
  onUpdateQuantity,
  onRemove,
  onClear,
  subtotal,
  tax,
  discount,
  total,
  onCheckout,
  onCustomerClick,
  customerName,
}: CartPanelProps) {
  const { t } = useTranslation()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="border-b px-4 py-3">
        <button
          onClick={onCustomerClick}
          className="flex w-full items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted min-h-[44px]"
        >
          <User className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <p className="truncate font-medium">
              {customerName || t("pos.walk_in_customer")}
            </p>
            <p className="text-xs text-muted-foreground">
              {customerName ? t("pos.tap_to_change") : t("pos.add_customer")}
            </p>
          </div>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
          <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
          <h3 className="font-medium text-muted-foreground">
            {t("pos.cart_empty")}
          </h3>
          <p className="text-sm text-muted-foreground/60">
            {t("pos.add_products_to_start")}
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between border-b px-4 py-2">
            <span className="text-sm text-muted-foreground">
              {itemCount} {t("pos.items")}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-destructive hover:text-destructive"
              onClick={onClear}
            >
              <Trash2 className="mr-1 h-3.5 w-3.5" />
              {t("pos.clear_all")}
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="divide-y">
              {items.map((item) => (
                <div key={item.product_id} className="flex gap-3 px-4 py-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center min-w-0">
                    <p className="text-sm font-medium leading-tight truncate">
                      {item.name}
                    </p>
                    {item.brand && (
                      <p className="text-xs text-muted-foreground">
                        {item.brand}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        onUpdateQuantity(
                          item.product_id,
                          Math.max(0, item.quantity - 1)
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="flex h-8 w-8 items-center justify-center text-sm font-medium tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(
                          item.product_id,
                          Math.min(item.maxQuantity, item.quantity + 1)
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted"
                      disabled={item.quantity >= item.maxQuantity}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onRemove(item.product_id)}
                      className="ml-1 flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t px-4 py-3 space-y-2">
            {discount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Percent className="h-3.5 w-3.5" />
                  {t("pos.discount")}
                </span>
                <span className="text-destructive font-medium">
                  -${discount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("pos.subtotal")}</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("pos.tax")}</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-base font-bold">{t("pos.total")}</span>
              <span className="text-lg font-bold text-primary">
                ${total.toFixed(2)}
              </span>
            </div>
            <Button
              size="lg"
              className="mt-2 w-full min-h-[48px] text-base font-semibold"
              onClick={onCheckout}
            >
              <Receipt className="mr-2 h-5 w-5" />
              {t("pos.checkout")} — ${total.toFixed(2)}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
