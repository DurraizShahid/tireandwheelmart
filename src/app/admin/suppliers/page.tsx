"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, ExternalLink } from "lucide-react";

interface Supplier {
  id: string;
  business_name: string;
  business_email: string | null;
  commission_rate: number;
  order_handling: string;
  is_active: boolean;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("suppliers").select("*").order("business_name");
      if (data) setSuppliers(data);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
                <p className="text-muted-foreground">Manage vendor accounts</p>
              </div>
              <Link href="/admin/suppliers/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Supplier
                </Button>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Suppliers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>Order Handling</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            Loading...
                          </TableCell>
                        </TableRow>
                      ) : suppliers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No suppliers yet
                          </TableCell>
                        </TableRow>
                      ) : (
                        suppliers.map((s) => (
                          <TableRow key={s.id}>
                            <TableCell className="font-medium">{s.business_name}</TableCell>
                            <TableCell>{s.business_email ?? "—"}</TableCell>
                            <TableCell>{s.commission_rate}%</TableCell>
                            <TableCell>
                              <Badge variant={s.order_handling === "self" ? "default" : "secondary"}>
                                {s.order_handling === "self" ? "Self" : "Admin"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                s.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}>
                                {s.is_active ? "Active" : "Inactive"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Link href={`/admin/suppliers/${s.id}/edit`}>
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
