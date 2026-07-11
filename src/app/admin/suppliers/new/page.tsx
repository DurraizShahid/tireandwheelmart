"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NewSupplierPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    business_name: "",
    business_email: "",
    business_phone: "",
    commission_rate: "10",
    order_handling: "admin" as "admin" | "self",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.business_name.trim()) {
      toast.error("Business name is required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_name: form.business_name,
          business_email: form.business_email || undefined,
          business_phone: form.business_phone || undefined,
          commission_rate: parseFloat(form.commission_rate),
          order_handling: form.order_handling,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to create supplier");
      }
      toast.success("Supplier created");
      router.push("/admin/suppliers");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <Link href="/admin/suppliers">
                <Button variant="ghost" size="icon"><ChevronLeft className="h-5 w-5" /></Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Add Supplier</h1>
                <p className="text-muted-foreground">Create a new vendor account</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Supplier Details</CardTitle>
                  <CardDescription>Enter the supplier&apos;s business information. If an email is provided, a Clerk user account will be created or linked.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="business_name">Business Name *</Label>
                    <Input id="business_name" value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} placeholder="e.g. Premium Tires Co." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={form.business_email} onChange={(e) => setForm({ ...form, business_email: e.target.value })} placeholder="vendor@example.com" />
                    <p className="text-xs text-muted-foreground">If the user already exists, they&apos;ll be linked. Otherwise, a new Clerk account will be created.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={form.business_phone} onChange={(e) => setForm({ ...form, business_phone: e.target.value })} placeholder="+1 (555) 123-4567" />
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
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4 mt-6">
                <Link href="/admin/suppliers">
                  <Button variant="outline" type="button">Cancel</Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Supplier
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
