"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";

export default function NewCategoryPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image_url: "",
    hero_image: "",
    seo_title: "",
    seo_description: "",
    display_order: "0",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast.error("Category name is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug || undefined,
          description: form.description || undefined,
          image_url: form.image_url || undefined,
          hero_image: form.hero_image || undefined,
          seo_title: form.seo_title || undefined,
          seo_description: form.seo_description || undefined,
          display_order: parseInt(form.display_order) || 0,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create");
      }
      toast.success("Category created");
      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create category");
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
              <Link href="/admin/categories">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">New Category</h1>
                <p className="text-muted-foreground">Add a new product category</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Category Details</CardTitle>
                <CardDescription>Basic information about the category</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Category Name *</Label>
                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Auto-generated from name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc">Description</Label>
                    <Textarea id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="image">Category Image URL</Label>
                      <Input id="image" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hero">Hero Image URL</Label>
                      <Input id="hero" value={form.hero_image} onChange={(e) => setForm({ ...form, hero_image: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="order">Display Order</Label>
                      <Input id="order" type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seo_title">SEO Title</Label>
                      <Input id="seo_title" value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seo_desc">SEO Description</Label>
                    <Textarea id="seo_desc" value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Link href="/admin/categories">
                      <Button type="button" variant="outline">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Create Category
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
