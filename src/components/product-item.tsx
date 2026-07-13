import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Star, Snowflake, Sun, CloudRain, Zap, Gauge, Calendar, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface ProductSpecs {
  size?: string;
  loadSpeed?: string;
  season?: "All-Season" | "Summer" | "Winter" | "Performance" | "All-Terrain";
  type?: string;
  treadwear?: string;
  traction?: string;
  temperature?: string;
  warranty?: string;
  utqg?: string;
  construction?: string;
  loadIndex?: string;
  speedRating?: string;
}

interface ProductItemProps {
  name: string;
  price: string;
  imageSrc: string;
  accentColor?: string;
  href: string;
  specs?: ProductSpecs;
  rating?: number;
  reviews?: number;
  stock?: number;
}

const ProductItem = ({
  name,
  price,
  imageSrc,
  href,
  specs,
  rating,
  reviews,
  stock,
}: ProductItemProps) => {
  const getSeasonIcon = (season?: string) => {
    switch (season) {
      case "Winter": return <Snowflake className="h-3 w-3 mr-1" />;
      case "Summer": return <Sun className="h-3 w-3 mr-1" />;
      case "All-Season": return <CloudRain className="h-3 w-3 mr-1" />;
      case "Performance": return <Zap className="h-3 w-3 mr-1" />;
      default: return null;
    }
  };

  return (
    <Link href={href} className="block h-full">
      <Card className="relative h-full flex flex-col overflow-hidden rounded-xl shadow-none border border-gray-100 group cursor-pointer transition-all duration-300 hover:-translate-y-1 bg-white hover:bg-red-600">
        <div className="relative p-4 flex-grow flex flex-col">
          {/* Season Badge */}
          {specs?.season && (
            <div className="absolute top-3 left-3 z-20">
              <Badge variant="secondary" className="flex items-center text-xs font-medium bg-gray-100 text-foreground">
                {getSeasonIcon(specs.season)}
                {specs.season}
              </Badge>
            </div>
          )}

          {/* Image Area */}
          <div className="relative w-full h-40 mb-4 flex items-center justify-center bg-white rounded-lg group-hover:bg-gray-100 transition-colors">
            {/* Stock badge */}
            {stock !== undefined && stock <= 0 && (
              <div className="absolute top-1 left-1 z-20 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Out of Stock
              </div>
            )}
            {stock !== undefined && stock > 0 && stock <= 5 && (
              <div className="absolute top-1 left-1 z-20 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
                Low Stock
              </div>
            )}
            <Image
              src={imageSrc}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "contain" }}
              className={cn(
                "transition-transform duration-500 p-2",
                stock !== undefined && stock <= 0 ? "opacity-50 group-hover:scale-100" : "group-hover:scale-110"
              )}
            />
          </div>

          {/* Content */}
          <div className="flex flex-col flex-grow">
            <div className="flex items-center mb-1">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3 fill-current",
                      rating && rating > 0 && i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              {reviews !== undefined && (
                <span className="text-xs text-muted-foreground ml-1">({reviews})</span>
              )}
            </div>

            <h4 className="text-base font-bold text-foreground mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors group-hover:text-white">
              {name}
            </h4>

            {/* Specs Grid */}
            {specs && (
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-muted-foreground mb-3 bg-gray-50 p-2 rounded-md group-hover:bg-red-500/20 group-hover:text-red-50 transition-colors">
                {specs.size && (
                  <div className="col-span-2 font-mono font-medium text-foreground group-hover:text-white">
                    {specs.size}
                  </div>
                )}
                {specs.loadSpeed && <div>{specs.loadSpeed}</div>}
                {specs.type && <div className="text-right">{specs.type}</div>}
                
                {/* Additional tire specifications */}
                {(specs.loadIndex || specs.speedRating) && (
                  <div className="col-span-2 flex items-center text-foreground group-hover:text-white">
                    <Gauge className="h-3 w-3 mr-1" />
                    {specs.loadIndex && <span className="mr-2">Load: {specs.loadIndex}</span>}
                    {specs.speedRating && <span>Speed: {specs.speedRating}</span>}
                  </div>
                )}
                
                {/* UTQG Ratings */}
                {(specs.treadwear || specs.traction || specs.temperature) && (
                  <div className="col-span-2 flex flex-wrap items-center text-foreground group-hover:text-white">
                    <Shield className="h-3 w-3 mr-1" />
                    {specs.treadwear && <span className="mr-2">Treadwear: {specs.treadwear}</span>}
                    {specs.traction && <span className="mr-2">Traction: {specs.traction}</span>}
                    {specs.temperature && <span>Temp: {specs.temperature}</span>}
                  </div>
                )}
                
                {/* Warranty */}
                {specs.warranty && (
                  <div className="col-span-2 flex items-center text-foreground group-hover:text-white">
                    <Calendar className="h-3 w-3 mr-1" />
                    Warranty: {specs.warranty}
                  </div>
                )}
              </div>
            )}

            <div className="mt-auto flex items-center justify-between">
              <p className="text-lg font-bold text-foreground group-hover:text-white">{price}</p>
              <span className="text-xs font-medium text-blue-600 group-hover:underline group-hover:text-white">
                View Details
              </span>
            </div>
            {stock !== undefined && (
              <p className={`text-xs mt-1 ${
                stock <= 0 ? "text-red-500 group-hover:text-red-200"
                : stock <= 5 ? "text-amber-600 group-hover:text-amber-200"
                : "text-green-600 group-hover:text-green-200"
              }`}>
                {stock <= 0 ? "Out of Stock" : stock <= 5 ? `Low Stock (${stock} left)` : `In Stock (${stock})`}
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProductItem;