import type { PaymentProvider, PaymentProviderResult } from "@/lib/pos-types";

export const CASH_PROVIDER_NAME = "cash";
export const CASH_PROVIDER_DISPLAY_NAME = "Cash";

export function createCashProvider(): PaymentProvider {
  return {
    name: CASH_PROVIDER_NAME,
    isConfigured: () => true,
    processPayment: async (
      amount: number,
      _currency?: string,
      _metadata?: Record<string, unknown>
    ): Promise<PaymentProviderResult> => {
      return {
        success: true,
        transactionId: `CASH-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      };
    },
    refundPayment: async (
      _transactionId: string,
      _amount?: number
    ): Promise<PaymentProviderResult> => {
      return { success: true, transactionId: `CASH-REFUND-${Date.now()}` };
    },
    voidPayment: async (
      _transactionId: string
    ): Promise<PaymentProviderResult> => {
      return { success: true };
    },
  };
}
