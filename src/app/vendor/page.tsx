"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign } from "lucide-react";

interface SupplierInfo {
  business_name: string;
  commission_rate: number;
  order_handling: string;
}

export default function VendorDashboard() {
  const [supplier, setSupplier] = useState<SupplierInfo | null>(null);
  const [stats, setStats] = useState({ products: 0, orders: 0 });

  useEffect(() => {
    const loadData = async () => {
      const supRes = await fetch("/api/vendor/supplier");
      if (supRes.ok) {
        const data = await supRes.json();
        setSupplier(data);
      }

      const prodRes = await fetch("/api/vendor/products");
      if (prodRes.ok) {
        const data = await prodRes.json();
        setStats((s) => ({ ...s, products: data.length }));
      }

      const ordRes = await fetch("/api/vendor/orders");
      if (ordRes.ok) {
        const data = await ordRes.json();
        setStats((s) => ({ ...s, orders: data.length }));
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {supplier?.business_name ?? "Vendor Dashboard"}
        </h1>
        <p className="text-muted-foreground">
          {supplier
            ? `${supplier.order_handling === "self" ? "Self-fulfill" : "Admin handles"} orders · ${supplier.commission_rate}% commission`
            : "Loading..."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.products}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.orders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{supplier?.commission_rate ?? "—"}%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
