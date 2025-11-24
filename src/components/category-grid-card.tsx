"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CategoryGridCardProps {
  title: string;
  imageSrc: string;
  href: string;
  backgroundColor?: string; // Optional background color for special cards (like red for batteries)
}

const CategoryGridCard = ({
  title,
  imageSrc,
  href,
  backgroundColor = "bg-gray-100 dark:bg-gray-800", // Default light gray background
}: CategoryGridCardProps) => {
  return (
    <Link href={href} className="block h-full">
      <Card className={cn(
        "relative overflow-hidden rounded-lg shadow-sm border-none group cursor-pointer transition-all duration-300 hover:scale-[1.02]",
        backgroundColor
      )}>
        <CardContent className="relative z-10 p-4 flex items-center justify-between h-full">
          <h3 className={cn(
            "text-lg font-semibold text-primary dark:text-primary-foreground uppercase",
            backgroundColor === "bg-red-600" && "text-white dark:text-white" // Text white for red background
          )}>
            {title}
          </h3>
          {imageSrc && (
            <div className="relative w-24 h-24 flex-shrink-0"> {/* Fixed size for image container */}
              <Image
                src={imageSrc}
                alt={title}
                fill
                sizes="96px" // Image size for responsiveness
                style={{ objectFit: "contain" }}
                className="drop-shadow-md"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryGridCard;