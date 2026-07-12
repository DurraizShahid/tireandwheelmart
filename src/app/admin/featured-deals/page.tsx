"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ExternalLink, ArrowUpDown, GripVertical, Loader2, Sparkles, Save } from "lucide-react";
import { toast } from "sonner";
import { revalidateHomepage } from "@/lib/actions/revalidate";
import type { Promotion } from "@/lib/supabase/types";

export default function FeaturedDealsPage() {
  const [allPromotions, setAllPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Draft state: which promos are on homepage, and their order
  const [draftIds, setDraftIds] = useState<Set<string>>(new Set());
  const [draftOrders, setDraftOrders] = useState<Record<string, number>>({});

  // Track initial state to detect changes
  const [initialIds, setInitialIds] = useState<Set<string>>(new Set());
  const [initialOrders, setInitialOrders] = useState<Record<string, number>>({});

  const fetchData = useCallback(async () => {
    const [featuredRes, allRes] = await Promise.all([
      fetch("/api/admin/featured-deals"),
      fetch("/api/admin/promotions"),
    ]);

    if (!featuredRes.ok || !allRes.ok) {
      toast.error("Failed to load data");
      setLoading(false);
      return;
    }

    const featured: Promotion[] = await featuredRes.json();
    const all: Promotion[] = await allRes.json();

    setAllPromotions(all);

    const ids = new Set(featured.map((p) => p.id));
    const orders: Record<string, number> = {};
    featured.forEach((p) => { orders[p.id] = p.homepage_order; });

    setDraftIds(ids);
    setDraftOrders(orders);
    setInitialIds(new Set(ids));
    setInitialOrders({ ...orders });
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const hasChanges = () => {
    if (draftIds.size !== initialIds.size) return true;
    for (const id of draftIds) {
      if (!initialIds.has(id)) return true;
      if (draftOrders[id] !== initialOrders[id]) return true;
    }
    return false;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const items: Array<{ id: string; show_on_homepage: boolean; homepage_order: number }> = [];

      // Promos to add or update
      for (const id of draftIds) {
        const show = !initialIds.has(id) || true;
        const order = draftOrders[id] ?? 0;
        items.push({ id, show_on_homepage: true, homepage_order: order });
      }

      // Promos to remove
      for (const id of initialIds) {
        if (!draftIds.has(id)) {
          items.push({ id, show_on_homepage: false, homepage_order: 0 });
        }
      }

      if (items.length === 0) {
        toast.info("No changes to save");
        setSaving(false);
        return;
      }

      const res = await fetch("/api/admin/featured-deals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }

      setInitialIds(new Set(draftIds));
      setInitialOrders({ ...draftOrders });
      revalidateHomepage();
      toast.success("Featured deals saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const addToHomepage = (promo: Promotion) => {
    const nextOrder = draftIds.size > 0
      ? Math.max(...Array.from(draftIds).map((id) => draftOrders[id] ?? 0)) + 1
      : 0;
    setDraftIds((prev) => new Set(prev).add(promo.id));
    setDraftOrders((prev) => ({ ...prev, [promo.id]: nextOrder }));
  };

  const removeFromHomepage = (id: string) => {
    setDraftIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const updateOrder = (id: string, order: number) => {
    setDraftOrders((prev) => ({ ...prev, [id]: order }));
  };

  const swapOrder = (indexA: number, indexB: number) => {
    const sorted = Array.from(draftIds)
      .map((id) => ({ id, order: draftOrders[id] ?? 0 }))
      .sort((a, b) => a.order - b.order);

    if (indexA < 0 || indexB >= sorted.length) return;

    const idA = sorted[indexA].id;
    const idB = sorted[indexB].id;
    const orderA = draftOrders[idA] ?? 0;
    const orderB = draftOrders[idB] ?? 0;

    setDraftOrders((prev) => ({ ...prev, [idA]: orderB, [idB]: orderA }));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    swapOrder(index, index - 1);
  };

  const moveDown = (index: number) => {
    const sorted = Array.from(draftIds)
      .map((id) => ({ id, order: draftOrders[id] ?? 0 }))
      .sort((a, b) => a.order - b.order);
    if (index >= sorted.length - 1) return;
    swapOrder(index, index + 1);
  };

  const sortedHomepageIds = Array.from(draftIds)
    .map((id) => ({ id, order: draftOrders[id] ?? 0 }))
    .sort((a, b) => a.order - b.order);

  const homepagePromotions = sortedHomepageIds
    .map(({ id }) => allPromotions.find((p) => p.id === id))
    .filter((p): p is Promotion => p !== undefined);

  const availablePromotions = allPromotions.filter(
    (p) => !draftIds.has(p.id) && p.is_active
  );

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
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                  <Sparkles className="h-7 w-7 text-blue-600" />
                  Featured Deals
                </h1>
                <p className="text-muted-foreground">
                  Manage which deals appear on the homepage and their display order
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="lg"
                  className="gap-2"
                  onClick={handleSave}
                  disabled={saving || !hasChanges()}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Link href="/admin/promotions/new">
                  <Button variant="outline" className="gap-2">
                    Create New Promotion
                  </Button>
                </Link>
              </div>
            </div>

            {hasChanges() && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
                You have unsaved changes. Click &ldquo;Save Changes&rdquo; to apply them.
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Homepage Deals ({draftIds.size})</CardTitle>
                <CardDescription>
                  These promotions will be displayed in the &ldquo;Featured Deals&rdquo; section on the homepage.
                  Changes are saved when you click &ldquo;Save Changes&rdquo;.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : homepagePromotions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No featured deals configured yet</p>
                    <p className="text-sm text-muted-foreground">
                      Use the &ldquo;Add to Homepage&rdquo; section below to feature promotions here.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12"></TableHead>
                          <TableHead>Order</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Badge</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {homepagePromotions.map((p, index) => (
                          <TableRow key={p.id}>
                            <TableCell>
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Input
                                  type="number"
                                  value={draftOrders[p.id] ?? 0}
                                  onChange={(e) => updateOrder(p.id, parseInt(e.target.value) || 0)}
                                  className="w-16 h-8 text-center"
                                />
                                <div className="flex flex-col">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4"
                                    onClick={() => moveUp(index)}
                                    disabled={index === 0}
                                  >
                                    <ArrowUpDown className="h-3 w-3 rotate-180" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4"
                                    onClick={() => moveDown(index)}
                                    disabled={index === homepagePromotions.length - 1}
                                  >
                                    <ArrowUpDown className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{p.name}</TableCell>
                            <TableCell>{p.type}</TableCell>
                            <TableCell>{formatValue(p)}</TableCell>
                            <TableCell>
                              {p.badge_text && (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${p.badge_color ?? "bg-blue-600"}`}>
                                  {p.badge_text}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                p.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}>
                                {p.is_active ? "Active" : "Inactive"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeFromHomepage(p.id)}
                                >
                                  Remove
                                </Button>
                                <Link href={`/admin/promotions/${p.id}/edit`}>
                                  <Button variant="ghost" size="sm">
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {availablePromotions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Add to Homepage</CardTitle>
                  <CardDescription>
                    Active promotions not yet featured on the homepage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {availablePromotions.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell className="font-medium">{p.name}</TableCell>
                            <TableCell>{p.type}</TableCell>
                            <TableCell>{formatValue(p)}</TableCell>
                            <TableCell>
                              <Button size="sm" onClick={() => addToHomepage(p)}>
                                Add to Homepage
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
