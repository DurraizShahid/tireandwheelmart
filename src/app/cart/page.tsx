"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/cart-context";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08;
  const shipping = items.length > 0 ? 15 : 0;
  const total = subtotal + tax + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-white flex flex-col items-center justify-center px-4">
        <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
        <h1 className="text-3xl font-bold text-foreground mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8 text-center">Add some products to get started!</p>
        <Link href="/">
          <Button className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">Review and manage your items</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {items.map((item) => (
                    <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {/* Product Image */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={item.imageSrc}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <Link href={`/product/${item.slug}`}>
                            <h3 className="font-semibold text-foreground hover:text-blue-600 transition-colors text-sm sm:text-base">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-lg font-bold text-blue-600 mt-1">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-2 sm:mt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-12 h-8 text-center border rounded-md bg-background text-foreground"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Price and Remove */}
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-between">
                        <p className="font-semibold text-foreground text-sm sm:text-base">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Clear Cart Button */}
            <div className="mt-6 flex gap-4">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
              <Button
                variant="destructive"
                onClick={clearCart}
                className="flex-1"
              >
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 border-b pb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">${shipping.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>

                <Link href="/checkout" className="block">
                  <Button className="w-full py-6 text-lg font-semibold">
                    Proceed to Checkout
                  </Button>
                </Link>

                {/* Promo Code */}
                <div className="mt-6 pt-4 border-t">
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border rounded-md bg-background text-foreground placeholder-muted-foreground"
                    />
                    <Button variant="outline" size="sm">
                      Apply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
