"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  ShoppingCart,
  User,
  X,
  Plus,
  Minus,
  Trash2,
  Printer,
  RotateCcw,
  Monitor,
} from "lucide-react";
import { useTranslation } from "@/i18n/use-locale";
import type {
  POSProduct,
  POSCartItem,
  POSCustomer,
  POSCheckoutResponse,
  POSCategory,
} from "@/lib/pos-types";
import { toast } from "sonner";

export default function POSPage() {
  const { t } = useTranslation();

  const [products, setProducts] = useState<POSProduct[]>([]);
  const [categories, setCategories] = useState<POSCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<POSCartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<POSCustomer | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completedOrder, setCompletedOrder] = useState<POSCheckoutResponse | null>(null);
  const [customerSheetOpen, setCustomerSheetOpen] = useState(false);
  const [cartSheetOpen, setCartSheetOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProducts = useCallback(async (category?: string | null, search?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set("category_id", category);
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/pos/products?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/pos/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch {
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchProducts(null, "");
  }, [fetchCategories, fetchProducts]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchProducts(selectedCategory, searchQuery);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, selectedCategory, fetchProducts]);

  const handleCategorySelect = (catId: string | null) => {
    setSelectedCategory(catId);
  };

  const handleAddToCart = (product: POSProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product_id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock_quantity) {
          toast.error("Maximum stock reached");
          return prev;
        }
        return prev.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
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
      ];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: Math.min(quantity, item.maxQuantity) }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.13;
  const discount = 0;
  const total = subtotal + tax - discount;

  const handleCheckoutComplete = (response: POSCheckoutResponse) => {
    setCompletedOrder(response);
    setCheckoutOpen(false);
    setCartItems([]);
  };

  const handleNewSale = () => {
    setCompletedOrder(null);
    setCartItems([]);
    setSelectedCustomer(null);
  };

  const customerName = selectedCustomer
    ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}`
    : undefined;

  if (completedOrder) {
    return (
      <div className="flex min-h-screen bg-muted/30">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-lg">
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <ShoppingCart className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold">{t("pos.orderComplete")}</h1>
                <p className="text-muted-foreground">
                  {t("pos.orderNumber")}: {completedOrder.order_number}
                </p>
              </div>

              <div className="bg-card border rounded-lg p-6 space-y-4 mb-6">
                {completedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between text-sm">
                  <span>{t("pos.subtotal")}</span>
                  <span>${completedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t("pos.tax")}</span>
                  <span>${completedOrder.tax.toFixed(2)}</span>
                </div>
                {completedOrder.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>{t("pos.discount")}</span>
                    <span>-${completedOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>{t("pos.total")}</span>
                  <span>${completedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => window.print()}>
                  <Printer className="h-4 w-4 mr-2" />
                  {t("pos.print")}
                </Button>
                <Button className="flex-1" onClick={handleNewSale}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {t("pos.newSale")}
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 flex overflow-hidden">
          <div className="hidden md:flex flex-col w-[200px] shrink-0 border-r bg-card p-3 overflow-y-auto">
            <button
              onClick={() => handleCategorySelect(null)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                selectedCategory === null
                  ? "bg-red-600 text-white"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              {t("pos.allCategories")}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex justify-between items-center ${
                  selectedCategory === cat.id
                    ? "bg-red-600 text-white"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-xs opacity-70">({cat.product_count})</span>
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-center gap-3 p-4 border-b bg-card">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("pos.searchProducts")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCustomerSheetOpen(true)}
              >
                <User className="h-4 w-4 mr-2" />
                {customerName || t("pos.customer")}
              </Button>
              <Link href="/admin/pos/analytics">
                <Button variant="ghost" size="icon">
                  <Monitor className="h-4 w-4" />
                </Button>
              </Link>

              <Sheet open={cartSheetOpen} onOpenChange={setCartSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="default" size="sm" className="md:hidden relative">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {cartItems.length}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[380px] p-0">
                  <CartPanelContent
                    items={cartItems}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                    onClear={handleClearCart}
                    subtotal={subtotal}
                    tax={tax}
                    discount={discount}
                    total={total}
                    onCheckout={() => {
                      setCartSheetOpen(false);
                      setCheckoutOpen(true);
                    }}
                    onCustomerClick={() => setCustomerSheetOpen(true)}
                    customerName={customerName}
                  />
                </SheetContent>
              </Sheet>

              <CustomerSheet
                open={customerSheetOpen}
                onOpenChange={setCustomerSheetOpen}
                onSelect={(customer) => {
                  setSelectedCustomer(customer);
                  setCustomerSheetOpen(false);
                }}
                onCreateNew={() => {
                  setCustomerSheetOpen(false);
                }}
              />
            </div>

            <ScrollArea className="flex-1 p-4">
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="bg-card border rounded-lg p-3 space-y-3">
                      <Skeleton className="aspect-square w-full rounded-md" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold">{t("pos.noProductsFound")}</h3>
                  <p className="text-muted-foreground text-sm">{t("pos.tryDifferentSearch")}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.in_stock}
                      className="bg-card border rounded-lg p-3 text-left hover:border-red-500/50 hover:shadow-md transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="aspect-square w-full relative rounded-md overflow-hidden bg-muted mb-3">
                        <Image
                          src={product.image_url || "/placeholder.png"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        />
                      </div>
                      <p className="text-sm font-medium line-clamp-2 leading-tight">{product.name}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-base font-bold text-red-600">
                          ${product.price.toFixed(2)}
                        </span>
                        <Badge variant={product.in_stock ? "secondary" : "destructive"} className="text-[10px]">
                          {product.in_stock ? `${product.stock_quantity}` : "Out"}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          <aside className="hidden lg:flex flex-col w-[380px] shrink-0 border-l bg-card">
            <CartPanelContent
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
        </main>
      </div>

      <CheckoutModalContent
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cartItems}
        subtotal={subtotal}
        tax={tax}
        discount={discount}
        total={total}
        customer={selectedCustomer}
        onComplete={handleCheckoutComplete}
      />
    </div>
  );
}

function CartPanelContent({
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
}: {
  items: POSCartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  onCheckout: () => void;
  onCustomerClick: () => void;
  customerName?: string;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          <h2 className="font-semibold">{t("pos.cart")}</h2>
          <Badge variant="secondary">{items.length}</Badge>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={onCustomerClick}>
            <User className="h-4 w-4 mr-1" />
            {customerName || t("pos.customer")}
          </Button>
          {items.length > 0 && (
            <Button variant="ghost" size="icon" onClick={onClear}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-sm">{t("pos.cartEmpty")}</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {items.map((item) => (
              <div
                key={item.product_id}
                className="flex items-center gap-3 bg-muted/50 rounded-lg p-3"
              >
                <div className="w-14 h-14 relative rounded-md overflow-hidden bg-muted shrink-0">
                  <Image
                    src={item.image_url || "/placeholder.png"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-sm font-semibold text-red-600">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                    disabled={item.quantity >= item.maxQuantity}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={() => onRemove(item.product_id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="border-t p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("pos.subtotal")}</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("pos.tax")} (13%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("pos.discount")}</span>
            <span className="text-green-600">-${discount.toFixed(2)}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between font-bold text-lg">
          <span>{t("pos.total")}</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <Button
          className="w-full mt-2"
          size="lg"
          onClick={onCheckout}
          disabled={items.length === 0}
        >
          {t("pos.checkout")}
        </Button>
      </div>
    </div>
  );
}

function CustomerSheet({
  open,
  onOpenChange,
  onSelect,
  onCreateNew,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (customer: POSCustomer) => void;
  onCreateNew: () => void;
}) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<POSCustomer[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/pos/customers/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[380px]">
        <div className="flex flex-col h-full">
          <h3 className="text-lg font-semibold mb-4">{t("pos.findCustomer")}</h3>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("pos.searchCustomers")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>
          <ScrollArea className="flex-1">
            {searching ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : results.length === 0 && query.length >= 2 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-sm">{t("pos.noCustomersFound")}</p>
                <Button variant="link" onClick={onCreateNew} className="mt-2">
                  {t("pos.createCustomer")}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {results.map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() => onSelect(customer)}
                    className="w-full text-left p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <p className="font-medium text-sm">
                      {customer.first_name} {customer.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{customer.email}</p>
                    {customer.phone && (
                      <p className="text-xs text-muted-foreground">{customer.phone}</p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function CheckoutModalContent({
  open,
  onClose,
  items,
  subtotal,
  tax,
  discount,
  total,
  customer,
  onComplete,
}: {
  open: boolean;
  onClose: () => void;
  items: POSCartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  customer: POSCustomer | null;
  onComplete: (response: POSCheckoutResponse) => void;
}) {
  const { t } = useTranslation();
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card");
  const [firstName, setFirstName] = useState(customer?.first_name || "");
  const [lastName, setLastName] = useState(customer?.last_name || "");
  const [email, setEmail] = useState(customer?.email || "");

  useEffect(() => {
    if (customer) {
      setFirstName(customer.first_name);
      setLastName(customer.last_name);
      setEmail(customer.email);
    }
  }, [customer]);

  const handleCheckout = async () => {
    setProcessing(true);
    try {
      const res = await fetch("/api/admin/pos/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customer?.id,
          customer: { first_name: firstName, last_name: lastName, email },
          items: items.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
          })),
          payments: [{ method: paymentMethod, amount: total }],
          subtotal,
          tax,
          discount,
          total,
        }),
      });
      if (!res.ok) throw new Error("Checkout failed");
      const data = await res.json();
      onComplete(data);
    } catch {
      toast.error(t("pos.checkoutFailed"));
    } finally {
      setProcessing(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl border shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">{t("pos.checkout")}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {t("pos.customerInfo")}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder={t("pos.firstName")}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                placeholder={t("pos.lastName")}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <Input
              placeholder={t("pos.email")}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {t("pos.orderSummary")}
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product_id} className="flex justify-between text-sm">
                  <span className="truncate mr-2">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="font-medium shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("pos.subtotal")}</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("pos.tax")}</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("pos.discount")}</span>
                <span className="text-green-600">-${discount.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>{t("pos.total")}</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {t("pos.paymentMethod")}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "cash", label: t("pos.cash") },
                { value: "credit_card", label: t("pos.creditCard") },
                { value: "debit_card", label: t("pos.debitCard") },
                { value: "bank_transfer", label: t("pos.bankTransfer") },
              ].map((method) => (
                <Button
                  key={method.value}
                  variant={paymentMethod === method.value ? "default" : "outline"}
                  onClick={() => setPaymentMethod(method.value)}
                  className="justify-center"
                >
                  {method.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            {t("pos.cancel")}
          </Button>
          <Button
            className="flex-1"
            size="lg"
            onClick={handleCheckout}
            disabled={processing || items.length === 0}
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {t("pos.processing")}
              </span>
            ) : (
              `${t("pos.pay")} $${total.toFixed(2)}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
