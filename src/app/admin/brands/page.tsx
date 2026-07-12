"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ExternalLink, Trash2, Database, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Brand } from "@/lib/supabase/types";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [populating, setPopulating] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/brands");
        if (!res.ok) throw new Error("Failed to fetch");
        const data: Brand[] = await res.json();
        setBrands(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to fetch brands");
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/brands/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Brand deleted");
      setBrands((prev) => prev.filter((b) => b.id !== id));
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Failed to delete brand");
    }
  };

  const handlePopulate = async () => {
    setPopulating(true);
    try {
      const res = await fetch("/api/admin/brands/populate", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to populate");
      toast.success(data.message);
      const reload = await fetch("/api/admin/brands");
      if (reload.ok) setBrands(await reload.json());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to populate brands");
    } finally {
      setPopulating(false);
    }
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
                <h1 className="text-3xl font-bold tracking-tight">Brands</h1>
                <p className="text-muted-foreground">Manage tire and wheel brands</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2" onClick={handlePopulate} disabled={populating}>
                  {populating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
                  {populating ? "Populating..." : "Populate from Products"}
                </Button>
                <Link href="/admin/brands/new">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Brand
                  </Button>
                </Link>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Brands</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Image URL</TableHead>
                        <TableHead>Display Order</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell>
                        </TableRow>
                      ) : error ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-red-600">{error}</TableCell>
                        </TableRow>
                      ) : brands.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No brands yet</TableCell>
                        </TableRow>
                      ) : (
                        brands.map((b) => (
                          <TableRow key={b.id}>
                            <TableCell className="font-medium">{b.name}</TableCell>
                            <TableCell><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{b.slug}</code></TableCell>
                            <TableCell className="max-w-xs truncate">{b.image_url ?? "—"}</TableCell>
                            <TableCell>{b.display_order}</TableCell>
                            <TableCell>{b.is_active ? "Yes" : "No"}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Link href={`/admin/brands/${b.id}/edit`}>
                                  <Button variant="ghost" size="sm">
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(b.id, b.name)}>
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
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
