"use client";

import { Gauge, Thermometer, CloudRain, Zap, Shield, Ruler } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { Product } from "@/lib/catalog-types";

interface ProductSpecificationsProps {
  product: Product;
}

const specIconMap: Record<string, React.ReactNode> = {
  season: <CloudRain className="h-4 w-4" />,
  loadIndex: <Gauge className="h-4 w-4" />,
  speedRating: <Zap className="h-4 w-4" />,
  treadwear: <Ruler className="h-4 w-4" />,
  traction: <Shield className="h-4 w-4" />,
  temperature: <Thermometer className="h-4 w-4" />,
};

const specLabelMap: Record<string, string> = {
  season: "Season",
  loadIndex: "Load Index",
  speedRating: "Speed Rating",
  treadwear: "Treadwear",
  traction: "Traction",
  temperature: "Temperature",
  tireType: "Tire Type",
  noiseLevel: "Noise Level",
  warrantyMiles: "Warranty",
};

export function ProductSpecifications({ product }: ProductSpecificationsProps) {
  const entries = Object.entries(product.specifications);
  if (entries.length === 0) return null;

  return (
    <Card className="rounded-2xl shadow-sm border border-gray-100">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
          <Gauge className="h-5 w-5 text-blue-600" />
          Specifications
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableBody>
            {entries.map(([key, value]) => (
              <TableRow key={key} className="border-b border-gray-50 last:border-0">
                <TableCell className="py-3.5 pl-6 pr-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-muted-foreground shrink-0">
                      {specIconMap[key] ?? <Ruler className="h-4 w-4" />}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                      {specLabelMap[key] ?? key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3.5 pr-6 text-right">
                  <span className="text-sm font-semibold text-foreground">
                    {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
