"use client";

import { Lightbulb, CheckCircle2, Star } from "lucide-react";
import Link from "next/link";
import type { BuyingGuideSection } from "@/lib/catalog-types";

interface BuyingGuideProps {
  guide: BuyingGuideSection;
}

export function BuyingGuide({ guide }: BuyingGuideProps) {
  if (!guide) return null;

  return (
    <section id="buying-guide" className="py-12 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-2">{guide.title}</h2>
          <p className="text-sm text-muted-foreground">{guide.description}</p>
        </div>

        {/* Tips */}
        {guide.tips && guide.tips.length > 0 && (
          <div className="mb-10">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" /> Expert Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {guide.tips.map((tip, i) => (
                <div key={i} className="rounded-lg border p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-foreground text-sm mb-1">{tip.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        {guide.features && guide.features.length > 0 && (
          <div className="mb-10">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-500" /> Key Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {guide.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {guide.recommendations && guide.recommendations.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Our Recommendations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {guide.recommendations.map((rec, i) => (
                <div key={i} className="rounded-lg border p-5 hover:shadow-lg transition-all hover:-translate-y-0.5">
                  <p className="text-xs font-medium text-blue-600 mb-1">
                    {i === 0 ? "TOP PICK" : i === 1 ? "BEST VALUE" : "PREMIUM"}
                  </p>
                  <h4 className="font-bold text-foreground text-sm mb-1">{rec.title}</h4>
                  <p className="text-xs text-muted-foreground mb-3">{rec.description}</p>
                  {rec.link && (
                    <Link
                      href={rec.link}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      View Details →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
