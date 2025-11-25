"use client";

import { useAdmin } from "@/contexts/admin-context";
import { AdminLogin } from "@/components/admin-login";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export default function OrdersPage() {
  const { isLoggedIn } = useAdmin();

  if (!isLoggedIn) {
    return <AdminLogin />;
  }

  const orders = [
    { id: 1001, customer: "John Doe", email: "john@example.com", total: "$234.56", status: "Delivered", date: "2024-01-15" },
    { id: 1002, customer: "Jane Smith", email: "jane@example.com", total: "$567.89", status: "Processing", date: "2024-01-16" },
    { id: 1003, customer: "Mike Johnson", email: "mike@example.com", total: "$123.45", status: "Shipped", date: "2024-01-17" },
    { id: 1004, customer: "Sarah Williams", email: "sarah@example.com", total: "$456.78", status: "Delivered", date: "2024-01-18" },
    { id: 1005, customer: "Tom Brown", email: "tom@example.com", total: "$789.01", status: "Pending", date: "2024-01-19" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Pending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
              <p className="text-muted-foreground">Manage customer orders</p>
            </div>

            {/* Orders Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Total orders: {orders.length}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">#{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{order.email}</TableCell>
                          <TableCell className="font-semibold">{order.total}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
