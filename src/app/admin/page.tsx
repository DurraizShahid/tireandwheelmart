"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, Users, ShoppingCart, DollarSign, Loader2 } from "lucide-react";
import { LeadDashboardWidgets } from "@/components/leads/lead-dashboard-widgets";
import { OpportunityDashboardWidgets } from "@/components/opportunities/opportunity-dashboard-widgets";
import { useTranslation } from "@/i18n/use-locale";

const statusColors: Record<string, string> = {
  delivered: "text-green-600",
  shipped: "text-blue-600",
  processing: "text-yellow-600",
  pending: "text-orange-600",
  confirmed: "text-blue-600",
  cancelled: "text-red-600",
  refunded: "text-purple-600",
};

interface DashboardData {
  kpis: {
    totalRevenue: number;
    revenueChange: number;
    totalSales: number;
    orderChange: number;
    totalCustomers: number;
    customerChange: number;
    recentOrders: {
      id: string;
      total: number;
      status: string;
      customer: string;
      date: string;
    }[];
  };
  chartData: { month: string; revenue: number; sales: number }[];
}

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((d) => setData(d.kpis ? d : null))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const kpis = data?.kpis;

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t("admin.dashboard.title")}</h1>
              <p className="text-muted-foreground">{t("admin.dashboard.subtitle")}</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : !kpis ? (
              <p className="text-center text-muted-foreground py-16">{t("admin.dashboard.failedToLoad")}</p>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{t("admin.dashboard.totalRevenue")}</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${kpis.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
                      <p className="text-xs text-muted-foreground">
                        {kpis.revenueChange >= 0 ? "+" : ""}{kpis.revenueChange.toFixed(1)}% {t("admin.dashboard.fromLastMonth")}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{t("admin.dashboard.totalSales")}</CardTitle>
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{kpis.totalSales.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">
                        {kpis.orderChange >= 0 ? "+" : ""}{kpis.orderChange.toFixed(1)}% {t("admin.dashboard.fromLastMonth")}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{t("admin.dashboard.totalCustomers")}</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{kpis.totalCustomers.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">
                        {kpis.customerChange >= 0 ? "+" : ""}{kpis.customerChange.toFixed(1)}% {t("admin.dashboard.fromLastMonth")}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{t("admin.dashboard.conversionRate")}</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {kpis.totalCustomers > 0
                          ? ((kpis.totalSales / kpis.totalCustomers) * 100).toFixed(1)
                          : "0"}%
                      </div>
                      <p className="text-xs text-muted-foreground">{t("admin.dashboard.ordersPerCustomer")}</p>
                    </CardContent>
                  </Card>
                </div>

                <LeadDashboardWidgets />

                <OpportunityDashboardWidgets />

                <div className="grid gap-4 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("admin.dashboard.salesOverview")}</CardTitle>
                      <CardDescription>{t("admin.dashboard.salesOverviewDesc")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {data.chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={data.chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="sales" fill="#dc2626" name={t("admin.dashboard.totalSales")} />
                            <Bar yAxisId="right" dataKey="revenue" fill="#2563eb" name={t("admin.dashboard.totalRevenue")} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-center text-muted-foreground py-12">{t("admin.dashboard.noSalesData")}</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t("admin.dashboard.revenueTrend")}</CardTitle>
                      <CardDescription>{t("admin.dashboard.revenueTrendDesc")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {data.chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={data.chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, t("admin.dashboard.totalRevenue")]} />
                            <Line type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-center text-muted-foreground py-12">{t("admin.dashboard.noRevenueData")}</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("admin.dashboard.recentOrders")}</CardTitle>
                    <CardDescription>{t("admin.dashboard.recentOrdersDesc")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {kpis.recentOrders.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">{t("admin.dashboard.noOrdersYet")}</p>
                    ) : (
                      <div className="space-y-4">
                        {kpis.recentOrders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{t("admin.common.order")} #{order.id.slice(0, 8)}</p>
                              <p className="text-sm text-muted-foreground">{order.customer}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${order.total.toFixed(2)}</p>
                              <p className={`text-sm ${statusColors[order.status] ?? "text-gray-600"}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
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
