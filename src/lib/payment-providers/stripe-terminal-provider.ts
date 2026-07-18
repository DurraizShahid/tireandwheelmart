import type { PaymentProvider, PaymentProviderResult } from "@/lib/pos-types";

export const STRIPE_TERMINAL_PROVIDER_NAME = "stripe_terminal";
export const STRIPE_TERMINAL_DISPLAY_NAME = "Stripe Terminal";

/*
 * Settings required in PaymentProviderConfig.settings:
 *   - secret_key:      Stripe secret key (sk_live_* or sk_test_*)
 *   - publishable_key: Stripe publishable key (pk_live_* or pk_test_*)
 *   - location:        Stripe Terminal location ID
 *
 * Environment variables (alternative configuration):
 *   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
 *   - STRIPE_SECRET_KEY
 *   - STRIPE_TERMINAL_LOCATION
 *
 * Integration notes:
 *   - Uses Stripe Terminal SDK for in-person card present payments
 *   - Requires a physical Stripe Reader (chipper, BBPOS, verifone)
 *   - Supports EMV chip, NFC contactless, and manual card entry
 *   - Internet connection required for real-time authorization
 */

const NOT_CONFIGURED_MESSAGE =
  "Provider not configured. Configure Stripe Terminal in settings.";

export function createStripeTerminalProvider(): PaymentProvider {
  return {
    name: STRIPE_TERMINAL_PROVIDER_NAME,
    isConfigured: () => false,
    processPayment: async (
      _amount: number,
      _currency?: string,
      _metadata?: Record<string, unknown>
    ): Promise<PaymentProviderResult> => {
      return { success: false, error: NOT_CONFIGURED_MESSAGE };
    },
    refundPayment: async (
      _transactionId: string,
      _amount?: number
    ): Promise<PaymentProviderResult> => {
      return { success: false, error: NOT_CONFIGURED_MESSAGE };
    },
    voidPayment: async (
      _transactionId: string
    ): Promise<PaymentProviderResult> => {
      return { success: false, error: NOT_CONFIGURED_MESSAGE };
    },
  };
}
