"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryHeroProps {
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  bgFrom?: string;
  bgVia?: string;
  bgTo?: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
}

export function CategoryHero({
  title,
  subtitle,
  description,
  image,
  bgFrom = "from-blue-600",
  bgVia = "via-blue-800",
  bgTo = "to-indigo-900",
  ctaPrimary,
  ctaSecondary,
}: CategoryHeroProps) {
  return (
    <section className={cn("relative overflow-hidden text-white bg-gradient-to-br", bgFrom, bgVia, bgTo)}>
      {image && (
        <div className="absolute inset-0 opacity-10">
          <Image
            src={image}
            alt=""
            fill
            className="object-contain object-right-bottom"
          />
        </div>
      )}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-3xl">
          {subtitle && (
            <p className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur-sm mb-6">
              {subtitle}
            </p>
          )}
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">{title}</h1>
          <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">{description}</p>
          <div className="flex flex-wrap gap-4">
            {ctaPrimary && (
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-base" asChild>
                <Link href={ctaPrimary.href}>
                  {ctaPrimary.label} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}
            {ctaSecondary && (
              <Button size="lg" className="border border-white/20 bg-transparent text-white hover:bg-white/10 px-8 py-6 text-base" asChild>
                <Link href={ctaSecondary.href}>{ctaSecondary.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="absolute -bottom-6 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
