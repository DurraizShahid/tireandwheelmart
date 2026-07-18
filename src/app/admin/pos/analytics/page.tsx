"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  DollarSign,
  ShoppingCart,
  ClipboardList,
  TrendingUp,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "@/i18n/use-locale";
import type { POSAnalytics } from "@/lib/pos-types";

const PAYMENT_COLORS: Record<string, string> = {
  cash: "#22c55e",
  credit_card: "#3b82f6",
  debit_card: "#f59e0b",
  bank_transfer: "#8b5cf6",
};

export default function POSAnalyticsPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<POSAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/admin/pos/analytics");
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const result = await res.json();
      setData(result);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("pos.analytics.title")}</h1>
                <p className="text-muted-foreground">{t("pos.analytics.subtitle")}</p>
              </div>
              <Button variant="outline" size="sm" onClick={fetchAnalytics} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                {t("pos.analytics.refresh")}
              </Button>
            </div>

            {loading ? (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <Skeleton className="h-4 w-24" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-8 w-32" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-5 w-40" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-64 w-full rounded-lg" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-5 w-40" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-64 w-full rounded-lg" />
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : error ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-semibold mb-2">{t("pos.analytics.failedToLoad")}</p>
                  <p className="text-muted-foreground text-sm mb-4">
                    {t("pos.analytics.failedToLoadDesc")}
                  </p>
                  <Button variant="default" onClick={fetchAnalytics}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {t("pos.analytics.retry")}
                  </Button>
                </CardContent>
              </Card>
            ) : data ? (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {t("pos.analytics.todaySales")}
                      </CardTitle>
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{data.todaySales}</div>
                      <p className="text-xs text-muted-foreground">{t("pos.analytics.items")}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {t("pos.analytics.todayRevenue")}
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${data.todayRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </div>
                      <p className="text-xs text-muted-foreground">{t("pos.analytics.revenue")}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {t("pos.analytics.todayOrders")}
                      </CardTitle>
                      <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{data.todayOrders}</div>
                      <p className="text-xs text-muted-foreground">{t("pos.analytics.orders")}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {t("pos.analytics.avgOrderValue")}
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${data.averageOrderValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </div>
                      <p className="text-xs text-muted-foreground">{t("pos.analytics.perOrder")}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("pos.analytics.salesByHour")}</CardTitle>
                      <CardDescription>{t("pos.analytics.salesByHourDesc")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {data.salesByHour.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={data.salesByHour}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="hour"
                              tickFormatter={(h) => `${h}:00`}
                            />
                            <YAxis />
                            <Tooltip
                              labelFormatter={(h) => `${h}:00`}
                              formatter={(value: number, name: string) => [
                                name === "sales" ? value : `$${value.toFixed(2)}`,
                                name === "sales" ? "Sales (items)" : "Revenue",
                              ]}
                            />
                            <Legend />
                            <Bar
                              dataKey="sales"
                              fill="#dc2626"
                              name="Sales"
                              radius={[4, 4, 0, 0]}
                            />
                            <Bar
                              dataKey="revenue"
                              fill="#2563eb"
                              name="Revenue"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-center text-muted-foreground py-12">
                          {t("pos.analytics.noHourlyData")}
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t("pos.analytics.paymentMethods")}</CardTitle>
                      <CardDescription>{t("pos.analytics.paymentMethodsDesc")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {data.paymentMethodBreakdown.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={data.paymentMethodBreakdown}
                              dataKey="total"
                              nameKey="method"
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              label={({ method, percent }) =>
                                `${method.replace(/_/g, " ")} (${(percent * 100).toFixed(0)}%)`
                              }
                            >
                              {data.paymentMethodBreakdown.map((entry) => (
                                <Cell
                                  key={entry.method}
                                  fill={PAYMENT_COLORS[entry.method] || "#6b7280"}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value: number, name: string) => [
                                `$${value.toFixed(2)}`,
                                name.replace(/_/g, " "),
                              ]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-center text-muted-foreground py-12">
                          {t("pos.analytics.noPaymentData")}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("pos.analytics.bestSelling")}</CardTitle>
                      <CardDescription>{t("pos.analytics.bestSellingDesc")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {data.bestSellingProducts.length > 0 ? (
                        <div className="space-y-4">
                          {data.bestSellingProducts.map((product, idx) => (
                            <div key={product.product_id} className="flex items-center gap-3">
                              <span className="text-sm font-bold text-muted-foreground w-6">
                                #{idx + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{product.product_name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {product.total_qty} sold &middot; $
                                  {product.total_revenue.toFixed(2)} revenue
                                </p>
                              </div>
                              <Badge variant="secondary" className="shrink-0">
                                {product.total_qty} {t("pos.analytics.units")}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-12">
                          {t("pos.analytics.noProductData")}
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t("pos.analytics.recentTransactions")}</CardTitle>
                      <CardDescription>{t("pos.analytics.recentTransactionsDesc")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {data.recentTransactions.length > 0 ? (
                        <div className="space-y-3">
                          {data.recentTransactions.map((tx) => (
                            <div
                              key={tx.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">
                                  {tx.order_number}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {tx.customer_name}
                                </p>
                              </div>
                              <div className="text-right shrink-0 ml-4">
                                <p className="text-sm font-semibold">
                                  ${tx.total.toFixed(2)}
                                </p>
                                <Badge variant="outline" className="text-[10px] capitalize">
                                  {tx.payment_method.replace(/_/g, " ")}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-12">
                          {t("pos.analytics.noTransactions")}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
