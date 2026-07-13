"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, CheckCircle2 } from "lucide-react";

interface OrderDetail {
  id: string;
  order_number: string | null;
  status: string;
  subtotal: number;
  tax: number;
  shipping_cost: number;
  total: number;
  created_at: string;
  shipping_method: { label: string; description: string; estimatedDays: string } | null;
  order_items: Array<{
    id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    products: { name: string; slug: string; image_url: string; brand: string | null } | null;
  }>;
  shippingAddress: {
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

export default function MyOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewedProductIds, setReviewedProductIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) { router.push("/sign-in"); return; }
    fetch(`/api/orders/my/${params.id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(res.status === 404 ? "Order not found" : "Failed to load order");
        setOrder(await res.json());
      })
      .catch((e) => setError(e.message ?? "Failed to load order"))
      .finally(() => setLoading(false));
  }, [isLoaded, isSignedIn, params.id, router]);

  useEffect(() => {
    if (!order?.order_items) return;
    Promise.all(
      order.order_items.map((item) =>
        fetch(`/api/reviews/can-review?productId=${encodeURIComponent(item.product_id)}`).then((r) => r.json())
      )
    ).then((results) => {
      const reviewed = new Set<string>();
      results.forEach((r, i) => {
        if (r.reason === "already-reviewed") reviewed.add(order.order_items[i].product_id);
      });
      setReviewedProductIds(reviewed);
    });
  }, [order]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-lg font-medium">{error ?? "Order not found"}</p>
        <Link href="/account/orders">
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account/orders">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{order.order_number ?? `#${order.id.slice(0, 8)}`}</h1>
            <p className="text-muted-foreground">Placed on {new Date(order.created_at).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          <Badge className={statusColors[order.status] ?? "bg-gray-100 text-gray-800"}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-center">Review</TableHead>
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
                              <p className="font-medium text-sm">{item.products?.name ?? "Product"}</p>
                              {item.products?.brand && <p className="text-xs text-muted-foreground">{item.products.brand}</p>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>${Number(item.unit_price).toFixed(2)}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="text-right font-medium">${Number(item.total_price).toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                          {reviewedProductIds.has(item.product_id) ? (
                            <div className="flex items-center justify-center gap-1 text-xs text-green-600 font-medium">
                              <CheckCircle2 className="h-3 w-3" />
                              Reviewed
                            </div>
                          ) : item.products?.slug ? (
                            <Link href={`/product/${item.products.slug}?review=1`}>
                              <Button variant="outline" size="sm" className="whitespace-nowrap">
                                Write a Review
                              </Button>
                            </Link>
                          ) : (
                            <span className="text-xs text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
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

            {order.shipping_method && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Method</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p className="font-medium">{order.shipping_method.label}</p>
                  {order.shipping_method.description && <p className="text-muted-foreground">{order.shipping_method.description}</p>}
                  <p className="text-muted-foreground">{order.shipping_method.estimatedDays}</p>
                </CardContent>
              </Card>
            )}

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
          </div>
        </div>
      </div>
    </div>
  );
}
