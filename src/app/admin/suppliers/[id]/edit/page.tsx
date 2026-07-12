"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { ADMIN_DEFAULTS } from "@/lib/admin-constants";

export default function EditSupplierPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    business_name: "",
    business_email: "",
    business_phone: "",
    commission_rate: String(ADMIN_DEFAULTS.DEFAULT_COMMISSION_RATE),
    order_handling: "admin" as "admin" | "self",
    is_active: true,
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await supabase
          .from("suppliers")
          .select("*")
          .eq("id", params.id)
          .single();
        if (!data) { setNotFound(true); setLoading(false); return; }
        if (data) {
          setForm({
            business_name: data.business_name,
            business_email: data.business_email ?? "",
            business_phone: data.business_phone ?? "",
            commission_rate: String(data.commission_rate),
            order_handling: data.order_handling,
            is_active: data.is_active,
          });
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.business_name.trim()) {
      toast.error("Business name is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/suppliers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: params.id,
          business_name: form.business_name,
          business_email: form.business_email || null,
          business_phone: form.business_phone || null,
          commission_rate: parseFloat(form.commission_rate),
          order_handling: form.order_handling,
          is_active: form.is_active,
        }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("Supplier updated");
      router.push("/admin/suppliers");
      router.refresh();
    } catch {
      toast.error("Failed to update supplier");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-muted/30">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <div className="flex-1 items-center justify-center flex">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
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
          <div className="flex-1 items-center justify-center flex flex-col gap-4">
            <p className="text-lg font-medium">Supplier not found</p>
            <Link href="/admin/suppliers">
              <Button variant="outline">Back to Suppliers</Button>
            </Link>
          </div>
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
              <Link href="/admin/suppliers">
                <Button variant="ghost" size="icon"><ChevronLeft className="h-5 w-5" /></Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Supplier</h1>
                <p className="text-muted-foreground">{form.business_name}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Supplier Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="business_name">Business Name</Label>
                    <Input id="business_name" value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={form.business_email} onChange={(e) => setForm({ ...form, business_email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={form.business_phone} onChange={(e) => setForm({ ...form, business_phone: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="commission">Commission Rate (%)</Label>
                      <Input id="commission" type="number" min="0" max="100" step="0.1" value={form.commission_rate} onChange={(e) => setForm({ ...form, commission_rate: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="order_handling">Order Handling</Label>
                      <Select value={form.order_handling} onValueChange={(v: "admin" | "self") => setForm({ ...form, order_handling: v })}>
                        <SelectTrigger id="order_handling">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin takes orders</SelectItem>
                          <SelectItem value="self">Supplier self-fulfills</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Switch id="active" checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
                    <Label htmlFor="active">Active</Label>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4 mt-6">
                <Link href="/admin/suppliers">
                  <Button variant="outline" type="button">Cancel</Button>
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
