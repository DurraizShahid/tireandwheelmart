"use client";

import React, { useState, lazy, Suspense } from "react";
import Image from "next/image";
import {
  ShoppingCart,
  Gauge,
  Shield,
  Calendar,
  Zap,
  Snowflake,
  Sun,
  CloudRain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";
import { VehicleFitment } from "./product/VehicleFitment";
import type { Product as CatalogProduct } from "@/lib/catalog-types";

const ProductReviews = lazy(() => import("./product/ProductReviews").then((m) => ({ default: m.ProductReviews })));

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  image_url: string;
  description: string | null;
  brand: string | null;
  sku: string | null;
  in_stock: boolean;
  stock_quantity: number;
  specs: Record<string, unknown>;
  categories?: {
    name: string;
    slug: string;
  };
}

interface ProductDetailScreenProps {
  product: Product;
  openReview?: boolean;
}

const ProductDetailScreen = ({ product, openReview }: ProductDetailScreenProps) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const specs = product.specs ?? {};
  const season = specs.season as string | undefined;
  const size = specs.width
    ? `${specs.width}/${specs.aspect_ratio}R${specs.rim_diameter}`
    : undefined;
  const loadIndex = specs.load_index as string | undefined;
  const speedRating = specs.speed_rating as string | undefined;
  const treadwear = specs.treadwear as number | undefined;
  const traction = specs.traction as string | undefined;
  const temperature = specs.temperature as string | undefined;
  const warrantyMiles = specs.warranty_miles as number | undefined;
  const tireType = specs.tire_type as string | undefined;
  const noiseLevel = specs.noise_level as string | undefined;

  const inStock = product.stock_quantity > 0;
  const lowStock = inStock && product.stock_quantity <= 5;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity,
      imageSrc: product.image_url,
      maxQuantity: product.stock_quantity,
    });
    toast.success(`${quantity} x ${product.name} added to cart!`);
  };

  const getSeasonIcon = (s?: string) => {
    switch (s) {
      case "Winter":
        return <Snowflake className="h-4 w-4 mr-1" />;
      case "Summer":
        return <Sun className="h-4 w-4 mr-1" />;
      case "All-Season":
        return <CloudRain className="h-4 w-4 mr-1" />;
      case "Performance":
        return <Zap className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center bg-white text-foreground py-4 sm:py-8">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-8 text-center">
          {product.name}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 items-start max-w-7xl mx-auto">
          {/* Product Image */}
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-[450px] rounded-2xl overflow-hidden bg-white flex items-center justify-center">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "contain" }}

            />
          </div>

          {/* Product Details */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 sm:gap-4 mb-4">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                  {product.name}
                </h2>
                <p className="text-xl sm:text-2xl font-semibold text-blue-600">
                  ${product.price.toLocaleString()}
                </p>
              </div>

              {season && (
                <div className="mb-4">
                  <Badge
                    variant="secondary"
                    className="flex items-center text-xs sm:text-sm font-medium bg-gray-100 text-foreground w-fit"
                  >
                    {getSeasonIcon(season)}
                    {season}
                  </Badge>
                </div>
              )}

              {product.description && (
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                  {product.description}
                </p>
              )}

              {product.brand && (
                <p className="text-sm text-muted-foreground mb-2">
                  Brand: <span className="font-medium text-foreground">{product.brand}</span>
                </p>
              )}

              {product.sku && (
                <p className="text-xs text-muted-foreground mb-4">
                  SKU: {product.sku}
                </p>
              )}

              <Button
                className="w-full py-2 sm:py-3 text-base sm:text-lg font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300 shadow-lg flex items-center justify-center gap-2"
                onClick={handleAddToCart}
                disabled={!inStock}
              >
                <ShoppingCart className="h-4 sm:h-5 w-4 sm:w-5" />
                {inStock ? "Add to Cart" : "Out of Stock"}
              </Button>

              {/* Stock indicator */}
              <div className="flex items-center gap-2 text-sm mt-2">
                <span className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  inStock ? (lowStock ? "bg-amber-400" : "bg-green-500") : "bg-red-500"
                )} />
                <span className={cn(
                  "font-medium",
                  inStock ? (lowStock ? "text-amber-600" : "text-green-700") : "text-red-600"
                )}>
                  {inStock
                    ? lowStock
                      ? `Low Stock — only ${product.stock_quantity} left`
                      : `In Stock (${product.stock_quantity} available)`
                    : "Out of Stock"}
                </span>
              </div>
              {lowStock && (
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden mt-1.5">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{ width: `${Math.max((product.stock_quantity / 5) * 100, 10)}%` }}
                  />
                </div>
              )}

              <div className="flex items-center gap-2 sm:gap-3 bg-gray-100 p-2 sm:p-3 rounded-lg mt-3">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Qty:
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="h-8 w-8 p-0 text-sm"
                >
                  −
                </Button>
                <input
                  type="number"
                  min="1"
                  max={product.stock_quantity}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, product.stock_quantity)))
                  }
                  className="w-12 h-8 text-center border rounded-md bg-background text-foreground text-sm"
                  disabled={!inStock}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(quantity + 1, product.stock_quantity))}
                  disabled={!inStock || quantity >= product.stock_quantity}
                  className="h-8 w-8 p-0 text-sm"
                >
                  +
                </Button>
              </div>
            </Card>

            {/* Key Specifications */}
            {(size || loadIndex || speedRating || tireType) && (
              <Card className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-lg sm:text-xl font-bold text-foreground">
                    Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {size && (
                      <div className="flex items-start sm:items-center gap-2">
                        <Gauge className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Tire Size
                          </p>
                          <p className="font-medium text-sm">{size}</p>
                        </div>
                      </div>
                    )}
                    {loadIndex && (
                      <div className="flex items-center gap-2">
                        <Gauge className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Load Index
                          </p>
                          <p className="font-medium">{loadIndex}</p>
                        </div>
                      </div>
                    )}
                    {speedRating && (
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Speed Rating
                          </p>
                          <p className="font-medium">{speedRating}</p>
                        </div>
                      </div>
                    )}
                    {tireType && (
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Type</p>
                          <p className="font-medium">{tireType}</p>
                        </div>
                      </div>
                    )}
                    {noiseLevel && (
                      <div className="flex items-center gap-2">
                        <Gauge className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Noise Level
                          </p>
                          <p className="font-medium">{noiseLevel}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* UTQG Ratings */}
            {(treadwear || traction || temperature) && (
              <Card className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl font-bold text-foreground flex items-center">
                    <Shield className="h-5 w-5 text-blue-600 mr-2" />
                    UTQG Ratings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Rating</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {treadwear && (
                        <TableRow>
                          <TableCell className="font-medium">
                            Treadwear
                          </TableCell>
                          <TableCell>{treadwear}</TableCell>
                          <TableCell>
                            Expected tread life (higher = longer lasting)
                          </TableCell>
                        </TableRow>
                      )}
                      {traction && (
                        <TableRow>
                          <TableCell className="font-medium">
                            Traction
                          </TableCell>
                          <TableCell>{traction}</TableCell>
                          <TableCell>
                            Wet stopping ability (AA &gt; A &gt; B &gt; C)
                          </TableCell>
                        </TableRow>
                      )}
                      {temperature && (
                        <TableRow>
                          <TableCell className="font-medium">
                            Temperature
                          </TableCell>
                          <TableCell>{temperature}</TableCell>
                          <TableCell>
                            Heat resistance (A &gt; B &gt; C)
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Warranty */}
            {warrantyMiles && warrantyMiles > 0 && (
              <Card className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl font-bold text-foreground flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                    Warranty
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-foreground">
                    {warrantyMiles.toLocaleString()} miles
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Vehicle Fitment */}
        {size && (
          <section className="mt-12 max-w-7xl mx-auto">
            <VehicleFitment product={{ size } as CatalogProduct} />
          </section>
        )}

        {/* Detailed Specs Table */}
        {Object.keys(specs).length > 0 && (
          <section className="mt-12 max-w-7xl mx-auto">
            <Card className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-2xl font-bold text-foreground">
                  Detailed Specifications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableBody>
                    {Object.entries(specs).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="font-medium capitalize">
                          {key.replace(/_/g, " ")}
                        </TableCell>
                        <TableCell>
                          {typeof value === "boolean"
                            ? value
                              ? "Yes"
                              : "No"
                            : String(value)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>
        )}

        <section className="mt-12 max-w-7xl mx-auto">
          <Separator />
          <div className="mt-10">
            <Suspense fallback={<div className="h-48 rounded-2xl bg-gray-50 animate-pulse" />}>
              <ProductReviews productId={product.id} openReview={openReview} />
            </Suspense>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetailScreen;
