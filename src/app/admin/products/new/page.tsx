"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { ImageUpload } from "@/components/ui/image-upload";
import type { Category } from "@/lib/supabase/types";

type Specs = {
  width: string;
  aspect_ratio: string;
  rim_diameter: string;
  load_index: string;
  speed_rating: string;
  season: string;
  tire_type: string;
  runflat: boolean;
  treadwear: string;
  traction: string;
  temperature: string;
  noise_level: string;
  warranty_miles: string;
  ply_rating: string;
  rim_protection: boolean;
};

const defaultSpecs: Specs = {
  width: "", aspect_ratio: "", rim_diameter: "", load_index: "", speed_rating: "",
  season: "", tire_type: "", runflat: false, treadwear: "", traction: "", temperature: "",
  noise_level: "", warranty_miles: "", ply_rating: "", rim_protection: false,
};

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", slug: "", sku: "", brand: "", category_id: "", description: "",
    price: "", compare_at_price: "", stock_quantity: "0",
    featured: false, is_new: false, is_best_seller: false,
    tags: "", rating: "", review_count: "",
  });
  const [specs, setSpecs] = useState<Specs>(defaultSpecs);
  const [imageUrl, setImageUrl] = useState("");
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);

  useEffect(() => {
    supabase.from("categories").select("*").order("name").then(({ data }) => {
      if (data) setCategories(data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { toast.error("Product name is required"); return; }
    if (!form.price || parseFloat(form.price) <= 0) {
      toast.error("Price must be a positive number");
      return;
    }
    if (!form.category_id) { toast.error("Category is required"); return; }

    setSaving(true);
    try {
      const tagsArr = form.tags ? form.tags.split(",").map(s => s.trim()).filter(Boolean) : [];
      const specsObj: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(specs)) {
        if (val === true) specsObj[key] = true;
        else if (val === false) specsObj[key] = false;
        else if (val !== "") specsObj[key] = isNaN(Number(val)) ? val : Number(val);
      }

      const res = await fetch("/api/admin/products", {
        method: "POST",
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
          image_url: imageUrl || undefined,
          images: galleryUrls,
          stock_quantity: parseInt(form.stock_quantity) || 0,
          featured: form.featured,
          is_new: form.is_new,
          is_best_seller: form.is_best_seller,
          tags: tagsArr,
          rating: form.rating ? parseFloat(form.rating) : undefined,
          review_count: form.review_count ? parseInt(form.review_count) : undefined,
          specs: specsObj,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create");
      }
      toast.success("Product created");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  const update = (field: string, val: string | boolean) => setForm({ ...form, [field]: val });
  const upSpec = (field: keyof Specs, val: string | boolean) => setSpecs({ ...specs, [field]: val });

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <Link href="/admin/products">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">New Product</h1>
                <p className="text-muted-foreground">Add a new product to inventory</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Basic Information</CardTitle><CardDescription>Product name, brand, and category</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input id="slug" value={form.slug} onChange={(e) => update("slug", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU</Label>
                      <Input id="sku" value={form.sku} onChange={(e) => update("sku", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand</Label>
                      <Input id="brand" value={form.brand} onChange={(e) => update("brand", e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={form.category_id} onValueChange={(v) => update("category_id", v)}>
                      <SelectTrigger id="category"><SelectValue placeholder="Select category..." /></SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc">Description</Label>
                    <Textarea id="desc" value={form.description} onChange={(e) => update("description", e.target.value)} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Pricing</CardTitle><CardDescription>Regular price and sale pricing</CardDescription></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Regular Price ($) *</Label>
                      <Input id="price" type="number" step="0.01" value={form.price} onChange={(e) => update("price", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="compare">Compare-at Price ($)</Label>
                      <Input id="compare" type="number" step="0.01" value={form.compare_at_price} onChange={(e) => update("compare_at_price", e.target.value)} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Images</CardTitle><CardDescription>Upload main image and gallery images</CardDescription></CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Main Image</Label>
                    <ImageUpload value={imageUrl} onChange={(v) => setImageUrl(v as string)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Gallery Images</Label>
                    <ImageUpload value={galleryUrls} onChange={(v) => setGalleryUrls(v as string[])} multiple label="Upload Gallery Images" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Inventory & Flags</CardTitle><CardDescription>Stock, badges, and product flags</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input id="stock" type="number" value={form.stock_quantity} onChange={(e) => update("stock_quantity", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input id="tags" value={form.tags} onChange={(e) => update("tags", e.target.value)} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                      <Switch id="featured" checked={form.featured} onCheckedChange={(v) => update("featured", v)} />
                      <Label htmlFor="featured">Featured</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="is_new" checked={form.is_new} onCheckedChange={(v) => update("is_new", v)} />
                      <Label htmlFor="is_new">New Product</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="is_best_seller" checked={form.is_best_seller} onCheckedChange={(v) => update("is_best_seller", v)} />
                      <Label htmlFor="is_best_seller">Best Seller</Label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="rating">Rating (0-5)</Label>
                      <Input id="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => update("rating", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="review_count">Review Count</Label>
                      <Input id="review_count" type="number" value={form.review_count} onChange={(e) => update("review_count", e.target.value)} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Tire Specifications</CardTitle><CardDescription>Size, performance ratings, and features</CardDescription></CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground">Tire Size</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="spec-width">Width (mm)</Label>
                        <Input id="spec-width" type="number" placeholder="e.g. 225" value={specs.width} onChange={(e) => upSpec("width", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="spec-aspect">Aspect Ratio</Label>
                        <Input id="spec-aspect" type="number" placeholder="e.g. 65" value={specs.aspect_ratio} onChange={(e) => upSpec("aspect_ratio", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="spec-rim">Rim Diameter (in)</Label>
                        <Input id="spec-rim" type="number" placeholder="e.g. 17" value={specs.rim_diameter} onChange={(e) => upSpec("rim_diameter", e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground">Performance Ratings</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="spec-load">Load Index</Label>
                        <Input id="spec-load" placeholder="e.g. 102" value={specs.load_index} onChange={(e) => upSpec("load_index", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="spec-speed">Speed Rating</Label>
                        <Select value={specs.speed_rating} onValueChange={(v) => upSpec("speed_rating", v)}>
                          <SelectTrigger id="spec-speed"><SelectValue placeholder="Select..." /></SelectTrigger>
                          <SelectContent>
                            {["L", "M", "N", "P", "Q", "R", "S", "T", "U", "H", "V", "W", "Y", "Z"].map(r => (
                              <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground">Type & Season</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="spec-season">Season</Label>
                        <Select value={specs.season} onValueChange={(v) => upSpec("season", v)}>
                          <SelectTrigger id="spec-season"><SelectValue placeholder="Select..." /></SelectTrigger>
                          <SelectContent>
                            {["All-Season", "Winter", "Summer", "All-Weather"].map(s => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="spec-tire-type">Tire Type</Label>
                        <Select value={specs.tire_type} onValueChange={(v) => upSpec("tire_type", v)}>
                          <SelectTrigger id="spec-tire-type"><SelectValue placeholder="Select..." /></SelectTrigger>
                          <SelectContent>
                            {["Passenger", "Performance", "Truck/SUV", "Light Truck", "Winter", "Run-Flat"].map(t => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-6 pt-2">
                      <div className="flex items-center gap-2">
                        <Switch id="spec-runflat" checked={specs.runflat} onCheckedChange={(v) => upSpec("runflat", v)} />
                        <Label htmlFor="spec-runflat">Run-Flat</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch id="spec-rim-protection" checked={specs.rim_protection} onCheckedChange={(v) => upSpec("rim_protection", v)} />
                        <Label htmlFor="spec-rim-protection">Rim Protection</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground">UTQG & Durability</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="spec-treadwear">Treadwear</Label>
                        <Input id="spec-treadwear" type="number" placeholder="e.g. 640" value={specs.treadwear} onChange={(e) => upSpec("treadwear", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="spec-traction">Traction</Label>
                        <Select value={specs.traction} onValueChange={(v) => upSpec("traction", v)}>
                          <SelectTrigger id="spec-traction"><SelectValue placeholder="Select..." /></SelectTrigger>
                          <SelectContent>
                            {["AA", "A", "B", "C"].map(t => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="spec-temperature">Temperature</Label>
                        <Select value={specs.temperature} onValueChange={(v) => upSpec("temperature", v)}>
                          <SelectTrigger id="spec-temperature"><SelectValue placeholder="Select..." /></SelectTrigger>
                          <SelectContent>
                            {["A", "B", "C"].map(t => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground">Additional</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="spec-noise">Noise Level</Label>
                        <Input id="spec-noise" placeholder="e.g. 68 dB" value={specs.noise_level} onChange={(e) => upSpec("noise_level", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="spec-warranty">Warranty (miles)</Label>
                        <Input id="spec-warranty" type="number" placeholder="e.g. 60000" value={specs.warranty_miles} onChange={(e) => upSpec("warranty_miles", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="spec-ply">Ply Rating</Label>
                        <Input id="spec-ply" placeholder="e.g. 4" value={specs.ply_rating} onChange={(e) => upSpec("ply_rating", e.target.value)} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Link href="/admin/products">
                  <Button type="button" variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Product
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
