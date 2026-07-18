import type { PaymentProvider, PaymentProviderResult } from "@/lib/pos-types";

export const RAZORPAY_PROVIDER_NAME = "razorpay_pos";
export const RAZORPAY_DISPLAY_NAME = "Razorpay POS";

/*
 * Settings required in PaymentProviderConfig.settings:
 *   - key_id:          Razorpay Key ID
 *   - key_secret:      Razorpay Key Secret
 *   - account_id:      Razorpay POS / merchant account ID (if applicable)
 *
 * Environment variables (alternative configuration):
 *   - NEXT_PUBLIC_RAZORPAY_KEY_ID
 *   - RAZORPAY_KEY_SECRET
 *   - RAZORPAY_ACCOUNT_ID
 *
 * Integration notes:
 *   - Uses Razorpay Payment Links API or Razorpay POS SDK (beta)
 *   - Supports Razorpay POS devices and Android-based terminals
 *   - Supports UPI, card, wallet, and netbanking at POS
 *   - Requires Razorpay merchant account with POS capability
 *   - Primarily for Indian market (INR currency)
 *   - Supports QR code-based payments via UPI
 */

const NOT_CONFIGURED_MESSAGE =
  "Provider not configured. Configure Razorpay POS in settings.";

export function createRazorpayProvider(): PaymentProvider {
  return {
    name: RAZORPAY_PROVIDER_NAME,
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
