import type { PaymentProvider, PaymentProviderResult } from "@/lib/pos-types";

export const ADYEN_PROVIDER_NAME = "adyen";
export const ADYEN_DISPLAY_NAME = "Adyen";

/*
 * Settings required in PaymentProviderConfig.settings:
 *   - api_key:         Adyen API key (from Adyen Customer Area)
 *   - merchant_account: Adyen merchant account identifier
 *   - environment:     "test" or "live"
 *   - pos_poi_id:      Point of interaction ID for the terminal
 *
 * Environment variables (alternative configuration):
 *   - ADYEN_API_KEY
 *   - ADYEN_MERCHANT_ACCOUNT
 *   - ADYEN_ENVIRONMENT
 *   - ADYEN_POS_POI_ID
 *
 * Integration notes:
 *   - Uses Adyen Terminal API (cloud-based) over HTTPS
 *   - Supports Adyen POS terminals (Verifone P400 Plus, etc.)
 *   - Supports EMV chip, NFC contactless, magstripe
 *   - Cloud-based or locally-connected terminal modes
 *   - Requires Adyen merchant account with POS channel enabled
 *   - Supports sale-to-POI protocol (MessageReference, POIData, etc.)
 */

const NOT_CONFIGURED_MESSAGE =
  "Provider not configured. Configure Adyen in settings.";

export function createAdyenProvider(): PaymentProvider {
  return {
    name: ADYEN_PROVIDER_NAME,
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
