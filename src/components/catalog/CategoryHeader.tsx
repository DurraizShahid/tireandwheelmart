"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface CategoryHeaderProps {
  title: string;
  description?: string;
  image?: string;
  subtitle?: string;
  className?: string;
}

export function CategoryHeader({ title, description, image, subtitle, className }: CategoryHeaderProps) {
  return (
    <section className={cn(
      "relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white",
      className
    )}>
      {image && (
        <div className="absolute inset-0 opacity-20">
          <Image
            src={image}
            alt=""
            fill
            className="object-contain object-right-bottom"
          />
        </div>
      )}
      <div className="relative px-6 py-12 md:px-10 md:py-16">
        {subtitle && (
          <p className="text-sm font-medium text-blue-300 uppercase tracking-widest mb-2">{subtitle}</p>
        )}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">{title}</h1>
        {description && (
          <p className="text-base md:text-lg text-gray-300 max-w-2xl">{description}</p>
        )}
      </div>
    </section>
  );
}
