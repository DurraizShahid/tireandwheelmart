"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Testimonial } from "@/lib/supabase/types";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase.from("testimonials").select("*").order("display_order");
      if (error) setError(error.message);
      else if (data) setTestimonials(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleDelete = async (id: string, author: string) => {
    if (!confirm(`Delete testimonial from "${author}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Testimonial deleted");
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Failed to delete testimonial");
    }
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
                <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
                <p className="text-muted-foreground">Manage customer testimonials</p>
              </div>
              <Link href="/admin/testimonials/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Testimonial
                </Button>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Testimonials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Author</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead>Approved</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell>
                        </TableRow>
                      ) : error ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-red-600">{error}</TableCell>
                        </TableRow>
                      ) : testimonials.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No testimonials yet</TableCell>
                        </TableRow>
                      ) : (
                        testimonials.map((t) => (
                          <TableRow key={t.id}>
                            <TableCell className="font-medium">{t.author}</TableCell>
                            <TableCell>{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</TableCell>
                            <TableCell className="max-w-xs truncate">{t.content}</TableCell>
                            <TableCell>{t.is_approved ? "Yes" : "No"}</TableCell>
                            <TableCell>{t.is_active ? "Yes" : "No"}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Link href={`/admin/testimonials/${t.id}/edit`}>
                                  <Button variant="ghost" size="sm">
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(t.id, t.author)}>
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
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
