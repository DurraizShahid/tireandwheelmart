"use client";

import { Shield, Zap, CloudRain, Snowflake, Award, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  { icon: Shield, title: "Durability", description: "Reinforced construction and advanced compound technology ensure long-lasting performance mile after mile." },
  { icon: Zap, title: "Performance", description: "Engineered for responsive handling, precise steering, and confident cornering in all conditions." },
  { icon: CloudRain, title: "Wet Traction", description: "Optimized tread pattern with circumferential grooves channels water away for superior hydroplaning resistance." },
  { icon: Snowflake, title: "Weather Rating", description: "Designed to perform across a wide temperature range with consistent grip in varying weather conditions." },
  { icon: Award, title: "Manufacturer Warranty", description: "Backed by comprehensive manufacturer warranty coverage for peace of mind on every purchase." },
  { icon: Clock, title: "Long Tread Life", description: "Advanced tread compound formulation delivers exceptional wear characteristics for extended mileage." },
];

export function ProductFeatures() {
  return (
    <Card className="rounded-2xl shadow-sm border border-gray-100">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-xl font-bold text-foreground">Key Features</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-100 bg-gray-50/30 p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground">{feature.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
