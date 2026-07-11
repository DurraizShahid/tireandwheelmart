"use client";

import { FileText } from "lucide-react";

interface ProductDescriptionProps {
  description?: string;
  productName: string;
}

export function ProductDescription({ description, productName }: ProductDescriptionProps) {
  if (!description) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-bold text-foreground">Description</h2>
      </div>
      <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
        <p>{description}</p>
        <p>
          The {productName} is engineered to deliver exceptional performance across a wide range of driving conditions.
          Featuring advanced compound technology and precision engineering, this tire provides the perfect balance of
          grip, comfort, and longevity.
        </p>
        <ul>
          <li>Advanced tread compound for enhanced traction and durability</li>
          <li>Optimized tread pattern for reduced road noise and improved comfort</li>
          <li>Reinforced construction for consistent performance at high speeds</li>
          <li>Engineered for precise handling and responsive steering feel</li>
        </ul>
      </div>
    </section>
  );
}
