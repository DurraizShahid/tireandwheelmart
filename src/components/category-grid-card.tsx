"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CategoryGridCardProps {
  title: string;
  href: string;
  imageSrc?: string;
  description?: string;
  backgroundColor?: string; // Optional background color for special cards
}

const CategoryGridCard = ({
  title,
  href,
  imageSrc,
  description,
  backgroundColor = "bg-gray-100", // Default light gray background
}: CategoryGridCardProps) => {
  return (
    <Link href={href} className="block h-full">
      <Card className={cn(
        "relative overflow-hidden rounded-lg shadow-md border border-gray-200 group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:bg-red-600",
        backgroundColor
      )}>
        <CardContent className="relative z-10 p-3 sm:p-5 flex flex-col sm:flex-row items-center justify-between h-full min-h-[120px] sm:min-h-[160px] gap-2 sm:gap-0">
          {/* Text on the left */}
          <div className="flex-1 pr-0 sm:pr-4 flex flex-col justify-center">
            <h3 className={cn(
              "text-sm sm:text-lg md:text-xl font-bold text-foreground uppercase leading-tight mb-1 sm:mb-2 group-hover:text-white transition-colors duration-300",
              backgroundColor === "bg-red-600" && "text-white"
            )}>
              {title}
            </h3>
            {description && (
              <p className={cn(
                "text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 group-hover:text-red-50 transition-colors duration-300",
                backgroundColor === "bg-red-600" && "text-red-50"
              )}>
                {description}
              </p>
            )}
          </div>

          {/* Image on the right */}
          {imageSrc && (
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={imageSrc}
                alt={title}
                fill
                sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, 128px"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryGridCard;