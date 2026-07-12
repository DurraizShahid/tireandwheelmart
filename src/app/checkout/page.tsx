"use client";

import Link from "next/link";
import { ChevronRight, ChevronLeft, Loader2, LogIn, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useCart } from "@/contexts/cart-context";
import { useCheckoutForm } from "@/hooks/use-checkout-form";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { StepCustomerInfo } from "@/components/checkout/StepCustomerInfo";
import { StepShippingAddress } from "@/components/checkout/StepShippingAddress";
import { StepShippingMethod } from "@/components/checkout/StepShippingMethod";
import { StepBillingInfo } from "@/components/checkout/StepBillingInfo";
import { StepPayment } from "@/components/checkout/StepPayment";
import { StepReviewOrder } from "@/components/checkout/StepReviewOrder";
import { StepConfirmation } from "@/components/checkout/StepConfirmation";
import { CheckoutPromotions } from "@/components/promotions/CheckoutPromotions";
import { SHIPPING_METHODS as FALLBACK_METHODS } from "@/lib/checkout-types";

export default function CheckoutPage() {
  const { isSignedIn } = useUser();
  const { items } = useCart();
  const {
    step, formData, errors, isTransitioning, isSubmitting, orderNumber, shippingCost,
    updateCustomerInfo, updateShippingAddress, updateShippingMethod, updateBillingInfo, updatePaymentInfo,
    goToStep, goNext, goBack, submitOrder, shippingMethods,
  } = useCheckoutForm();

  if (items.length === 0 && step !== "confirmation") {
    return (
      <div className="min-h-[60vh] bg-white flex flex-col items-center justify-center px-4">
        <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
        <h1 className="text-3xl font-bold text-foreground mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Add items to your cart before checking out.</p>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const isConfirmation = step === "confirmation";
  const shippingMethod = formData.shippingMethod ?? shippingMethods[0] ?? FALLBACK_METHODS[0];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {isConfirmation ? (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <StepConfirmation
              orderNumber={orderNumber}
              customerEmail={formData.customerInfo.email}
              shippingMethodLabel={shippingMethod.label}
              estimatedDays={shippingMethod.estimatedDays}
              shippingCost={shippingCost}
            />
          </div>
        </div>
      ) : (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <CheckoutProgress currentStep={step} onStepClick={goToStep} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main form area */}
              <div className="lg:col-span-2 space-y-6">
                <div className={isTransitioning ? "opacity-0 translate-x-4 transition-all duration-300" : "opacity-100 translate-x-0 transition-all duration-300"}>
                  {step === "customer-info" && (
                    <StepCustomerInfo data={formData.customerInfo} errors={errors} onChange={updateCustomerInfo} />
                  )}
                  {step === "shipping-address" && (
                    <StepShippingAddress data={formData.shippingAddress} errors={errors} onChange={updateShippingAddress} />
                  )}
                  {step === "shipping-method" && (
                    <StepShippingMethod selected={formData.shippingMethod} errors={errors} onChange={updateShippingMethod} methods={shippingMethods} />
                  )}
                  {step === "billing-info" && (
                    <StepBillingInfo data={formData.billingInfo} errors={errors} onChange={updateBillingInfo} />
                  )}
                  {step === "payment" && (
                    <StepPayment data={formData.paymentInfo} errors={errors} onChange={updatePaymentInfo} />
                  )}
                  {step === "review" && (
                    <StepReviewOrder formData={formData} shippingCost={shippingCost} onEdit={goToStep} />
                  )}
                </div>

                {/* Navigation buttons (desktop) */}
                <div className="hidden lg:flex items-center justify-between gap-4">
                  <div>
                    {step !== "customer-info" && (
                      <Button variant="outline" onClick={goBack} className="gap-2">
                        <ChevronLeft className="h-4 w-4" /> Back
                      </Button>
                    )}
                  </div>
                  {step === "review" ? (
                    isSignedIn ? (
                      <Button onClick={submitOrder} disabled={isSubmitting} className="min-w-[180px] h-12 text-base gap-2">
                        {isSubmitting ? (
                          <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                        ) : (
                          <><ShoppingCart className="h-5 w-5" /> Place Order</>
                        )}
                      </Button>
                    ) : (
                    <SignInButton mode="modal">
                      <Button className="min-w-[180px] h-12 text-base gap-2">
                        <LogIn className="h-5 w-5" /> Sign in to Place Order
                      </Button>
                    </SignInButton>
                    )
                  ) : (
                    <Button onClick={goNext} className="min-w-[140px] h-12 text-base gap-2">
                      Continue <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Order Summary sidebar */}
              <div className="lg:col-span-1 space-y-4">
                <div className="hidden lg:block">
                  <OrderSummary shippingCost={shippingCost} />
                  <CheckoutPromotions
                    items={items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, brand: i.brand }))}
                    subtotal={items.reduce((s, i) => s + i.price * i.quantity, 0)}
                    className="bg-white rounded-xl border border-gray-100 p-4 mt-4"
                  />
                </div>
                <div className="lg:hidden">
                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <OrderSummary compact shippingCost={shippingCost} />
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed bottom bar (mobile) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-40">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm">
                  <p className="text-muted-foreground">Total</p>
                  <p className="text-lg font-bold text-blue-600">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                      items.reduce((s, i) => s + i.price * i.quantity, 0) * 1.08 + shippingCost
                    )}
                  </p>
                </div>
                {step === "review" ? (
                  isSignedIn ? (
                    <Button onClick={submitOrder} disabled={isSubmitting} className="flex-1 h-12 gap-2">
                      {isSubmitting ? (
                        <><Loader2 className="h-5 w-5 animate-spin" /> Processing</>
                      ) : (
                        <>Place Order</>
                      )}
                    </Button>
                  ) : (
                    <SignInButton mode="modal">
                      <Button className="flex-1 h-12 gap-2">
                        <LogIn className="h-5 w-5" /> Sign in to Place Order
                      </Button>
                    </SignInButton>
                  )
                ) : (
                  <Button onClick={goNext} className="flex-1 h-12 gap-2">
                    Continue <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Spacer for mobile fixed bar */}
            <div className="h-20 lg:hidden" />
          </div>
        </div>
      )}
    </div>
  );
}
