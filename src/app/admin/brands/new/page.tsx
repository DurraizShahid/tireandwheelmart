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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";

export default function NewBrandPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    image_url: "",
    website_url: "",
    description: "",
    display_order: "0",
    show_on_homepage: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast.error("Brand name is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug || undefined,
          image_url: form.image_url || undefined,
          website_url: form.website_url || undefined,
          description: form.description || undefined,
          display_order: parseInt(form.display_order) || 0,
          show_on_homepage: form.show_on_homepage,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create");
      }
      toast.success("Brand created");
      router.push("/admin/brands");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create brand");
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
              <Link href="/admin/brands">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">New Brand</h1>
                <p className="text-muted-foreground">Add a new brand</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Brand Details</CardTitle>
                <CardDescription>Basic information about the brand</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Brand Name *</Label>
                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Auto-generated from name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input id="image_url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="/brands/logo_name.png" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website_url">Website URL</Label>
                    <Input id="website_url" value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc">Description</Label>
                    <Textarea id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order">Display Order</Label>
                    <Input id="order" type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} />
                  </div>
                  <div className="flex items-center gap-2 pb-2">
                    <Switch id="show_on_homepage" checked={form.show_on_homepage} onCheckedChange={(c) => setForm({ ...form, show_on_homepage: c })} />
                    <Label htmlFor="show_on_homepage">Show on Homepage</Label>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Link href="/admin/brands">
                      <Button type="button" variant="outline">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Create Brand
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
