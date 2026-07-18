import type {
  PaymentProviderResult,
  PaymentProvider,
} from "@/lib/pos-types";

export type { PaymentProviderResult, PaymentProvider };

export interface PaymentProviderConfig {
  enabled: boolean;
  displayName: string;
  settings: Record<string, string>;
}

export interface PaymentProcessor {
  name: string;
  provider: PaymentProviderConfig;
  processPayment(amount: number, currency?: string, metadata?: Record<string, unknown>): Promise<PaymentProviderResult>;
  refundPayment(transactionId: string, amount?: number): Promise<PaymentProviderResult>;
  voidPayment(transactionId: string): Promise<PaymentProviderResult>;
  isConfigured(): boolean;
}
