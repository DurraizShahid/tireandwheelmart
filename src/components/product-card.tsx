"use client";

import React from "react";
import Link from "next/link"; // Import Link
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  imageSrc: string;
  accentColor: string;
  href: string; // Add href prop for navigation
}

const ProductCard = ({
  title,
  description,
  icon: Icon,
  imageSrc,
  accentColor,
  href, // Destructure href
}: ProductCardProps) => {
  return (
    <Link href={href} className="block"> {/* Wrap with Link */}
      <Card className="relative overflow-hidden rounded-2xl shadow-xl border-none group cursor-pointer transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Subtle accent color overlay */}
        <div
          className={cn(
            "absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300",
            accentColor
          )}
        ></div>
        <CardContent className="relative z-10 p-6 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-4">
            <Icon className={cn("h-8 w-8", accentColor.replace('bg-', 'text-'))} />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Explore</span>
          </div>
          <div className="flex-grow">
            <h3 className="text-2xl font-semibold text-primary dark:text-primary-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {imageSrc && (
            <div className="absolute bottom-0 right-0 w-3/4 h-3/4 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
              <img
                src={imageSrc}
                alt={title}
                className="object-contain w-full h-full drop-shadow-2xl"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;