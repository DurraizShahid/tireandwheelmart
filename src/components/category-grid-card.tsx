"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CategoryGridCardProps {
  title: string;
  href: string;
  backgroundColor?: string; // Optional background color for special cards (like red for batteries)
}

const CategoryGridCard = ({
  title,
  href,
  backgroundColor = "bg-gray-100 dark:bg-gray-800", // Default light gray background
}: CategoryGridCardProps) => {
  return (
    <Link href={href} className="block h-full">
      <Card className={cn(
        "relative overflow-hidden rounded-lg shadow-sm border-none group cursor-pointer transition-all duration-300 hover:scale-[1.02]",
        backgroundColor
      )}>
        <CardContent className="relative z-10 p-4 flex items-center h-full"> {/* Removed justify-between */}
          <h3 className={cn(
            "text-lg font-semibold text-primary dark:text-primary-foreground uppercase text-left", // Explicitly set text-left
            backgroundColor === "bg-red-600" && "text-white dark:text-white" // Text white for red background
          )}>
            {title}
          </h3>
          {/* The image/icon was removed in a previous step */}
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryGridCard;