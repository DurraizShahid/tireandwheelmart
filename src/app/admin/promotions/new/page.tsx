"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";

const promotionTypes = [
  { value: "percentage", label: "Percentage Off" },
  { value: "fixed", label: "Fixed Amount Off" },
  { value: "free_shipping", label: "Free Shipping" },
  { value: "bundle_tires", label: "Bundle (Tires)" },
  { value: "bundle", label: "Bundle" },
  { value: "category", label: "Category" },
  { value: "brand", label: "Brand" },
  { value: "product", label: "Product" },
  { value: "flash_sale", label: "Flash Sale" },
  { value: "clearance", label: "Clearance" },
  { value: "first_order", label: "First Order" },
];

export default function NewPromotionPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "",
    value: "",
    min_subtotal: "",
    min_quantity: "",
    category_slug: "",
    brand_name: "",
    start_date: "",
    end_date: "",
    stackable: "true",
    priority: "0",
    badge_text: "",
    badge_color: "",
    banner_image: "",
    banner_bg: "",
    is_active: "true",
    show_on_homepage: "false",
    homepage_order: "0",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { toast.error("Promotion name is required"); return; }
    if (!form.type) { toast.error("Promotion type is required"); return; }
    if (!form.value) { toast.error("Promotion value is required"); return; }
    if (form.start_date && form.end_date && new Date(form.end_date) <= new Date(form.start_date)) {
      toast.error("End date must be after start date");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description || undefined,
          type: form.type,
          value: parseFloat(form.value),
          min_subtotal: form.min_subtotal ? parseFloat(form.min_subtotal) : undefined,
          min_quantity: form.min_quantity ? parseInt(form.min_quantity) : undefined,
          category_slug: form.category_slug || undefined,
          brand_name: form.brand_name || undefined,
          start_date: form.start_date || undefined,
          end_date: form.end_date || undefined,
          stackable: form.stackable === "true",
          priority: parseInt(form.priority) || 0,
          badge_text: form.badge_text || undefined,
          badge_color: form.badge_color || undefined,
          banner_image: form.banner_image || undefined,
          banner_bg: form.banner_bg || undefined,
          is_active: form.is_active === "true",
          show_on_homepage: form.show_on_homepage === "true",
          homepage_order: parseInt(form.homepage_order) || 0,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create");
      }
      toast.success("Promotion created");
      router.push("/admin/promotions");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create promotion");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <Link href="/admin/promotions">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">New Promotion</h1>
                <p className="text-muted-foreground">Create a new promotional offer</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Promotion Details</CardTitle>
                <CardDescription>Configure the promotion settings</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Promotion Name *</Label>
                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc">Description</Label>
                    <Textarea id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Discount Type *</Label>
                      <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                        <SelectTrigger id="type"><SelectValue placeholder="Select type..." /></SelectTrigger>
                        <SelectContent>
                          {promotionTypes.map((t) => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="value">Discount Value *</Label>
                      <Input id="value" type="number" step="0.01" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder={form.type === "percentage" ? "e.g. 20" : "e.g. 100"} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min_subtotal">Min. Subtotal</Label>
                      <Input id="min_subtotal" type="number" step="0.01" value={form.min_subtotal} onChange={(e) => setForm({ ...form, min_subtotal: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="min_qty">Min. Quantity</Label>
                      <Input id="min_qty" type="number" value={form.min_quantity} onChange={(e) => setForm({ ...form, min_quantity: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cat_slug">Category Slug</Label>
                      <Input id="cat_slug" value={form.category_slug} onChange={(e) => setForm({ ...form, category_slug: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand Name</Label>
                      <Input id="brand" value={form.brand_name} onChange={(e) => setForm({ ...form, brand_name: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start">Start Date</Label>
                      <Input id="start" type="datetime-local" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end">End Date</Label>
                      <Input id="end" type="datetime-local" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Input id="priority" type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} />
                    </div>
                    <div className="space-y-2 flex items-end pb-2">
                      <div className="flex items-center gap-2">
                        <Switch id="stackable" checked={form.stackable === "true"} onCheckedChange={(v) => setForm({ ...form, stackable: String(v) })} />
                        <Label htmlFor="stackable">Stackable</Label>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="badge">Badge Text</Label>
                      <Input id="badge" value={form.badge_text} onChange={(e) => setForm({ ...form, badge_text: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="badge_color">Badge Color</Label>
                      <Input id="badge_color" value={form.badge_color} onChange={(e) => setForm({ ...form, badge_color: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="banner">Banner Image URL</Label>
                      <Input id="banner" value={form.banner_image} onChange={(e) => setForm({ ...form, banner_image: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="banner_bg">Banner Background</Label>
                      <Input id="banner_bg" value={form.banner_bg} onChange={(e) => setForm({ ...form, banner_bg: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <Switch id="active" checked={form.is_active === "true"} onCheckedChange={(v) => setForm({ ...form, is_active: String(v) })} />
                      <Label htmlFor="active">Active</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="homepage" checked={form.show_on_homepage === "true"} onCheckedChange={(v) => setForm({ ...form, show_on_homepage: String(v) })} />
                      <Label htmlFor="homepage">Show on Homepage</Label>
                    </div>
                    {form.show_on_homepage === "true" && (
                      <div className="flex items-center gap-2">
                        <Label htmlFor="homepage_order" className="whitespace-nowrap">Order</Label>
                        <Input id="homepage_order" type="number" value={form.homepage_order} onChange={(e) => setForm({ ...form, homepage_order: e.target.value })} className="w-20" />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Link href="/admin/promotions">
                      <Button type="button" variant="outline">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Create Promotion
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
