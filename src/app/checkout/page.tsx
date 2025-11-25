"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/cart-context";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const [step, setStep] = useState<"shipping" | "payment" | "review" | "confirmation">(
    "shipping" as "shipping" | "payment" | "review" | "confirmation"
  );

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
  });

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-white dark:bg-background flex flex-col items-center justify-center px-4">
        <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
        <h1 className="text-3xl font-bold text-foreground mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Add items to checkout</p>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08;
  const shipping = 15;
  const total = subtotal + tax + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (step === "shipping") {
      if (!formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.zipCode) {
        toast.error("Please fill all shipping fields");
        return;
      }
      setStep("payment");
    } else if (step === "payment") {
      if (!formData.cardName || !formData.cardNumber || !formData.cardExpiry || !formData.cardCVC) {
        toast.error("Please fill all payment fields");
        return;
      }
      setStep("review");
    } else if (step === "review") {
      setStep("confirmation");
      toast.success("Order placed successfully!");
      clearCart();
    }
  };

  const handlePrevStep = () => {
    if (step === "payment") {
      setStep("shipping");
    } else if (step === "review") {
      setStep("payment");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Steps Indicator */}
        {step !== "confirmation" && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <div
                  className={`h-2 rounded-full transition-all ${
                    step === "shipping" ? "bg-blue-600" : "bg-green-600"
                  }`}
                  style={{
                    width: step === "shipping" ? "33%" : step === "payment" ? "66%" : "100%",
                  }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="text-center">
                <div className={`h-8 w-8 sm:h-12 sm:w-12 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-sm sm:text-base ${
                  step === "shipping" || step === "payment" || step === "review"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {step === "shipping" || step === "payment" || step === "review" ? "1" : <Check className="w-4 h-4 sm:w-6 sm:h-6" />}
                </div>
                <p className="text-xs sm:text-sm font-medium">Shipping</p>
              </div>

              <div className="text-center">
                <div className={`h-8 w-8 sm:h-12 sm:w-12 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-sm sm:text-base ${
                  step === "payment" || step === "review"
                    ? "bg-blue-600 text-white"
                    : (step as any) === "confirmation"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {step === "payment" || step === "review" ? "2" : (step as any) === "confirmation" ? <Check className="w-4 h-4 sm:w-6 sm:h-6" /> : "2"}
                </div>
                <p className="text-xs sm:text-sm font-medium">Payment</p>
              </div>

              <div className="text-center">
                <div className={`h-8 w-8 sm:h-12 sm:w-12 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-sm sm:text-base ${
                  step === "review"
                    ? "bg-blue-600 text-white"
                    : (step as any) === "confirmation"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {(step as any) === "confirmation" ? <Check className="w-4 h-4 sm:w-6 sm:h-6" /> : "3"}
                </div>
                <p className="text-xs sm:text-sm font-medium">Review</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === "confirmation" ? (
              <Card className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h2>
                    <p className="text-muted-foreground">Thank you for your purchase</p>
                  </div>

                  <div className="bg-white dark:bg-background rounded-lg p-6 my-6">
                    <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                    <p className="text-2xl font-bold text-foreground mb-6">ORD-2024-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>

                    <Separator className="my-4" />

                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Confirmation email sent to:</span> <span className="font-medium">{formData.email}</span></p>
                      <p><span className="text-muted-foreground">Estimated delivery:</span> <span className="font-medium">3-5 business days</span></p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Link href="/" className="flex-1">
                      <Button className="w-full">
                        Continue Shopping
                      </Button>
                    </Link>
                    <Link href="/track-order" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Track Order
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : step === "shipping" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                  <CardDescription>Enter your delivery address</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main St"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="NY"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="10001"
                    />
                  </div>
                </CardContent>
              </Card>
            ) : step === "payment" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Enter your card details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="4532 1234 5678 9010"
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cardExpiry">Expiry Date</Label>
                      <Input
                        id="cardExpiry"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardCVC">CVC</Label>
                      <Input
                        id="cardCVC"
                        name="cardCVC"
                        value={formData.cardCVC}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength={3}
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-lg text-sm text-foreground">
                    <p className="font-medium mb-1">Demo Card Information</p>
                    <p>You can use any combination of numbers for testing purposes.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Order Review</CardTitle>
                  <CardDescription>Confirm your order details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Shipping Info */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Shipping Address</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{formData.firstName} {formData.lastName}</p>
                      <p>{formData.address}</p>
                      <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                      <p>{formData.email}</p>
                    </div>
                    <Button
                      variant="link"
                      onClick={() => setStep("shipping")}
                      className="mt-2 p-0 h-auto"
                    >
                      Edit
                    </Button>
                  </div>

                  <Separator />

                  {/* Payment Info */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Payment Method</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{formData.cardName}</p>
                      <p>•••• •••• •••• {formData.cardNumber.slice(-4)}</p>
                    </div>
                    <Button
                      variant="link"
                      onClick={() => setStep("payment")}
                      className="mt-2 p-0 h-auto"
                    >
                      Edit
                    </Button>
                  </div>

                  <Separator />

                  {/* Items Summary */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Order Items</h3>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{item.name} x {item.quantity}</span>
                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            {step !== "confirmation" && (
              <div className="flex gap-4 mt-6">
                {step !== "shipping" && (
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    className="flex-1"
                  >
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleNextStep}
                  className={step === "shipping" ? "flex-1" : "ml-auto"}
                >
                  {step === "review" ? "Place Order" : "Next"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 border-b pb-4 max-h-[300px] overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.name} x{item.quantity}</span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
