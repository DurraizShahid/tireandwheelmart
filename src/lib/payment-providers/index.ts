import type { PaymentProvider } from "@/lib/pos-types";
import { createCashProvider } from "./cash-provider";
import { createStripeTerminalProvider } from "./stripe-terminal-provider";
import { createSquareProvider } from "./square-provider";
import { createCloverProvider } from "./clover-provider";
import { createAdyenProvider } from "./adyen-provider";
import { createRazorpayProvider } from "./razorpay-provider";

export type PaymentProviderName =
  | "cash"
  | "stripe_terminal"
  | "square"
  | "clover"
  | "adyen"
  | "razorpay_pos";

const providers: Record<string, () => PaymentProvider> = {
  cash: createCashProvider,
  stripe_terminal: createStripeTerminalProvider,
  square: createSquareProvider,
  clover: createCloverProvider,
  adyen: createAdyenProvider,
  razorpay_pos: createRazorpayProvider,
};

export function getPaymentProvider(name: PaymentProviderName): PaymentProvider {
  const factory = providers[name];
  if (!factory) throw new Error(`Unknown payment provider: ${name}`);
  return factory();
}

export function getAvailableProviders(): {
  name: PaymentProviderName;
  configured: boolean;
}[] {
  return Object.entries(providers).map(([name, factory]) => ({
    name: name as PaymentProviderName,
    configured: factory().isConfigured(),
  }));
}
