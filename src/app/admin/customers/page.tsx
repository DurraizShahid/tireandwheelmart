"use client";

import { useAdmin } from "@/contexts/admin-context";
import { AdminLogin } from "@/components/admin-login";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Edit } from "lucide-react";

export default function CustomersPage() {
  const { isLoggedIn } = useAdmin();

  if (!isLoggedIn) {
    return <AdminLogin />;
  }

  const customers = [
    { id: 1, name: "John Doe", email: "john@example.com", phone: "+1-555-0101", orders: 5, joined: "2023-06-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "+1-555-0102", orders: 3, joined: "2023-07-20" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", phone: "+1-555-0103", orders: 8, joined: "2023-08-10" },
    { id: 4, name: "Sarah Williams", email: "sarah@example.com", phone: "+1-555-0104", orders: 2, joined: "2023-09-05" },
    { id: 5, name: "Tom Brown", email: "tom@example.com", phone: "+1-555-0105", orders: 6, joined: "2023-10-12" },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
              <p className="text-muted-foreground">Manage and view customer information</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{customers.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">567</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.8</div>
                </CardContent>
              </Card>
            </div>

            {/* Customers Table */}
            <Card>
              <CardHeader>
                <CardTitle>Customer List</CardTitle>
                <CardDescription>All registered customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell className="font-medium">{customer.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              {customer.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              {customer.phone}
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">{customer.orders}</TableCell>
                          <TableCell>{customer.joined}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
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
