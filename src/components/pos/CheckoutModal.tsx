"use client"

import { useState, useCallback } from "react"
import type { POSCartItem, POSCustomer, POSPaymentMethod, POSPayment, POSCheckoutResponse } from "@/lib/pos-types"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/i18n/use-locale"
import {
  X,
  User,
  Banknote,
  CreditCard,
  Landmark,
  ArrowLeft,
  CheckCircle2,
  Receipt,
  Wallet,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { CustomerSearch } from "./CustomerSearch"
import { toast } from "sonner"

interface CheckoutModalProps {
  open: boolean
  onClose: () => void
  items: POSCartItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  customer?: POSCustomer | null
  onCustomerChange: (customer: POSCustomer | null) => void
  onComplete: (response: POSCheckoutResponse) => void
}

type CheckoutStep = "payment" | "processing" | "success"

const PAYMENT_METHODS: {
  value: POSPaymentMethod
  label: string
  icon: typeof Banknote
}[] = [
  { value: "cash", label: "pos.cash", icon: Banknote },
  { value: "credit_card", label: "pos.credit_card", icon: CreditCard },
  { value: "debit_card", label: "pos.debit_card", icon: CreditCard },
  { value: "bank_transfer", label: "pos.bank_transfer", icon: Landmark },
]

function SplitPaymentRow({
  method,
  amount,
  maxAmount,
  onMethodChange,
  onAmountChange,
  onRemove,
}: {
  method: POSPaymentMethod
  amount: number
  maxAmount: number
  onMethodChange: (method: POSPaymentMethod) => void
  onAmountChange: (amount: number) => void
  onRemove: () => void
}) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2 rounded-lg border p-3">
      <select
        value={method}
        onChange={(e) => onMethodChange(e.target.value as POSPaymentMethod)}
        className="h-9 rounded-md border bg-background px-2 text-sm"
      >
        {PAYMENT_METHODS.map((pm) => (
          <option key={pm.value} value={pm.value}>
            {t(pm.label)}
          </option>
        ))}
      </select>
      <div className="relative flex-1">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          $
        </span>
        <Input
          type="number"
          min={0}
          step={0.01}
          max={maxAmount}
          value={amount || ""}
          onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
          className="pl-6"
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 shrink-0 text-destructive"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function CheckoutModal({
  open,
  onClose,
  items,
  subtotal,
  tax,
  discount,
  total,
  customer,
  onCustomerChange,
  onComplete,
}: CheckoutModalProps) {
  const { t } = useTranslation()
  const [step, setStep] = useState<CheckoutStep>("payment")
  const [paymentMethod, setPaymentMethod] = useState<POSPaymentMethod>("cash")
  const [amountTendered, setAmountTendered] = useState(total)
  const [cardLastFour, setCardLastFour] = useState("")
  const [cardholderName, setCardholderName] = useState("")
  const [showCustomerSearch, setShowCustomerSearch] = useState(false)
  const [useSplitPayment, setUseSplitPayment] = useState(false)
  const [splitPayments, setSplitPayments] = useState<POSPayment[]>([
    { method: "cash", amount: 0 },
  ])
  const [lastResponse, setLastResponse] = useState<POSCheckoutResponse | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [notes, setNotes] = useState("")

  const changeDue = Math.max(0, amountTendered - total)
  const cashMethods: POSPaymentMethod[] = ["cash"]
  const isCash = cashMethods.includes(paymentMethod)

  const makePayments = useCallback((): POSPayment[] => {
    if (useSplitPayment) {
      return splitPayments.filter((p) => p.amount > 0);
    }
    if (paymentMethod === "cash") {
      return [{ method: "cash", amount: total }];
    }
    return [{
      method: paymentMethod,
      amount: total,
      card_last_four: cardLastFour || undefined,
      cardholder_name: cardholderName || undefined,
    }];
  }, [useSplitPayment, splitPayments, paymentMethod, total, cardLastFour, cardholderName]);

  const handleCompleteSale = useCallback(async () => {
    setStep("processing");
    setErrorMessage(null);

    const payments = makePayments();

    const body = {
      customer: {
        first_name: customer?.first_name || "Walk-in",
        last_name: customer?.last_name || "Customer",
        email: customer?.email || "",
        phone: customer?.phone || undefined,
      },
      customer_id: customer?.id && customer.id !== "new" ? customer.id : undefined,
      items: items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
      payments,
      subtotal,
      tax,
      discount,
      total,
      notes: notes || undefined,
    };

    try {
      const res = await fetch("/api/pos/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Checkout failed");
      }

      const response: POSCheckoutResponse = await res.json();
      setLastResponse(response);
      setNotes("");
      setStep("success");
    } catch (err) {
      setErrorMessage((err as Error).message);
      toast.error((err as Error).message);
    }
  }, [items, customer, subtotal, tax, discount, total, notes, onComplete, makePayments]);

  const handleSplitAmountChange = useCallback(
    (index: number, newAmount: number) => {
      setSplitPayments((prev) => {
        const next = [...prev]
        next[index] = { ...next[index], amount: Math.min(newAmount, total) }
        return next
      })
    },
    [total]
  )

  const handleSplitMethodChange = useCallback(
    (index: number, newMethod: POSPaymentMethod) => {
      setSplitPayments((prev) => {
        const next = [...prev]
        next[index] = { ...next[index], method: newMethod }
        return next
      })
    },
    []
  )

  const addSplitPayment = useCallback(() => {
    if (splitPayments.length >= 4) return
    const usedMethods = splitPayments.map((p) => p.method)
    const avail = PAYMENT_METHODS.find((pm) => !usedMethods.includes(pm.value))
    setSplitPayments((prev) => [
      ...prev,
      { method: avail?.value ?? "cash", amount: 0 },
    ])
  }, [splitPayments])

  const removeSplitPayment = useCallback((index: number) => {
    setSplitPayments((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const splitTotal = splitPayments.reduce((s, p) => s + p.amount, 0)
  const splitRemaining = total - splitTotal

  if (!open) return null

  if (step === "success") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm transition-all duration-300">
        <div className="mx-auto flex max-w-md flex-col items-center px-6 text-center animate-in zoom-in-50 duration-300">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold">{t("pos.sale_complete")}</h2>
          <p className="mt-2 text-muted-foreground">
            {t("pos.sale_complete_description")}
          </p>
          <div className="mt-8 flex w-full flex-col gap-3">
            <Button size="lg" className="w-full min-h-[48px]" onClick={() => lastResponse && onComplete(lastResponse)}>
              <Receipt className="mr-2 h-5 w-5" />
              {t("pos.view_receipt")}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full min-h-[48px]"
              onClick={() => lastResponse && onComplete(lastResponse)}
            >
              {t("pos.new_sale")}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (step === "processing") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm transition-all duration-300">
        {errorMessage ? (
          <div className="mx-auto flex max-w-md flex-col items-center px-6 text-center animate-in zoom-in-50 duration-300">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
              <X className="h-10 w-10 text-destructive" />
            </div>
            <h2 className="text-xl font-bold">{t("pos.payment_failed")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
            <div className="mt-8 flex w-full flex-col gap-3">
              <Button size="lg" className="w-full min-h-[48px]" onClick={handleCompleteSale}>
                {t("pos.retry")}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full min-h-[48px]"
                onClick={() => { setStep("payment"); setErrorMessage(null); }}
              >
                {t("common.back")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-50 duration-300">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-lg font-medium">{t("pos.processing_payment")}</p>
            <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-primary" />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background transition-all duration-300">
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onClose}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">{t("pos.checkout")}</h1>
      </div>

      <div className="flex flex-1 flex-col gap-0 overflow-y-auto lg:flex-row">
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {t("pos.customer")}
              </h2>
              {!showCustomerSearch && customer && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setShowCustomerSearch(true)}
                >
                  {t("pos.change")}
                </Button>
              )}
            </div>
            {showCustomerSearch ? (
              <div className="rounded-lg border p-3">
                <CustomerSearch
                  onSelect={(c) => {
                    onCustomerChange(c)
                    setShowCustomerSearch(false)
                  }}
                  onCreateNew={(name, email, phone) => {
                    onCustomerChange({
                      id: "new",
                      first_name: name.split(" ")[0] || name,
                      last_name: name.split(" ").slice(1).join(" ") || "",
                      email: email || "",
                      phone,
                    })
                    setShowCustomerSearch(false)
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-8 w-full text-xs"
                  onClick={() => {
                    onCustomerChange(null)
                    setShowCustomerSearch(false)
                  }}
                >
                  {t("pos.walk_in_customer")}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {customer
                      ? `${customer.first_name} ${customer.last_name}`
                      : t("pos.walk_in_customer")}
                  </p>
                  {customer?.email && (
                    <p className="text-xs text-muted-foreground">
                      {customer.email}
                    </p>
                  )}
                </div>
                {!customer && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto h-8"
                    onClick={() => setShowCustomerSearch(true)}
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    {t("pos.add_customer")}
                  </Button>
                )}
              </div>
            )}
          </section>

          <Separator />

          <section>
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {t("pos.order_summary")}
            </h2>
            <div className="rounded-lg border">
              {items.map((item) => (
                <div
                  key={item.product_id}
                  className="flex items-center gap-3 border-b px-4 py-3 last:border-b-0"
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} x ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums">
                    ${(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="border-t bg-muted/30 lg:w-96 lg:border-t-0 lg:border-l flex flex-col">
          <div className="flex-1 p-4 lg:p-6 space-y-6">
          <section className="mb-6">
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {t("pos.payment_method")}
            </h2>

            {useSplitPayment ? (
              <div className="space-y-3">
                {splitPayments.map((sp, i) => (
              <SplitPaymentRow
                key={i}
                method={sp.method}
                amount={sp.amount}
                maxAmount={splitRemaining}
                onMethodChange={(newMethod) => handleSplitMethodChange(i, newMethod)}
                onAmountChange={(newAmount) => handleSplitAmountChange(i, newAmount)}
                onRemove={() => removeSplitPayment(i)}
              />
                ))}
                {splitPayments.length < 4 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full min-h-[40px]"
                    onClick={addSplitPayment}
                  >
                    <Plus className="mr-1.5 h-4 w-4" />
                    {t("pos.add_split")}
                  </Button>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("pos.allocated")}
                  </span>
                  <span className="font-medium">${splitTotal.toFixed(2)}</span>
                </div>
                {splitRemaining > 0.01 && (
                  <div className="flex items-center justify-between text-sm text-destructive">
                    <span>{t("pos.remaining")}</span>
                    <span className="font-medium">
                      ${splitRemaining.toFixed(2)}
                    </span>
                  </div>
                )}
                <Button
                  variant="link"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setUseSplitPayment(false)}
                >
                  {t("pos.single_payment")}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map((pm) => {
                    const Icon = pm.icon
                    const isActive = paymentMethod === pm.value
                    return (
                      <button
                        key={pm.value}
                        onClick={() => setPaymentMethod(pm.value)}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border px-3 py-3 text-left text-sm transition-all min-h-[48px] active:scale-[0.98]",
                          isActive
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "hover:bg-muted"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5",
                            isActive ? "text-primary" : "text-muted-foreground"
                          )}
                        />
                        <span
                          className={cn(
                            "font-medium",
                            isActive ? "text-primary" : ""
                          )}
                        >
                          {t(pm.label)}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {isCash && (
                  <div className="mt-3 space-y-3 rounded-lg border p-4">
                    <label className="text-sm font-medium">
                      {t("pos.amount_tendered")}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">
                        $
                      </span>
                      <Input
                        type="number"
                        min={total}
                        step={0.01}
                        value={amountTendered}
                        onChange={(e) =>
                          setAmountTendered(parseFloat(e.target.value) || 0)
                        }
                        className="h-12 pl-8 text-lg font-semibold"
                      />
                    </div>
                    <div className="flex gap-2">
                      {[total, Math.ceil(total / 10) * 10, Math.ceil(total / 20) * 20].map(
                        (amt) =>
                          amt > total && (
                            <Button
                              key={amt}
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => setAmountTendered(amt)}
                            >
                              ${amt.toFixed(0)}
                            </Button>
                          )
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">{t("pos.quick_amounts")}:</span>
                      {[5, 10, 20, 50, 100].map((amt) => (
                        <Button
                          key={`q-${amt}`}
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs min-w-[44px]"
                          onClick={() => setAmountTendered(Math.max(total, amt))}
                        >
                          ${amt}
                        </Button>
                      ))}
                    </div>
                    {changeDue > 0 && (
                      <div className="flex items-center justify-between rounded-md bg-green-50 px-3 py-2 dark:bg-green-950/30">
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                          {t("pos.change_due")}
                        </span>
                        <span className="text-lg font-bold text-green-700 dark:text-green-300">
                          ${changeDue.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {(paymentMethod === "credit_card" ||
                  paymentMethod === "debit_card") && (
                  <div className="mt-3 space-y-3 rounded-lg border p-4">
                    <div>
                      <label className="text-sm font-medium">
                        {t("pos.card_number")}
                      </label>
                      <Input
                        placeholder={`**** **** **** ${t("pos.card_last_four")}`}
                        value={cardLastFour}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "")
                          if (val.length <= 4) setCardLastFour(val)
                        }}
                        className="mt-1 h-12 text-lg tracking-widest"
                        maxLength={4}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        {t("pos.cardholder_name")}
                      </label>
                      <Input
                        placeholder="John Doe"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        className="mt-1 h-12"
                      />
                    </div>
                  </div>
                )}

                <Button
                  variant="link"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setUseSplitPayment(true)}
                >
                  <Wallet className="mr-1 h-3.5 w-3.5" />
                  {t("pos.split_payment")}
                </Button>
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {t("common.notes")}
            </h2>
            <Textarea
              placeholder="Order notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px] resize-y"
            />
          </section>
          </div>

          <div className="sticky bottom-0 bg-background border-t p-4 lg:p-6">
            <Separator />

            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("pos.subtotal")} ({items.reduce((s, i) => s + i.quantity, 0)}{" "}
                  {t("pos.items")})
                </span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("pos.discount")}
                  </span>
                  <span className="text-destructive">
                    -${discount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("pos.tax")}</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>{t("pos.total")}</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              size="lg"
              className="mt-6 w-full min-h-[52px] text-base font-semibold"
              onClick={handleCompleteSale}
              disabled={
                items.length === 0 || (useSplitPayment && Math.abs(splitRemaining) > 0.01)
              }
            >
              {`${t("pos.complete_sale")} — $${total.toFixed(2)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
