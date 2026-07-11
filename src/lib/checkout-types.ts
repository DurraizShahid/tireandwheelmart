export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  newsletter: boolean;
}

export interface ShippingAddress {
  country: string;
  state: string;
  city: string;
  postalCode: string;
  streetAddress: string;
  apartment: string;
}

export interface ShippingMethod {
  id: string;
  label: string;
  description: string;
  cost: number;
  estimatedDays: string;
}

export interface BillingInfo {
  sameAsShipping: boolean;
  address: ShippingAddress;
}

export type PaymentMethodType = "card" | "stripe" | "paypal" | "apple-pay" | "google-pay" | "bank-transfer";

export interface PaymentInfo {
  method: PaymentMethodType;
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export interface CheckoutFormData {
  customerInfo: CustomerInfo;
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod | null;
  billingInfo: BillingInfo;
  paymentInfo: PaymentInfo;
}

export type CheckoutStep = "customer-info" | "shipping-address" | "shipping-method" | "billing-info" | "payment" | "review" | "confirmation";

export const CHECKOUT_STEP_LABELS: Record<CheckoutStep, string> = {
  "customer-info": "Customer",
  "shipping-address": "Shipping",
  "shipping-method": "Method",
  "billing-info": "Billing",
  payment: "Payment",
  review: "Review",
  confirmation: "Confirmed",
};

export const CHECKOUT_STEPS: CheckoutStep[] = [
  "customer-info",
  "shipping-address",
  "shipping-method",
  "billing-info",
  "payment",
  "review",
  "confirmation",
];

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "standard",
    label: "Standard Shipping",
    description: "Reliable delivery at no extra cost",
    cost: 0,
    estimatedDays: "5-7 business days",
  },
  {
    id: "express",
    label: "Express Shipping",
    description: "Faster delivery for urgent orders",
    cost: 14.99,
    estimatedDays: "2-3 business days",
  },
  {
    id: "priority",
    label: "Priority Shipping",
    description: "Next-business-day delivery",
    cost: 29.99,
    estimatedDays: "1-2 business days",
  },
  {
    id: "pickup",
    label: "Local Pickup",
    description: "Free pickup at our warehouse (ready in 2hrs)",
    cost: 0,
    estimatedDays: "Same day",
  },
];

export const PAYMENT_METHODS: { id: PaymentMethodType; label: string; description: string }[] = [
  { id: "card", label: "Credit / Debit Card", description: "Visa, Mastercard, Amex, Discover" },
  { id: "stripe", label: "Stripe", description: "Pay with Stripe" },
  { id: "paypal", label: "PayPal", description: "Fast & secure payments" },
  { id: "apple-pay", label: "Apple Pay", description: "Pay with Touch ID or Face ID" },
  { id: "google-pay", label: "Google Pay", description: "Fast checkout with Google" },
  { id: "bank-transfer", label: "Bank Transfer", description: "Direct bank transfer (3-5 days)" },
];

export const COUNTRIES = ["United States", "Canada"];

export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming",
];

export const CANADA_PROVINCES = [ // unused
  "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador",
  "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan",
];
