"use client";

import { useState, useEffect } from "react";
import { Truck, Ruler } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/lib/catalog-types";

interface VehicleFitmentProps {
  product: Product;
}

interface Fitment {
  id: string;
  make: string;
  model: string;
  year_start: number;
  year_end: number;
  tire_size: string;
  bolt_pattern: string | null;
  offset_range: string | null;
}

export function VehicleFitment({ product }: VehicleFitmentProps) {
  const [fitments, setFitments] = useState<Fitment[]>([]);

  useEffect(() => {
    if (product.size) {
      fetch(`/api/fitments?size=${encodeURIComponent(product.size)}`)
        .then((r) => r.json())
        .then((data) => setFitments(data ?? []));
    }
  }, [product.size]);

  if (fitments.length === 0) return null;

  const grouped = fitments.reduce<Record<string, Fitment[]>>((acc, f) => {
    if (!acc[f.make]) acc[f.make] = [];
    acc[f.make].push(f);
    return acc;
  }, {});

  return (
    <Card className="rounded-2xl shadow-sm border border-gray-100">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
          <Truck className="h-5 w-5 text-blue-600" />
          Vehicle Compatibility
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(grouped).slice(0, 10).map(([make, models]) => (
            <div
              key={make}
              className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 text-center hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
            >
              <p className="font-semibold text-sm text-foreground">{make}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {Math.min(...models.map((m) => m.year_start))} - {Math.max(...models.map((m) => m.year_end))}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{models.length} model{models.length > 1 ? "s" : ""}</p>
            </div>
          ))}
        </div>

        {product.size && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 text-sm text-muted-foreground">
            <Ruler className="h-4 w-4" />
            <span>Fits tire size: <strong className="text-foreground font-mono">{product.size}</strong></span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
