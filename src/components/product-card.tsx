"use client";

import React from "react";
import Link from "next/link"; // Import Link
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { ArrowUpRight, Star } from "lucide-react"; // Import ArrowUpRight and Star

interface ProductCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  imageSrc: string;
  accentColor: string;
  href: string; // Add href prop for navigation
  rating?: number; // Add rating prop
  reviewCount?: number; // Add review count prop
}

const ProductCard = ({
  title,
  description,
  icon: Icon,
  imageSrc,
  accentColor,
  href, // Destructure href
  rating = 0, // Default rating
  reviewCount = 0 // Default review count
}: ProductCardProps) => {
  // Function to render star ratings
  const renderRating = () => {
    if (rating === 0) return null;
    
    return (
      <div className="flex items-center mt-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < Math.floor(rating) 
                  ? "text-yellow-400 fill-yellow-400" 
                  : "text-gray-300"
              )}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground ml-1">
          {rating.toFixed(1)} ({reviewCount})
        </span>
      </div>
    );
  };

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
            <Icon className="h-8 w-8 text-red-600" />
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-red-600 transition-colors">Explore</span>
              <ArrowUpRight className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-red-600 transition-colors" />
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="text-2xl font-semibold text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
            {renderRating()}
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