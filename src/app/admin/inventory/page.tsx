"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  DollarSign, Package, AlertTriangle, XCircle, ArrowUp, RefreshCw, Loader2,
} from "lucide-react";
import { useTranslation } from "@/i18n/use-locale";
import type { InventoryDashboardData } from "@/lib/supabase/types";

export default function InventoryDashboardPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<InventoryDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/inventory")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-muted/30">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("inventory.dashboard.title") || "Inventory Dashboard"}</h1>
                <p className="text-muted-foreground">{t("inventory.dashboard.subtitle") || "Monitor stock levels and inventory activity"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/admin/inventory/transactions">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 rtl:ml-1.5 ltr:mr-1.5" />
                    {t("inventory.dashboard.transactions") || "Transactions"}
                  </Button>
                </Link>
                <Link href="/admin/inventory/alerts">
                  <Button variant="outline" size="sm">
                    <AlertTriangle className="h-4 w-4 rtl:ml-1.5 ltr:mr-1.5" />
                    {t("inventory.dashboard.alerts") || "Alerts"}
                  </Button>
                </Link>
              </div>
            </div>

            {!data ? (
              <p className="text-center text-muted-foreground py-16">{t("admin.common.noData")}</p>
            ) : (
              <>
                {/* KPI Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{t("inventory.dashboard.totalValue") || "Inventory Value"}</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${data.totalInventoryValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
                      <p className="text-xs text-muted-foreground">{t("inventory.dashboard.atCost") || "at cost"}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{t("inventory.dashboard.totalStock") || "Total Stock"}</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{data.totalStock.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">{t("inventory.dashboard.units") || "units across all products"}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-yellow-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{t("inventory.dashboard.lowStock") || "Low Stock"}</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-yellow-600">{data.lowStockCount}</div>
                      <p className="text-xs text-muted-foreground">{t("inventory.dashboard.belowThreshold") || "products below threshold"}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-red-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{t("inventory.dashboard.outOfStock") || "Out of Stock"}</CardTitle>
                      <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">{data.outOfStockCount}</div>
                      <p className="text-xs text-muted-foreground">{t("inventory.dashboard.needRestock") || "need restock"}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{t("inventory.dashboard.overstock") || "Overstocked"}</CardTitle>
                      <ArrowUp className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{data.overstockCount}</div>
                      <p className="text-xs text-muted-foreground">{t("inventory.dashboard.excess") || "excess stock"}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Movement Chart + Top Products */}
                <div className="grid gap-4 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("inventory.dashboard.movementChart") || "Inventory Movement (30d)"}</CardTitle>
                      <CardDescription>{t("inventory.dashboard.movementDesc") || "Sales, returns, and adjustments"}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {data.movementChart.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={data.movementChart}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="sales" fill="#dc2626" name={t("inventory.dashboard.sales") || "Sales"} />
                            <Bar dataKey="returns" fill="#16a34a" name={t("inventory.dashboard.returns") || "Returns"} />
                            <Bar dataKey="adjustments" fill="#2563eb" name={t("inventory.dashboard.adjustments") || "Adjustments"} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-center text-muted-foreground py-12">{t("admin.dashboard.noSalesData")}</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t("inventory.dashboard.topMoving") || "Top Moving Products"}</CardTitle>
                      <CardDescription>{t("inventory.dashboard.topMovingDesc") || "Highest transaction volume"}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {data.topMovingProducts.length > 0 ? (
                        <div className="space-y-3">
                          {data.topMovingProducts.map((p, i) => (
                            <div key={p.product_id} className="flex items-center justify-between p-2 border rounded-lg">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                                <span className="text-sm font-medium truncate max-w-[200px]">{p.product_name}</span>
                              </div>
                              <Badge variant="secondary">{p.total_qty} {t("inventory.dashboard.unitsSold") || "sold"}</Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-8">{t("admin.common.noData")}</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Transactions */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t("inventory.dashboard.recentActivity") || "Recent Inventory Activity"}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {data.recentTransactions.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">{t("admin.common.noData")}</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t("admin.common.date") || "Date"}</TableHead>
                            <TableHead>{t("admin.common.product") || "Product"}</TableHead>
                            <TableHead>{t("inventory.dashboard.type") || "Type"}</TableHead>
                            <TableHead className="text-right">{t("inventory.dashboard.quantity") || "Qty"}</TableHead>
                            <TableHead className="text-right">{t("inventory.dashboard.balance") || "Balance"}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.recentTransactions.slice(0, 10).map((tx) => (
                            <TableRow key={tx.id}>
                              <TableCell className="text-sm text-muted-foreground">
                                {new Date(tx.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-sm">
                                {((tx as unknown) as Record<string, unknown>).products as string ?? tx.product_id.slice(0, 8)}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs capitalize">{tx.transaction_type.replace(/_/g, " ")}</Badge>
                              </TableCell>
                              <TableCell className={`text-right text-sm font-medium ${tx.quantity >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {tx.quantity >= 0 ? "+" : ""}{tx.quantity}
                              </TableCell>
                              <TableCell className="text-right text-sm">{tx.new_quantity}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
