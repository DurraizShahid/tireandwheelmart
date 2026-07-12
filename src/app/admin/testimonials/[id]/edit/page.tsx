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
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState({
    author: "",
    role: "",
    company: "",
    avatar_url: "",
    content: "",
    rating: "5",
    display_order: "0",
    is_approved: false,
    is_active: true,
  });

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase.from("testimonials").select("*").eq("id", id).single();
      if (error || !data) {
        setNotFound(true);
      } else {
        setForm({
          author: data.author,
          role: data.role ?? "",
          company: data.company ?? "",
          avatar_url: data.avatar_url ?? "",
          content: data.content,
          rating: String(data.rating),
          display_order: String(data.display_order),
          is_approved: data.is_approved,
          is_active: data.is_active,
        });
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.author || !form.content) {
      toast.error("Author and content are required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: form.author,
          role: form.role || undefined,
          company: form.company || undefined,
          avatar_url: form.avatar_url || undefined,
          content: form.content,
          rating: parseInt(form.rating) || 5,
          display_order: parseInt(form.display_order) || 0,
          is_approved: form.is_approved,
          is_active: form.is_active,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update");
      }
      toast.success("Testimonial updated");
      router.push("/admin/testimonials");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update testimonial");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-muted/30">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen bg-muted/30">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-6 text-center text-muted-foreground pt-20">Testimonial not found</main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <Link href="/admin/testimonials">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Testimonial</h1>
                <p className="text-muted-foreground">{form.author}</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Testimonial Details</CardTitle>
                <CardDescription>Update testimonial information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="author">Author *</Label>
                      <Input id="author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rating">Rating (1-5)</Label>
                      <Input id="rating" type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatar_url">Avatar URL</Label>
                    <Input id="avatar_url" value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <Textarea id="content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="order">Display Order</Label>
                      <Input id="order" type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} />
                    </div>
                    <div className="space-y-2 flex items-end pb-2">
                      <div className="flex items-center gap-2">
                        <Switch id="approved" checked={form.is_approved} onCheckedChange={(c) => setForm({ ...form, is_approved: c })} />
                        <Label htmlFor="approved">Approved</Label>
                      </div>
                    </div>
                    <div className="space-y-2 flex items-end pb-2">
                      <div className="flex items-center gap-2">
                        <Switch id="active" checked={form.is_active} onCheckedChange={(c) => setForm({ ...form, is_active: c })} />
                        <Label htmlFor="active">Active</Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Link href="/admin/testimonials">
                      <Button type="button" variant="outline">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Save Changes
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
