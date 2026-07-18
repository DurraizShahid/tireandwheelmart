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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Search, ShoppingCart, User, WifiOff, Store, Star, Pause } from "lucide-react"
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
  POSProductsResponse,
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
import { QuickProducts } from "@/components/pos/QuickProducts"
import { SuspendedSalesPanel } from "@/components/pos/SuspendedSalesPanel"
import { CustomerHistory } from "@/components/pos/CustomerHistory"

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
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
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

  const [quickProductIds, setQuickProductIds] = useState<Set<string>>(new Set())
  const [showQuickProducts, setShowQuickProducts] = useState(false)
  const [suspendedSheetOpen, setSuspendedSheetOpen] = useState(false)
  const [historySheetOpen, setHistorySheetOpen] = useState(false)

  const fetchProducts = useCallback(async (category?: string | null, search?: string, page?: number) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category) params.set("category_id", category)
      if (search) params.set("search", search)
      if (page) params.set("page", String(page))
      const res = await fetch(`/api/pos/products?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch products")
      const data: POSProductsResponse = await res.json()
      setProducts(data.products)
      setTotalPages(data.totalPages)
      setCurrentPage(data.page)
    } catch {
      toast.error("Failed to load products")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/pos/categories")
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
    fetchProducts(null, "", 1)
  }, [fetchCategories, fetchProducts])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setCurrentPage(1)
      fetchProducts(selectedCategory, searchQuery, 1)
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

  const fetchQuickProductIds = useCallback(async () => {
    try {
      const res = await fetch("/api/pos/products/quick")
      if (!res.ok) return
      const data = await res.json()
      setQuickProductIds(new Set(data.map((p: { id: string }) => p.id)))
    } catch {
      // Ignore
    }
  }, [])

  useEffect(() => {
    fetchQuickProductIds()
  }, [fetchQuickProductIds])

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchProducts(selectedCategory, searchQuery, page)
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

  const handleSuspend = useCallback(async () => {
    try {
      const res = await fetch("/api/pos/sales/suspend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems, customer: selectedCustomer }),
      })
      if (!res.ok) throw new Error("Failed to suspend sale")
      setCartItems([])
      setSelectedCustomer(null)
      toast.success(t("pos.sale_suspended") || "Sale suspended")
    } catch {
      toast.error("Failed to suspend sale")
    }
  }, [cartItems, selectedCustomer])

  const handleResumeSale = useCallback((items: POSCartItem[], customer: POSCustomer | null) => {
    setCartItems(items)
    setSelectedCustomer(customer)
    setSuspendedSheetOpen(false)
    toast.success(t("pos.sale_resumed") || "Sale resumed")
  }, [])

  const handleToggleQuick = useCallback(async (productId: string, isQuick: boolean) => {
    try {
      if (isQuick) {
        await fetch("/api/pos/products/quick", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        })
        setQuickProductIds((prev) => new Set(prev).add(productId))
      } else {
        await fetch("/api/pos/products/quick", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        })
        setQuickProductIds((prev) => {
          const next = new Set(prev)
          next.delete(productId)
          return next
        })
      }
    } catch {
      toast.error("Failed to update favorites")
    }
  }, [])

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
    <div className="flex min-h-screen flex-col bg-muted/30 transition-all duration-200">
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
              {searchQuery.length >= 8 && /^\d{8,14}$/.test(searchQuery) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground/60 bg-muted px-1.5 py-0.5 rounded">
                        Barcode
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p className="text-xs">Searching by barcode/SKU</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-11 min-w-[44px] active:scale-[0.97]"
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

            {selectedCustomer && (
              <Button
                variant="outline"
                size="sm"
                className="h-11 min-w-[44px]"
                onClick={() => setHistorySheetOpen(true)}
                title="View customer history"
              >
                <span className="text-xs">{t("pos.history") || "History"}</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className={`h-11 min-w-[44px] ${showQuickProducts ? "bg-amber-100 dark:bg-amber-900" : ""}`}
              onClick={() => setShowQuickProducts((v) => !v)}
              title="Quick products"
            >
              <Star className={`h-4 w-4 ${showQuickProducts ? "fill-amber-400 text-amber-400" : ""}`} />
            </Button>

            <Sheet open={suspendedSheetOpen} onOpenChange={setSuspendedSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-11 min-w-[44px]"
                  title="Suspended sales"
                >
                  <Pause className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px] p-0">
                <SuspendedSalesPanel onResume={handleResumeSale} />
              </SheetContent>
            </Sheet>

            <Sheet open={cartSheetOpen} onOpenChange={setCartSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="default" size="sm" className="md:hidden relative h-11 active:scale-[0.97]">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {itemCount}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px] p-0">
                <CartPanel
                  items={cartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onQuickQuantityChange={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                  onClear={handleClearCart}
                  onSuspend={handleSuspend}
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

          {showQuickProducts && (
            <QuickProducts onAddToCart={handleAddToCart} />
          )}

          <div className="flex-1 overflow-y-auto p-4">
            <ProductGrid
              products={products}
              onAddToCart={handleAddToCart}
              loading={loading}
              total={products.length}
              page={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onToggleQuick={handleToggleQuick}
              quickProductIds={quickProductIds}
            />
          </div>
        </div>

        <aside className="hidden lg:flex w-[400px] shrink-0 flex-col border-l bg-card">
          <CartPanel
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onQuickQuantityChange={handleUpdateQuantity}
            onRemove={handleRemoveItem}
            onClear={handleClearCart}
            onSuspend={handleSuspend}
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

      <Sheet open={historySheetOpen} onOpenChange={setHistorySheetOpen}>
        <SheetContent side="right" className="w-full sm:w-[400px] p-0">
          {selectedCustomer && (
            <CustomerHistory
              customerId={selectedCustomer.id}
              customerName={`${selectedCustomer.first_name} ${selectedCustomer.last_name}`}
              onSelectOrder={(orderId) => {
                setHistorySheetOpen(false)
              }}
            />
          )}
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
