"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import type { CheckoutStep, CheckoutFormData, CustomerInfo, ShippingAddress, ShippingMethod, BillingInfo, PaymentInfo } from "@/lib/checkout-types";
import { CHECKOUT_STEPS, SHIPPING_METHODS } from "@/lib/checkout-types";
import { getDefaultCheckoutFormData, validateCustomerInfo, validateShippingAddress, validateBillingInfo, validatePaymentInfo, generateOrderNumber } from "@/lib/checkout-utils";
import { useCart } from "@/contexts/cart-context";

export function useCheckoutForm() {
  const { clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>("customer-info");
  const [formData, setFormData] = useState<CheckoutFormData>(getDefaultCheckoutFormData());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>(SHIPPING_METHODS);

  useEffect(() => {
    fetch("/api/shipping")
      .then((r) => r.json())
      .then((methods: ShippingMethod[]) => {
        if (methods.length > 0) {
          setShippingMethods(methods);
        }
      });
  }, []);

  const currentIndex = CHECKOUT_STEPS.indexOf(step);

  const updateCustomerInfo = useCallback((data: CustomerInfo) => {
    setFormData((prev) => ({ ...prev, customerInfo: data }));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(validateCustomerInfo(data)).forEach((k) => delete next[k]);
      return next;
    });
  }, []);

  const updateShippingAddress = useCallback((data: ShippingAddress) => {
    setFormData((prev) => ({ ...prev, shippingAddress: data }));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(validateShippingAddress(data)).forEach((k) => delete next[k]);
      return next;
    });
  }, []);

  const updateShippingMethod = useCallback((method: ShippingMethod) => {
    setFormData((prev) => ({ ...prev, shippingMethod: method }));
  }, []);

  const updateBillingInfo = useCallback((data: BillingInfo) => {
    setFormData((prev) => ({ ...prev, billingInfo: data }));
  }, []);

  const updatePaymentInfo = useCallback((data: PaymentInfo) => {
    setFormData((prev) => ({ ...prev, paymentInfo: data }));
    if (data.method === "card") {
      setErrors((prev) => {
        const next = { ...prev };
        Object.keys(validatePaymentInfo(data)).forEach((k) => delete next[k]);
        return next;
      });
    }
  }, []);

  const goToStep = useCallback((s: CheckoutStep) => {
    const idx = CHECKOUT_STEPS.indexOf(s);
    if (idx < currentIndex) {
      setStep(s);
      setErrors({});
    }
  }, [currentIndex]);

  const goNext = useCallback(() => {
    const newErrors: Record<string, string> = {};
    switch (step) {
      case "customer-info":
        Object.assign(newErrors, validateCustomerInfo(formData.customerInfo));
        break;
      case "shipping-address":
        Object.assign(newErrors, validateShippingAddress(formData.shippingAddress));
        break;
      case "shipping-method":
        if (!formData.shippingMethod) newErrors.shippingMethod = "Select a shipping method";
        break;
      case "billing-info":
        Object.assign(newErrors, validateBillingInfo(formData.billingInfo));
        break;
      case "payment":
        Object.assign(newErrors, validatePaymentInfo(formData.paymentInfo));
        break;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const nextIndex = currentIndex + 1;
    if (nextIndex < CHECKOUT_STEPS.length) {
      setIsTransitioning(true);
      setTimeout(() => {
        setStep(CHECKOUT_STEPS[nextIndex]);
        setIsTransitioning(false);
      }, 300);
    }
  }, [step, currentIndex, formData]);

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setStep(CHECKOUT_STEPS[currentIndex - 1]);
      setErrors({});
    }
  }, [currentIndex]);

  const submitOrder = useCallback(() => {
    setIsSubmitting(true);
    setErrors({});
    setTimeout(() => {
      const num = generateOrderNumber();
      setOrderNumber(num);
      clearCart();
      setStep("confirmation");
      setIsSubmitting(false);
      toast.success("Order placed successfully!");
    }, 1500);
  }, [clearCart]);

  const shippingCost = formData.shippingMethod?.cost ?? shippingMethods[0]?.cost ?? 0;
  const defaultShippingMethod = shippingMethods[0] ?? SHIPPING_METHODS[0];

  return {
    step,
    setStep,
    formData,
    errors,
    isTransitioning,
    isSubmitting,
    orderNumber,
    currentIndex,
    shippingCost,
    defaultShippingMethod,
    updateCustomerInfo,
    updateShippingAddress,
    updateShippingMethod,
    updateBillingInfo,
    updatePaymentInfo,
    goToStep,
    goNext,
    goBack,
    submitOrder,
    shippingMethods,
  };
}
