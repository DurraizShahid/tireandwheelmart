"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProductItemProps {
  name: string;
  price: string;
  imageSrc: string;
  accentColor?: string;
  href: string; // Add href prop for navigation
}

const ProductItem = ({
  name,
  price,
  imageSrc,
  accentColor = "bg-gray-200", // Default accent if not provided
  href, // Destructure href
}: ProductItemProps) => {
  return (
    <Link href={href} className="block"> {/* Wrap with Link */}
      <Card className="relative overflow-hidden rounded-xl shadow-md border-none group cursor-pointer transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <CardContent className="relative z-10 p-4 flex flex-col h-full">
          <div className="relative w-full h-32 mb-3">
            <Image
              src={imageSrc}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "contain" }}
              className="drop-shadow-lg"
            />
          </div>
          <h4 className="text-lg font-semibold text-primary dark:text-primary-foreground mb-1 truncate">{name}</h4>
          <p className="text-sm font-medium text-muted-foreground">{price}</p>
          {/* Subtle accent color on hover */}
          <div
            className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300",
              accentColor
            )}
          ></div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductItem;