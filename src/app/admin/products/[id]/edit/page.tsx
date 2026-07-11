"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Category, Product } from "@/lib/supabase/types";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    sku: "",
    brand: "",
    category_id: "",
    description: "",
    price: "",
    compare_at_price: "",
    image_url: "",
    images: "",
    stock_quantity: "0",
    featured: "false",
    is_new: "false",
    is_best_seller: "false",
    tags: "",
    rating: "",
    review_count: "",
    specs: "",
  });

  useEffect(() => {
    const load = async () => {
      const catRes = await supabase.from("categories").select("*").order("name");
      const prodRes = await supabase.from("products").select("*").eq("id", params.id).single();
      if (catRes.data) setCategories(catRes.data);
      const p = prodRes.data as Product | null;
      if (p) {
        setForm({
          name: p.name,
          slug: p.slug,
          sku: p.sku ?? "",
          brand: p.brand ?? "",
          category_id: p.category_id,
          description: p.description ?? "",
          price: String(p.price),
          compare_at_price: p.compare_at_price ? String(p.compare_at_price) : "",
          image_url: p.image_url,
          images: (p.images ?? []).join("\n"),
          stock_quantity: String(p.stock_quantity),
          featured: String(p.featured),
          is_new: String(p.is_new ?? false),
          is_best_seller: String(p.is_best_seller ?? false),
          tags: (p.tags ?? []).join(", "),
          rating: p.rating ? String(p.rating) : "",
          review_count: p.review_count ? String(p.review_count) : "",
          specs: p.specs ? JSON.stringify(p.specs, null, 2) : "",
        });
      }
      setLoading(false);
    };
    load();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { toast.error("Product name is required"); return; }
    if (!form.price) { toast.error("Price is required"); return; }
    if (!form.category_id) { toast.error("Category is required"); return; }

    let specs: Record<string, unknown> = {};
    if (form.specs) {
      try { specs = JSON.parse(form.specs); }
      catch { toast.error("Invalid JSON in specifications"); return; }
    }

    setSaving(true);
    try {
      const imagesArr = form.images ? form.images.split("\n").map(s => s.trim()).filter(Boolean) : [];
      const tagsArr = form.tags ? form.tags.split(",").map(s => s.trim()).filter(Boolean) : [];

      const res = await fetch(`/api/admin/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug || undefined,
          sku: form.sku || undefined,
          brand: form.brand || undefined,
          category_id: form.category_id,
          description: form.description || undefined,
          price: parseFloat(form.price),
          compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : undefined,
          image_url: form.image_url || undefined,
          images: imagesArr,
          stock_quantity: parseInt(form.stock_quantity) || 0,
          featured: form.featured === "true",
          is_new: form.is_new === "true",
          is_best_seller: form.is_best_seller === "true",
          tags: tagsArr,
          rating: form.rating ? parseFloat(form.rating) : undefined,
          review_count: form.review_count ? parseInt(form.review_count) : undefined,
          specs,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update");
      }
      toast.success("Product updated");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-muted/30 items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <Link href="/admin/products">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
                <p className="text-muted-foreground">{form.name}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Basic Information</CardTitle><CardDescription>Product name, brand, and category</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input id="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU</Label>
                      <Input id="sku" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand</Label>
                      <Input id="brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                      <SelectTrigger id="category"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc">Description</Label>
                    <Textarea id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Pricing</CardTitle><CardDescription>Regular price and sale pricing</CardDescription></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Regular Price ($) *</Label>
                      <Input id="price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="compare">Compare-at Price ($)</Label>
                      <Input id="compare" type="number" step="0.01" value={form.compare_at_price} onChange={(e) => setForm({ ...form, compare_at_price: e.target.value })} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Images</CardTitle><CardDescription>Main image and gallery</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image_url">Main Image URL</Label>
                    <Input id="image_url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="images">Gallery Images (one URL per line)</Label>
                    <Textarea id="images" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} rows={3} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Inventory & Flags</CardTitle><CardDescription>Stock, badges, and product flags</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input id="stock" type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input id="tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                      <Switch id="featured" checked={form.featured === "true"} onCheckedChange={(v) => setForm({ ...form, featured: String(v) })} />
                      <Label htmlFor="featured">Featured</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="is_new" checked={form.is_new === "true"} onCheckedChange={(v) => setForm({ ...form, is_new: String(v) })} />
                      <Label htmlFor="is_new">New Product</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="is_best_seller" checked={form.is_best_seller === "true"} onCheckedChange={(v) => setForm({ ...form, is_best_seller: String(v) })} />
                      <Label htmlFor="is_best_seller">Best Seller</Label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="rating">Rating (0-5)</Label>
                      <Input id="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="review_count">Review Count</Label>
                      <Input id="review_count" type="number" value={form.review_count} onChange={(e) => setForm({ ...form, review_count: e.target.value })} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Specifications</CardTitle><CardDescription>Tire, wheel, and product specifications as JSON</CardDescription></CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="specs">Specifications (JSON)</Label>
                    <Textarea
                      id="specs"
                      value={form.specs}
                      onChange={(e) => setForm({ ...form, specs: e.target.value })}
                      rows={10}
                      className="font-mono text-xs"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Link href="/admin/products">
                  <Button type="button" variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
