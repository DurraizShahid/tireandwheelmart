"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "./QuantitySelector";
import type { CartItem as CartItemType } from "@/contexts/cart-context";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  compact?: boolean;
}

export function CartItem({ item, onUpdateQuantity, onRemove, compact }: CartItemProps) {
  return (
    <div className={`flex gap-3 ${compact ? "py-2" : "p-4 sm:p-6"} border-b last:border-b-0`}>
      <div className={`relative flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden ${
        compact ? "w-14 h-14" : "w-20 h-20 sm:w-24 sm:h-24"
      }`}>
        <Image
          src={item.imageSrc}
          alt={item.name}
          fill
          className="object-contain p-2"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={`/product/${item.slug}`}>
              <h3 className={`font-semibold text-foreground hover:text-blue-600 transition-colors truncate ${
                compact ? "text-sm" : "text-sm sm:text-base"
              }`}>
                {item.name}
              </h3>
            </Link>
            {item.brand && (
              <p className="text-xs text-muted-foreground mt-0.5">{item.brand}</p>
            )}
            {item.size && (
              <p className="text-xs text-muted-foreground font-mono">{item.size}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0 h-8 w-8 p-0"
            aria-label={`Remove ${item.name} from cart`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <QuantitySelector
            value={item.quantity}
            min={1}
            max={item.maxQuantity}
            onChange={(q) => onUpdateQuantity(item.id, q)}
            size={compact ? "sm" : "md"}
          />
          <p className={`font-semibold text-foreground ${compact ? "text-sm" : "text-sm sm:text-base"}`}>
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>

        <p className={`text-muted-foreground mt-1 ${compact ? "text-xs" : "text-xs sm:text-sm"}`}>
          ${item.price.toFixed(2)} each
        </p>

        {item.maxQuantity !== undefined && item.maxQuantity <= 5 && item.maxQuantity > 0 && (
          <p className={`text-amber-600 font-medium mt-0.5 ${compact ? "text-[10px]" : "text-xs"}`}>
            Low Stock — {item.maxQuantity} left
          </p>
        )}

        {item.maxQuantity === 0 && (
          <p className={`text-red-500 font-medium mt-0.5 ${compact ? "text-[10px]" : "text-xs"}`}>
            Out of Stock — remove from cart
          </p>
        )}
      </div>
    </div>
  );
}
