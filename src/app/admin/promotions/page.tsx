"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ExternalLink } from "lucide-react";
import type { Promotion } from "@/lib/supabase/types";

const typeLabels: Record<string, string> = {
  percentage: "Percentage",
  fixed: "Fixed Amount",
  bundle_tires: "Bundle (Tires)",
  bundle: "Bundle",
  free_shipping: "Free Shipping",
  category: "Category",
  brand: "Brand",
  product: "Product",
  flash_sale: "Flash Sale",
  clearance: "Clearance",
  first_order: "First Order",
};

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("promotions").select("*").order("priority");
      if (data) setPromotions(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const formatValue = (p: Promotion) => {
    if (p.type === "percentage") return `${p.value}%`;
    if (p.type === "free_shipping") return `Free over $${p.min_subtotal ?? 0}`;
    return `$${p.value}`;
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Promotions</h1>
                <p className="text-muted-foreground">Manage discounts and promotional offers</p>
              </div>
              <Link href="/admin/promotions/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Promotion
                </Button>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Promotions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell>
                        </TableRow>
                      ) : promotions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No promotions yet</TableCell>
                        </TableRow>
                      ) : (
                        promotions.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell className="font-medium">{p.name}</TableCell>
                            <TableCell>{typeLabels[p.type] ?? p.type}</TableCell>
                            <TableCell>{formatValue(p)}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                p.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}>
                                {p.is_active ? "Active" : "Inactive"}
                              </span>
                            </TableCell>
                            <TableCell>{p.priority}</TableCell>
                            <TableCell>
                              <Link href={`/admin/promotions/${p.id}/edit`}>
                                <Button variant="ghost" size="sm">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
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
