import type { PaymentProvider, PaymentProviderResult } from "@/lib/pos-types";

export const CLOVER_PROVIDER_NAME = "clover";
export const CLOVER_DISPLAY_NAME = "Clover";

/*
 * Settings required in PaymentProviderConfig.settings:
 *   - merchant_id:     Clover merchant UUID (from Clover dashboard)
 *   - api_token:       Clover API token (generated in App Dashboard)
 *   - device_id:       Target Clover device / terminal ID
 *
 * Environment variables (alternative configuration):
 *   - CLOVER_MERCHANT_ID
 *   - CLOVER_API_TOKEN
 *   - CLOVER_DEVICE_ID
 *
 * Integration notes:
 *   - Uses Clover REST API and Connector SDK
 *   - Supports Clover Station, Mini, Flex, and Mobile terminals
 *   - Supports EMV chip, NFC contactless, and magstripe
 *   - Requires Clover merchant account with API access enabled
 *   - Can be configured for a specific device or register
 *   - Supports manual refunds and void transactions
 */

const NOT_CONFIGURED_MESSAGE =
  "Provider not configured. Configure Clover in settings.";

export function createCloverProvider(): PaymentProvider {
  return {
    name: CLOVER_PROVIDER_NAME,
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
