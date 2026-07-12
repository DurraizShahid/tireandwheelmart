"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Category } from "@/lib/supabase/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase.from("categories").select("*").order("display_order");
      if (error) setError(error.message);
      else if (data) setCategories(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Category deleted");
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Failed to delete category");
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
                <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                <p className="text-muted-foreground">Manage product categories</p>
              </div>
              <Link href="/admin/categories/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Category
                </Button>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Homepage</TableHead>
                        <TableHead>Display Order</TableHead>
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
                        ) : categories.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No categories yet</TableCell>
                        </TableRow>
                      ) : (
                        categories.map((c) => (
                          <TableRow key={c.id}>
                            <TableCell className="font-medium">{c.name}</TableCell>
                            <TableCell><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{c.slug}</code></TableCell>
                            <TableCell className="max-w-xs truncate">{c.description ?? "—"}</TableCell>
                            <TableCell>
                              {c.homepage_category ? (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Homepage</span>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell>{c.display_order}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Link href={`/admin/categories/${c.id}/edit`}>
                                  <Button variant="ghost" size="sm">
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id, c.name)}>
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
