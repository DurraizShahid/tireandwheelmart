"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, Users, ShoppingCart, DollarSign, Loader2 } from "lucide-react";

interface AnalyticsData {
  kpis: {
    monthlyRevenue: number;
    revenueChange: number;
    newCustomers: number;
    customerChange: number;
    totalOrders: number;
    orderChange: number;
    avgOrderValue: number;
  };
  categoryData: { name: string; value: number }[];
  monthlySales: { month: string; revenue: number; orders: number }[];
}

const COLORS = ["#dc2626", "#2563eb", "#16a34a", "#ea580c", "#7c3aed", "#0891b2"];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
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
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
              <p className="text-muted-foreground">Detailed business insights and metrics</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : !kpis ? (
              <p className="text-center text-muted-foreground py-16">Failed to load analytics data.</p>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${kpis.monthlyRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
                      <p className="text-xs text-muted-foreground">
                        {kpis.revenueChange >= 0 ? "+" : ""}{kpis.revenueChange.toFixed(1)}% from last month
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">New Customers</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+{kpis.newCustomers}</div>
                      <p className="text-xs text-muted-foreground">
                        {kpis.customerChange >= 0 ? "+" : ""}{kpis.customerChange.toFixed(1)}% from last month
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{kpis.totalOrders.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">
                        {kpis.orderChange >= 0 ? "+" : ""}{kpis.orderChange.toFixed(1)}% from last month
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${kpis.avgOrderValue.toFixed(2)}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Monthly Sales Trend</CardTitle>
                      <CardDescription>Revenue over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {data.monthlySales.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={data.monthlySales}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]} />
                            <Line type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-center text-muted-foreground py-12">No sales data yet.</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Product Categories</CardTitle>
                      <CardDescription>Products by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {data.categoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={data.categoryData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={2}
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {data.categoryData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-center text-muted-foreground py-12">No product data yet.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Quarterly Comparison</CardTitle>
                    <CardDescription>Orders and revenue by month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {data.monthlySales.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.monthlySales}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Bar yAxisId="left" dataKey="orders" fill="#2563eb" name="Orders" />
                          <Bar yAxisId="right" dataKey="revenue" fill="#dc2626" name="Revenue" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-center text-muted-foreground py-12">No data yet.</p>
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
