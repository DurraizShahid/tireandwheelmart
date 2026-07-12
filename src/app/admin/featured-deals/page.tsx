"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ExternalLink, ArrowUpDown, GripVertical, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { Promotion } from "@/lib/supabase/types";

export default function FeaturedDealsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [allPromotions, setAllPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const [featuredRes, allRes] = await Promise.all([
      supabase
        .from("promotions")
        .select("*")
        .eq("show_on_homepage", true)
        .order("homepage_order"),
      supabase
        .from("promotions")
        .select("*")
        .order("name"),
    ]);

    if (featuredRes.error) setError(featuredRes.error.message);
    else if (featuredRes.data) setPromotions(featuredRes.data);

    if (!allRes.error && allRes.data) setAllPromotions(allRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleHomepage = async (promo: Promotion, show: boolean) => {
    const { error: updateErr } = await supabase
      .from("promotions")
      .update({
        show_on_homepage: show,
        homepage_order: show ? (promotions.length > 0 ? Math.max(...promotions.map((p) => p.homepage_order)) + 1 : 0) : 0,
      })
      .eq("id", promo.id);

    if (updateErr) {
      toast.error(updateErr.message);
      return;
    }

    toast.success(show ? `"${promo.name}" added to homepage` : `"${promo.name}" removed from homepage`);
    fetchData();
  };

  const updateOrder = async (id: string, order: number) => {
    const { error: updateErr } = await supabase
      .from("promotions")
      .update({ homepage_order: order })
      .eq("id", id);

    if (updateErr) {
      toast.error(updateErr.message);
      return;
    }

    setPromotions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, homepage_order: order } : p)).sort((a, b) => a.homepage_order - b.homepage_order)
    );
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const current = promotions[index];
    const prev = promotions[index - 1];
    await Promise.all([
      updateOrder(current.id, prev.homepage_order),
      updateOrder(prev.id, current.homepage_order),
    ]);
    fetchData();
  };

  const moveDown = async (index: number) => {
    if (index === promotions.length - 1) return;
    const current = promotions[index];
    const next = promotions[index + 1];
    await Promise.all([
      updateOrder(current.id, next.homepage_order),
      updateOrder(next.id, current.homepage_order),
    ]);
    fetchData();
  };

  const availablePromotions = allPromotions.filter(
    (p) => !promotions.some((fp) => fp.id === p.id) && p.is_active
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
              <Link href="/admin/promotions/new">
                <Button className="gap-2">
                  Create New Promotion
                </Button>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Homepage Deals ({promotions.length})</CardTitle>
                <CardDescription>
                  These promotions are displayed in the &ldquo;Featured Deals&rdquo; section on the homepage.
                  Drag to reorder or toggle visibility.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : error ? (
                  <div className="text-center py-12 text-red-600">{error}</div>
                ) : promotions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No featured deals configured yet</p>
                    <p className="text-sm text-muted-foreground">
                      Go to <Link href="/admin/promotions" className="text-blue-600 hover:underline">Promotions</Link> and toggle
                      &ldquo;Show on Homepage&rdquo; for any promotion to feature it here.
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
                        {promotions.map((p, index) => (
                          <TableRow key={p.id}>
                            <TableCell>
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Input
                                  type="number"
                                  value={p.homepage_order}
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
                                    disabled={index === promotions.length - 1}
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
                              <div className="flex gap-1">
                                <Switch
                                  checked={p.show_on_homepage}
                                  onCheckedChange={(checked) => toggleHomepage(p, checked)}
                                />
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
                              <Switch
                                checked={false}
                                onCheckedChange={(checked) => toggleHomepage(p, checked)}
                              />
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
