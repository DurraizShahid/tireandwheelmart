"use client";

import { Truck, Ruler } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/lib/catalog-types";

interface VehicleFitmentProps {
  product: Product;
}

const vehicleMakes = ["BMW", "Mercedes-Benz", "Audi", "Lexus", "Acura", "Porsche", "Volkswagen", "Toyota", "Honda", "Ford"];

export function VehicleFitment({ product }: VehicleFitmentProps) {
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
          {vehicleMakes.slice(0, 10).map((make) => (
            <div
              key={make}
              className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 text-center hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
            >
              <p className="font-semibold text-sm text-foreground">{make}</p>
              <p className="text-xs text-muted-foreground mt-0.5">2018 - 2025</p>
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
