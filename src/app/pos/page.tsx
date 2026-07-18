"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useTranslation } from "@/i18n/use-locale"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, ShoppingCart, User, WifiOff, Store } from "lucide-react"
import { toast } from "sonner"
import type {
  POSProduct,
  POSCartItem,
  POSCustomer,
  POSCategory,
  POSReceipt,
  POSCheckoutResponse,
  POSShift,
  POSShiftSummary,
} from "@/lib/pos-types"

import { PosHeader } from "@/components/pos/PosHeader"
import { CategorySidebar } from "@/components/pos/CategorySidebar"
import { ProductGrid } from "@/components/pos/ProductGrid"
import { CartPanel } from "@/components/pos/CartPanel"
import { CheckoutModal } from "@/components/pos/CheckoutModal"
import { CustomerSearch } from "@/components/pos/CustomerSearch"
import { ReceiptPreview } from "@/components/pos/ReceiptPreview"
import { RegisterPanel } from "@/components/pos/RegisterPanel"
import { ShiftSummary } from "@/components/pos/ShiftSummary"

export default function POSPage() {
  const { t } = useTranslation()

  const [products, setProducts] = useState<POSProduct[]>([])
  const [categories, setCategories] = useState<POSCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [cartItems, setCartItems] = useState<POSCartItem[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<POSCustomer | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [customerSheetOpen, setCustomerSheetOpen] = useState(false)
  const [cartSheetOpen, setCartSheetOpen] = useState(false)
  const [online, setOnline] = useState(true)
  const [showReceipt, setShowReceipt] = useState(false)
  const [lastReceipt, setLastReceipt] = useState<POSReceipt | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [shift, setShift] = useState<POSShift | null>(null)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(true)
  const [showSummary, setShowSummary] = useState(false)
  const [summary, setSummary] = useState<POSShiftSummary | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false)

  const fetchProducts = useCallback(async (category?: string | null, search?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category) params.set("category_id", category)
      if (search) params.set("search", search)
      const res = await fetch(`/api/admin/pos/products?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch products")
      const data = await res.json()
      setProducts(data)
    } catch {
      toast.error("Failed to load products")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/pos/categories")
      if (!res.ok) throw new Error("Failed to fetch categories")
      const data = await res.json()
      setCategories(data)
    } catch {
      setCategories([])
    }
  }, [])

  const fetchRegisterStatus = useCallback(async () => {
    setRegisterLoading(true)
    try {
      const res = await fetch("/api/pos/register/status?registerId=default")
      if (!res.ok) throw new Error("Failed to fetch register status")
      const data = await res.json()
      setIsRegisterOpen(data.isOpen)
      setShift(data.activeShift)
    } catch {
      // Register API unavailable
    } finally {
      setRegisterLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
    fetchProducts(null, "")
  }, [fetchCategories, fetchProducts])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchProducts(selectedCategory, searchQuery)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchQuery, selectedCategory, fetchProducts])

  useEffect(() => {
    setOnline(navigator.onLine)
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  useEffect(() => {
    fetchRegisterStatus()
  }, [fetchRegisterStatus])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        searchRef.current?.focus()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "n" && !e.shiftKey) {
        e.preventDefault()
        handleNewSale()
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "c") {
        e.preventDefault()
        if (cartItems.length > 0) setCheckoutOpen(true)
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "x") {
        e.preventDefault()
        if (cartItems.length > 0) {
          setCartItems([])
          toast(t("pos.clear_cart"))
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [cartItems.length])

  const handleCategorySelect = (catId: string | null) => {
    setSelectedCategory(catId)
  }

  const handleAddToCart = (product: POSProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product_id === product.id)
      if (existing) {
        if (existing.quantity >= product.stock_quantity) {
          toast.error("Maximum stock reached")
          return prev
        }
        return prev.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image_url: product.image_url,
          brand: product.brand,
          maxQuantity: product.stock_quantity,
        },
      ]
    })
  }

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return
    setCartItems((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: Math.min(quantity, item.maxQuantity) }
          : item
      )
    )
  }

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product_id !== productId))
  }

  const handleClearCart = () => {
    setCartItems([])
  }

  const handleNewSale = () => {
    setShowReceipt(false)
    setLastReceipt(null)
    setCartItems([])
    setSelectedCustomer(null)
  }

  const handleOpenRegister = useCallback(async (openingCash: number, notes?: string) => {
    const res = await fetch("/api/pos/register/open", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registerId: "default", openingCash, notes }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Failed to open register")
    }
    const newShift = await res.json()
    setShift(newShift)
    setIsRegisterOpen(true)
    setRegisterDialogOpen(false)
    toast.success("Register opened")
  }, [])

  const handleCloseRegister = useCallback(async (actualCash: number, notes?: string) => {
    if (!shift) return
    const res = await fetch("/api/pos/register/close", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shiftId: shift.id, actualCash, notes }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Failed to close register")
    }
    const result = await res.json()
    setShift({ ...shift, ...result, status: "closed" })
    setIsRegisterOpen(false)
    setRegisterDialogOpen(false)
    toast.success("Register closed")
  }, [shift])

  const handleRefreshStatus = useCallback(() => {
    fetchRegisterStatus()
  }, [fetchRegisterStatus])

  const handleRefreshSummary = useCallback(async () => {
    if (!shift) return
    setSummaryLoading(true)
    try {
      const res = await fetch(`/api/pos/register/summary?shiftId=${shift.id}`)
      if (!res.ok) throw new Error("Failed to load summary")
      const data = await res.json()
      setSummary(data)
    } catch {
      toast.error("Failed to refresh summary")
    } finally {
      setSummaryLoading(false)
    }
  }, [shift])

  const handleEndOfDay = useCallback(async () => {
    if (!shift) {
      toast.error("No active shift")
      return
    }
    setShowSummary(true)
    setSummaryLoading(true)
    try {
      const res = await fetch(`/api/pos/register/summary?shiftId=${shift.id}`)
      if (!res.ok) throw new Error("Failed to load summary")
      const data = await res.json()
      setSummary(data)
    } catch {
      toast.error("Failed to load shift summary")
    } finally {
      setSummaryLoading(false)
    }
  }, [shift])

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.13
  const discount = 0
  const total = subtotal + tax - discount

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const customerName = selectedCustomer
    ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}`
    : undefined

  const handleCheckoutComplete = useCallback((response: POSCheckoutResponse) => {
    setCheckoutOpen(false)
    const receipt: POSReceipt = {
      order_number: response.order_number,
      created_at: response.created_at,
      items: response.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        total: item.price * item.quantity,
      })),
      payments: response.payments,
      subtotal: response.subtotal,
      tax: response.tax,
      discount: response.discount,
      total: response.total,
      customer: selectedCustomer
        ? {
            name: `${selectedCustomer.first_name} ${selectedCustomer.last_name}`,
            email: selectedCustomer.email,
          }
        : undefined,
    }
    setLastReceipt(receipt)
    setCartItems([])
    setSelectedCustomer(null)
    setShowReceipt(true)
  }, [selectedCustomer])

  if (showReceipt && lastReceipt) {
    return (
      <div className="flex min-h-screen flex-col bg-muted/30">
        <PosHeader onNewSale={handleNewSale} cartEmpty={true} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-lg">
            <ReceiptPreview
              receipt={lastReceipt}
              onPrint={() => window.print()}
              onEmail={() => toast.success("Receipt emailed")}
              onNewSale={handleNewSale}
            />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <PosHeader
        registerName="Register #1"
        registerStatus={isRegisterOpen ? "open" : "closed"}
        onNewSale={handleNewSale}
        cartEmpty={cartItems.length === 0}
        onEndOfDay={handleEndOfDay}
      />

      {!online && (
        <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          <WifiOff className="h-4 w-4 shrink-0" />
          <span className="font-medium">{t("pos.offline_mode")}</span>
          <span className="text-amber-600 dark:text-amber-400">
            {t("pos.offline_notice")}
          </span>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:flex w-56 shrink-0 flex-col border-r bg-card">
          <CategorySidebar
            categories={categories}
            selected={selectedCategory}
            onSelect={handleCategorySelect}
          />
        </aside>

        <div className="flex flex-1 flex-col min-w-0">
          <div className="flex items-center gap-3 border-b bg-card px-4 py-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={searchRef}
                placeholder={t("pos.search_placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 pl-9"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-11 min-w-[44px]"
              onClick={() => setRegisterDialogOpen(true)}
              title={isRegisterOpen ? "Register is open" : "Register is closed"}
            >
              <Store className={`h-4 w-4 ${isRegisterOpen ? "text-green-500" : "text-red-500"}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-11 min-w-[44px]"
              onClick={() => setCustomerSheetOpen(true)}
            >
              <User className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{customerName || t("pos.customer")}</span>
            </Button>

            <Sheet open={cartSheetOpen} onOpenChange={setCartSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="default" size="sm" className="md:hidden relative h-11">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {itemCount}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px] p-0">
                <CartPanel
                  items={cartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                  onClear={handleClearCart}
                  subtotal={subtotal}
                  tax={tax}
                  discount={discount}
                  total={total}
                  onCheckout={() => {
                    setCartSheetOpen(false)
                    setCheckoutOpen(true)
                  }}
                  onCustomerClick={() => setCustomerSheetOpen(true)}
                  customerName={customerName}
                />
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <ProductGrid
              products={products}
              onAddToCart={handleAddToCart}
              loading={loading}
            />
          </div>
        </div>

        <aside className="hidden lg:flex w-[400px] shrink-0 flex-col border-l bg-card">
          <CartPanel
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemoveItem}
            onClear={handleClearCart}
            subtotal={subtotal}
            tax={tax}
            discount={discount}
            total={total}
            onCheckout={() => setCheckoutOpen(true)}
            onCustomerClick={() => setCustomerSheetOpen(true)}
            customerName={customerName}
          />
        </aside>
      </div>

      <Sheet open={customerSheetOpen} onOpenChange={setCustomerSheetOpen}>
        <SheetContent side="right" className="w-full sm:w-[400px]">
          <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold mb-4">{t("pos.select_customer")}</h3>
            <CustomerSearch
              onSelect={(customer) => {
                setSelectedCustomer(customer)
                setCustomerSheetOpen(false)
              }}
              onCreateNew={(name, email, phone) => {
                setSelectedCustomer({
                  id: "new",
                  first_name: name.split(" ")[0] || name,
                  last_name: name.split(" ").slice(1).join(" ") || "",
                  email: email || "",
                  phone,
                })
                setCustomerSheetOpen(false)
              }}
            />
          </div>
        </SheetContent>
      </Sheet>

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cartItems}
        subtotal={subtotal}
        tax={tax}
        discount={discount}
        total={total}
        customer={selectedCustomer}
        onCustomerChange={(customer) => setSelectedCustomer(customer)}
        onComplete={handleCheckoutComplete}
      />

      <Dialog open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("pos.register_status")}</DialogTitle>
          </DialogHeader>
          <RegisterPanel
            registerName="Register #1"
            shift={shift}
            isOpen={isRegisterOpen}
            onOpen={handleOpenRegister}
            onClose={handleCloseRegister}
            onRefresh={handleRefreshStatus}
            loading={registerLoading}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("pos.end_of_day_summary")}</DialogTitle>
          </DialogHeader>
          <ShiftSummary
            summary={summary}
            loading={summaryLoading}
            onRefresh={handleRefreshSummary}
            onPrint={() => window.print()}
            onCloseRegister={() => {
              setShowSummary(false)
              setRegisterDialogOpen(true)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
