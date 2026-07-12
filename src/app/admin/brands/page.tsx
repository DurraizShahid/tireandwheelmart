"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ExternalLink, Trash2, Database, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import type { Brand } from "@/lib/supabase/types";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [populating, setPopulating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draftHomepage, setDraftHomepage] = useState<Record<string, boolean>>({});
  const [draftActive, setDraftActive] = useState<Record<string, boolean>>({});

  const dirtyCount = useMemo(() => {
    const ids = new Set([...Object.keys(draftHomepage), ...Object.keys(draftActive)]);
    return ids.size;
  }, [draftHomepage, draftActive]);

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

  const handleToggleHomepage = (id: string) => {
    setDraftHomepage((prev) => {
      const next = { ...prev };
      const brand = brands.find((b) => b.id === id);
      const currentValue = brand?.show_on_homepage ?? false;
      const toggledValue = id in prev ? prev[id] : currentValue;
      if (toggledValue === !currentValue) {
        delete next[id];
      } else {
        next[id] = !toggledValue;
      }
      return next;
    });
  };

  const getHomepageValue = (brand: Brand) => {
    if (brand.id in draftHomepage) return draftHomepage[brand.id];
    return brand.show_on_homepage;
  };

  const handleToggleActive = (id: string) => {
    setDraftActive((prev) => {
      const next = { ...prev };
      const brand = brands.find((b) => b.id === id);
      const currentValue = brand?.is_active ?? true;
      const toggledValue = id in prev ? prev[id] : currentValue;
      if (toggledValue === !currentValue) {
        delete next[id];
      } else {
        next[id] = !toggledValue;
      }
      return next;
    });
  };

  const getActiveValue = (brand: Brand) => {
    if (brand.id in draftActive) return draftActive[brand.id];
    return brand.is_active;
  };

  const handleSave = async () => {
    setSaving(true);
    const toSave = new Set([...Object.keys(draftHomepage), ...Object.keys(draftActive)]);
    let success = 0;
    for (const id of toSave) {
      const body: Record<string, unknown> = {};
      if (id in draftHomepage) body.show_on_homepage = draftHomepage[id];
      if (id in draftActive) body.is_active = draftActive[id];
      const res = await fetch(`/api/admin/brands/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) success++;
    }
    setBrands((prev) =>
      prev.map((b) => ({
        ...b,
        show_on_homepage: b.id in draftHomepage ? draftHomepage[b.id] : b.show_on_homepage,
        is_active: b.id in draftActive ? draftActive[b.id] : b.is_active,
      }))
    );
    setDraftHomepage({});
    setDraftActive({});
    setSaving(false);
    toast.success(`${success} brand${success !== 1 ? "s" : ""} updated`);
  };

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
            {dirtyCount > 0 && (
              <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                <p className="text-sm text-amber-800 font-medium">{dirtyCount} unsaved change{dirtyCount !== 1 ? "s" : ""}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setDraftHomepage({}); setDraftActive({}); }}>Discard</Button>
                  <Button size="sm" onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

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
                        <TableHead>Homepage</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</TableCell>
                        </TableRow>
                      ) : error ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-red-600">{error}</TableCell>
                        </TableRow>
                      ) : brands.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No brands yet</TableCell>
                        </TableRow>
                      ) : (
                        brands.map((b) => {
                          const isDirty = b.id in draftHomepage || b.id in draftActive;
                          const homepageValue = getHomepageValue(b);
                          const activeValue = getActiveValue(b);
                          return (
                            <TableRow key={b.id} className={isDirty ? "bg-amber-50/50" : ""}>
                              <TableCell className="font-medium">{b.name}</TableCell>
                              <TableCell><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{b.slug}</code></TableCell>
                              <TableCell className="max-w-xs truncate">{b.image_url ? <span className="text-xs">Has logo</span> : <span className="text-muted-foreground">—</span>}</TableCell>
                              <TableCell>{b.display_order}</TableCell>
                              <TableCell>
                                <Switch
                                  checked={activeValue}
                                  onCheckedChange={() => handleToggleActive(b.id)}
                                />
                              </TableCell>
                              <TableCell>
                                <Switch
                                  checked={homepageValue}
                                  onCheckedChange={() => handleToggleHomepage(b.id)}
                                />
                              </TableCell>
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
                          );
                        })
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
