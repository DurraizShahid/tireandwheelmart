import type { CustomerInfo, ShippingAddress, BillingInfo, PaymentInfo, CheckoutFormData } from "./checkout-types";

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  return /^[\d\s\-+().]{7,20}$/.test(phone);
}

function validatePostalCode(code: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(code);
}

export function validateCustomerInfo(data: CustomerInfo): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.firstName.trim()) errors.firstName = "First name is required";
  if (!data.lastName.trim()) errors.lastName = "Last name is required";
  if (!data.email.trim()) errors.email = "Email is required";
  else if (!validateEmail(data.email)) errors.email = "Invalid email address";
  if (!data.phone.trim()) errors.phone = "Phone number is required";
  else if (!validatePhone(data.phone)) errors.phone = "Invalid phone number";
  return errors;
}

export function validateShippingAddress(data: ShippingAddress): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.country) errors.country = "Country is required";
  if (!data.state.trim()) errors.state = "State is required";
  if (!data.city.trim()) errors.city = "City is required";
  if (!data.postalCode.trim()) errors.postalCode = "Postal code is required";
  else if (!validatePostalCode(data.postalCode)) errors.postalCode = "Invalid postal code";
  if (!data.streetAddress.trim()) errors.streetAddress = "Street address is required";
  return errors;
}

export function validateBillingInfo(data: BillingInfo): Record<string, string> {
  if (data.sameAsShipping) return {};
  return validateShippingAddress(data.address);
}

export function validatePaymentInfo(data: PaymentInfo): Record<string, string> {
  const errors: Record<string, string> = {};
  if (data.method === "card") {
    if (!data.cardholderName.trim()) errors.cardholderName = "Cardholder name is required";
    if (!data.cardNumber.trim()) errors.cardNumber = "Card number is required";
    else if (data.cardNumber.replace(/\s/g, "").length < 13) errors.cardNumber = "Invalid card number";
    if (!data.expiry.trim()) errors.expiry = "Expiry date is required";
    else if (!/^\d{2}\/\d{2}$/.test(data.expiry)) errors.expiry = "Use MM/YY format";
    if (!data.cvv.trim()) errors.cvv = "CVV is required";
    else if (!/^\d{3,4}$/.test(data.cvv)) errors.cvv = "Invalid CVV";
  }
  return errors;
}

export function canProceedToStep(formData: CheckoutFormData, step: string): boolean { // unused
  switch (step) {
    case "customer-info":
      return Object.keys(validateCustomerInfo(formData.customerInfo)).length === 0;
    case "shipping-address":
      return Object.keys(validateShippingAddress(formData.shippingAddress)).length === 0;
    case "shipping-method":
      return formData.shippingMethod !== null;
    case "billing-info":
      return Object.keys(validateBillingInfo(formData.billingInfo)).length === 0;
    case "payment":
      return Object.keys(validatePaymentInfo(formData.paymentInfo)).length === 0;
    default:
      return true;
  }
}

export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

export function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${ts}-${rand}`;
}

export function getDefaultCheckoutFormData(): CheckoutFormData {
  return {
    customerInfo: { firstName: "", lastName: "", email: "", phone: "", newsletter: false },
    shippingAddress: { country: "United States", state: "", city: "", postalCode: "", streetAddress: "", apartment: "" },
    shippingMethod: null,
    billingInfo: { sameAsShipping: true, address: { country: "United States", state: "", city: "", postalCode: "", streetAddress: "", apartment: "" } },
    paymentInfo: { method: "card", cardholderName: "", cardNumber: "", expiry: "", cvv: "" },
  };
}
