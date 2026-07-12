"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderDetail {
  id: string;
  order_number: string | null;
  status: string;
  subtotal: number;
  tax: number;
  shipping_cost: number;
  total: number;
  notes: string | null;
  tracking_number: string | null;
  shipping_method: { id: string; label: string; description: string; estimatedDays: string } | null;
  payment_method: { method: string; cardholderName: string | null } | null;
  created_at: string;
  customers: {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
  } | null;
  order_items: Array<{
    id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    products: {
      name: string;
      slug: string;
      image_url: string;
      brand: string | null;
      sku: string | null;
    } | null;
  }>;
  shippingAddress: {
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  } | null;
  billingAddress: {
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  } | null;
}

const statusColors: Record<string, string> = {
  delivered: "bg-green-100 text-green-800",
  shipped: "bg-blue-100 text-blue-800",
  processing: "bg-yellow-100 text-yellow-800",
  pending: "bg-orange-100 text-orange-800",
  confirmed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-purple-100 text-purple-800",
};

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/orders/${params.id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(res.status === 404 ? "Order not found" : "Failed to load order");
        setOrder(await res.json());
      })
      .catch((e) => setError(e.message ?? "Failed to load order"))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-muted/30">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <div className="flex-1 items-center justify-center flex">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen bg-muted/30">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <div className="flex-1 items-center justify-center flex flex-col gap-4">
            <p className="text-lg font-medium">{error ?? "Order not found"}</p>
            <Link href="/admin/orders">
              <Button variant="outline">Back to Orders</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const customer = order.customers;
  const customerName = customer
    ? [customer.first_name, customer.last_name].filter(Boolean).join(" ") || customer.email
    : "Unknown";

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Link href="/admin/orders">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {order.order_number ?? `#${order.id.slice(0, 8)}`}
                </h1>
                <p className="text-muted-foreground">
                  Placed on {new Date(order.created_at).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <Badge className={statusColors[order.status] ?? "bg-gray-100 text-gray-800"}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                  <CardDescription>{order.order_items.length} item{order.order_items.length !== 1 ? "s" : ""}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.order_items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-md bg-muted overflow-hidden flex-shrink-0">
                                  {item.products?.image_url && (
                                    <img src={item.products.image_url} alt="" className="h-full w-full object-cover" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{item.products?.name ?? "Unknown Product"}</p>
                                  {item.products?.brand && (
                                    <p className="text-xs text-muted-foreground">{item.products.brand}</p>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{item.products?.sku ?? "-"}</TableCell>
                            <TableCell>${Number(item.unit_price).toFixed(2)}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell className="text-right font-medium">${Number(item.total_price).toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${Number(order.subtotal).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{order.shipping_cost > 0 ? `$${Number(order.shipping_cost).toFixed(2)}` : "Free"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${Number(order.tax).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base pt-2 border-t">
                      <span>Total</span>
                      <span>${Number(order.total).toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Customer</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    <p className="font-medium">{customerName}</p>
                    {customer?.email && <p className="text-muted-foreground">{customer.email}</p>}
                    {customer?.phone && <p className="text-muted-foreground">{customer.phone}</p>}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm whitespace-pre-line">
                    {order.shippingAddress ? (
                      <>
                        <p>{order.shippingAddress.line1}</p>
                        {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postal_code}</p>
                        <p>{order.shippingAddress.country}</p>
                      </>
                    ) : (
                      <p className="text-muted-foreground">N/A</p>
                    )}
                  </CardContent>
                </Card>

                {order.shipping_method && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Shipping Method</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                      <p className="font-medium">{order.shipping_method.label}</p>
                      {order.shipping_method.description && (
                        <p className="text-muted-foreground">{order.shipping_method.description}</p>
                      )}
                      <p className="text-muted-foreground">{order.shipping_method.estimatedDays}</p>
                    </CardContent>
                  </Card>
                )}

                {order.payment_method && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                      <p className="font-medium capitalize">{order.payment_method.method.replace(/-/g, " ")}</p>
                      {order.payment_method.cardholderName && (
                        <p className="text-muted-foreground">{order.payment_method.cardholderName}</p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {order.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Notes</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p>{order.notes}</p>
                    </CardContent>
                  </Card>
                )}

                {order.tracking_number && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Tracking</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="font-mono">{order.tracking_number}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
