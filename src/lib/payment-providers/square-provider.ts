import type { PaymentProvider, PaymentProviderResult } from "@/lib/pos-types";

export const SQUARE_PROVIDER_NAME = "square";
export const SQUARE_DISPLAY_NAME = "Square";

/*
 * Settings required in PaymentProviderConfig.settings:
 *   - application_id:  Square application ID
 *   - access_token:    Square OAuth access token or personal access token
 *   - location_id:     Square location ID for the register
 *
 * Environment variables (alternative configuration):
 *   - NEXT_PUBLIC_SQUARE_APPLICATION_ID
 *   - SQUARE_ACCESS_TOKEN
 *   - SQUARE_LOCATION_ID
 *
 * Integration notes:
 *   - Uses Square Payments API and Square Terminal SDK
 *   - Supports Square Reader and Square Terminal devices
 *   - Supports EMV chip, NFC contactless, magstripe, and Square Gift Cards
 *   - Requires Square merchant account with POS permissions
 *   - Can process both card-present and card-on-file transactions
 */

const NOT_CONFIGURED_MESSAGE =
  "Provider not configured. Configure Square in settings.";

export function createSquareProvider(): PaymentProvider {
  return {
    name: SQUARE_PROVIDER_NAME,
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
