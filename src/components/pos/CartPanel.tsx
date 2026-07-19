"use client"

import { useState, useRef, useEffect } from "react"
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
  Pause,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"

interface CartPanelProps {
  items: POSCartItem[]
  onUpdateQuantity: (productId: string, qty: number) => void
  onRemove: (productId: string) => void
  onClear: () => void
  onSuspend?: () => void
  subtotal: number
  tax: number
  discount: number
  total: number
  onCheckout: () => void
  onCustomerClick: () => void
  customerName?: string
  onQuickQuantityChange?: (productId: string, quantity: number) => void
  onDiscountChange?: (discount: number) => void
}

function QuantityCell({ item, onUpdateQuantity, onQuickQuantityChange }: {
  item: POSCartItem
  onUpdateQuantity: (productId: string, qty: number) => void
  onQuickQuantityChange?: (productId: string, quantity: number) => void
}) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(String(item.quantity))
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  const commit = () => {
    const val = parseInt(editValue, 10)
    if (!isNaN(val) && val >= 1) {
      const clamped = Math.min(val, item.maxQuantity)
      onUpdateQuantity(item.product_id, clamped)
      onQuickQuantityChange?.(item.product_id, clamped)
    } else {
      setEditValue(String(item.quantity))
    }
    setEditing(false)
  }

  if (editing) {
    return (
      <Input
        ref={inputRef}
        type="number"
        min={1}
        max={item.maxQuantity}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit()
          if (e.key === "Escape") {
            setEditValue(String(item.quantity))
            setEditing(false)
          }
        }}
        className="h-8 w-14 text-center text-sm font-medium tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    )
  }

  return (
    <button
      onClick={() => {
        setEditValue(String(item.quantity))
        setEditing(true)
      }}
      className="flex h-8 w-8 items-center justify-center text-sm font-medium tabular-nums rounded-md border border-transparent hover:border-input hover:bg-muted/50 transition-colors"
      title="Click to edit quantity"
    >
      {item.quantity}
    </button>
  )
}

export function CartPanel({
  items,
  onUpdateQuantity,
  onRemove,
  onClear,
  onSuspend,
  subtotal,
  tax,
  discount,
  total,
  onCheckout,
  onCustomerClick,
  customerName,
  onQuickQuantityChange,
  onDiscountChange,
}: CartPanelProps) {
  const { t } = useTranslation()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const [confirmingRemoveId, setConfirmingRemoveId] = useState<string | null>(null)
  const [showDiscount, setShowDiscount] = useState(false)
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("fixed")
  const [discountInput, setDiscountInput] = useState("")

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setConfirmingRemoveId(null)
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="border-b px-4 py-3">
          <button
            onClick={onCustomerClick}
            className="flex w-full items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2.5 text-left text-sm transition-all duration-150 hover:bg-muted active:scale-[0.98] min-h-[44px]"
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
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center">
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
            <div className="flex items-center gap-1">
              {onSuspend && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 min-h-[44px] text-xs text-muted-foreground hover:text-foreground active:scale-[0.98]"
                  onClick={onSuspend}
                >
                  <Pause className="mr-1 h-3.5 w-3.5" />
                  {t("pos.suspend") || "Hold"}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 min-h-[44px] text-xs text-destructive hover:text-destructive active:scale-[0.98]"
                onClick={onClear}
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                {t("pos.clear_all")}
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="divide-y">
              {items.map((item, idx) => (
                <div key={`cart-item-${idx}`} className="flex gap-3 px-4 py-3 transition-all duration-150">
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
                      className="flex items-center justify-center rounded-md border transition-colors hover:bg-muted active:scale-[0.98] min-w-[44px] min-h-[44px]"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <QuantityCell
                      item={item}
                      onUpdateQuantity={onUpdateQuantity}
                      onQuickQuantityChange={onQuickQuantityChange}
                    />
                    <button
                      onClick={() =>
                        onUpdateQuantity(
                          item.product_id,
                          Math.min(item.maxQuantity, item.quantity + 1)
                        )
                      }
                      className="flex items-center justify-center rounded-md border transition-colors hover:bg-muted active:scale-[0.98] min-w-[44px] min-h-[44px]"
                      disabled={item.quantity >= item.maxQuantity}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    {confirmingRemoveId === item.product_id ? (
                      <div className="ml-1 flex items-center gap-1">
                        <button
                          onClick={() => {
                            onRemove(item.product_id)
                            setConfirmingRemoveId(null)
                          }}
                          className="flex items-center justify-center rounded-md bg-destructive px-2.5 text-xs font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 min-h-[44px]"
                        >
                          {t("common.confirm")}
                        </button>
                        <button
                          onClick={() => setConfirmingRemoveId(null)}
                          className="flex items-center justify-center rounded-md border transition-colors hover:bg-muted min-w-[44px] min-h-[44px]"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmingRemoveId(item.product_id)}
                        className="ml-1 flex items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive active:scale-[0.98] min-w-[44px] min-h-[44px]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="mt-auto border-t px-4 py-3 space-y-2">
            {showDiscount ? (
              <div className="rounded-lg border p-2 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex rounded-md border text-sm">
                    <button
                      onClick={() => setDiscountType("fixed")}
                      className={`px-2 py-1 ${discountType === "fixed" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                    >
                      $
                    </button>
                    <button
                      onClick={() => setDiscountType("percentage")}
                      className={`px-2 py-1 ${discountType === "percentage" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                    >
                      %
                    </button>
                  </div>
                  <Input
                    type="number"
                    min={0}
                    placeholder={discountType === "fixed" ? "0.00" : "0"}
                    value={discountInput}
                    onChange={(e) => {
                      setDiscountInput(e.target.value)
                      const val = parseFloat(e.target.value) || 0
                      const computed = discountType === "percentage" ? (subtotal * val) / 100 : val
                      onDiscountChange?.(Math.min(computed, subtotal))
                    }}
                    className="h-8 flex-1 text-sm"
                  />
                  <button
                    onClick={() => { setShowDiscount(false); onDiscountChange?.(0); setDiscountInput("") }}
                    className="text-xs text-destructive hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowDiscount(true)}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed py-2 text-xs text-muted-foreground hover:border-solid hover:bg-muted/50 transition-colors min-h-[36px]"
              >
                <Percent className="h-3.5 w-3.5" />
                {t("pos.add_discount") || "Add Discount"}
              </button>
            )}
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
              className="mt-2 w-full min-h-[48px] text-base font-semibold shadow-sm hover:shadow-md transition-shadow active:scale-[0.98]"
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
