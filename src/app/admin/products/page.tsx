"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Loader2, MoreHorizontal } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ADMIN_DEFAULTS } from "@/lib/admin-constants";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 20;

interface DbProduct {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  stock_quantity: number;
  in_stock: boolean;
  brand: string | null;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const paginatedProducts = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, sku, price, stock_quantity, in_stock, brand")
      .order("name");
    if (error) {
      setError(error.message);
    } else if (data) {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Product deleted");
      setPage(1);
      fetchProducts();
    } else {
      toast.error("Failed to delete product");
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
                <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                <p className="text-muted-foreground">Manage your product inventory</p>
              </div>
              <Link href="/admin/products/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Product List</CardTitle>
                <CardDescription>
                  {loading
                    ? "Loading..."
                    : products.length === 0
                    ? "No products"
                    : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, products.length)} of ${products.length} products`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : error ? (
                  <p className="text-center text-red-600 py-8">{error}</p>
                ) : products.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No products found.</p>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product Name</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead>Brand</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.sku ?? "—"}</TableCell>
                            <TableCell>{product.brand ?? "—"}</TableCell>
                            <TableCell>${product.price.toLocaleString()}</TableCell>
                            <TableCell>{product.stock_quantity}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  product.in_stock && product.stock_quantity > ADMIN_DEFAULTS.LOW_STOCK_THRESHOLD
                                    ? "bg-green-100 text-green-800"
                                    : product.in_stock
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {!product.in_stock
                                  ? "Out of Stock"
                                  : product.stock_quantity <= ADMIN_DEFAULTS.LOW_STOCK_THRESHOLD
                                  ? "Low Stock"
                                  : "Active"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Link href={`/admin/products/${product.id}/edit`}>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id, product.name)}>
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {totalPages > 1 && (
                      <Pagination className="mt-4">
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }}
                              aria-disabled={page === 1}
                              className={page === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                            .reduce<(number | "ellipsis")[]>((acc, p, i, arr) => {
                              if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("ellipsis");
                              acc.push(p);
                              return acc;
                            }, [])
                            .map((item, i) =>
                              item === "ellipsis" ? (
                                <PaginationItem key={`e${i}`}>
                                  <span className="flex h-9 w-9 items-center justify-center">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </span>
                                </PaginationItem>
                              ) : (
                                <PaginationItem key={item}>
                                  <PaginationLink
                                    href="#"
                                    isActive={item === page}
                                    onClick={(e) => { e.preventDefault(); setPage(item); }}
                                  >
                                    {item}
                                  </PaginationLink>
                                </PaginationItem>
                              )
                            )}
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }}
                              aria-disabled={page === totalPages}
                              className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
