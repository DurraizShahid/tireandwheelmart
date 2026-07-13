"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

function getReviewIdFromPath() {
  if (typeof window === "undefined") return "";
  return window.location.pathname.match(/\/admin\/reviews\/([^/]+)\/edit/)?.[1] ?? "";
}

export default function EditReviewPage() {
  const router = useRouter();
  const id = getReviewIdFromPath();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [form, setForm] = useState({
    author: "",
    rating: "5",
    title: "",
    content: "",
    is_approved: false,
    verified: false,
  });
  const [productName, setProductName] = useState("");

  useEffect(() => {
    const loadReview = async () => {
      try {
        const res = await fetch(`/api/admin/reviews/${id}`);
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          setLoadError(errBody.error ?? `HTTP ${res.status}`);
          setNotFound(true);
          return;
        }
        const d = await res.json();
        setForm({
          author: d.author ?? "",
          rating: String(d.rating ?? 5),
          title: d.title ?? "",
          content: d.content ?? "",
          is_approved: d.is_approved ?? false,
          verified: d.verified ?? false,
        });
        setProductName(d.products?.name ?? "Unknown Product");
      } catch (e) {
        setLoadError(e instanceof Error ? e.message : "Unknown error");
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    loadReview();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: form.author,
          rating: parseInt(form.rating) || 5,
          title: form.title,
          content: form.content,
          is_approved: form.is_approved,
          verified: form.verified,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update");
      }
      toast.success("Review updated");
      router.push("/admin/reviews");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update review");
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
          <main className="flex-1 p-6 text-center pt-20">
            <p className="text-lg font-medium">Review not found</p>
            {loadError && <p className="text-sm text-red-600 mt-2">Error: {loadError}</p>}
            <p className="text-xs text-muted-foreground mt-1">ID: {id}</p>
            <Link href="/admin/reviews" className="mt-4 inline-block">
              <Button variant="outline">Back to Reviews</Button>
            </Link>
          </main>
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
              <Link href="/admin/reviews">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Review</h1>
                <p className="text-muted-foreground">{productName}</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Review Details</CardTitle>
                <CardDescription>Moderate product review</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="author">Author</Label>
                      <Input id="author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rating">Rating (1-5)</Label>
                      <Input id="rating" type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea id="content" rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
                  </div>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <Switch id="approved" checked={form.is_approved} onCheckedChange={(c) => setForm({ ...form, is_approved: c })} />
                      <Label htmlFor="approved">Approved</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="verified" checked={form.verified} onCheckedChange={(c) => setForm({ ...form, verified: c })} />
                      <Label htmlFor="verified">Verified Purchase</Label>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Link href="/admin/reviews">
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
