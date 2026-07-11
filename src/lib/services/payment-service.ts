import type { ServiceResult } from "./types";
import { success, failure } from "./types";
import type { PaymentInfo } from "@/lib/checkout-types";

export interface PaymentResult {
  transactionId: string;
  status: "succeeded" | "declined" | "pending";
  message: string;
}

export interface PaymentService {
  processPayment(payment: PaymentInfo, amount: number): Promise<ServiceResult<PaymentResult>>;
}

export function createMockPaymentService(): PaymentService {
  return {
    async processPayment(payment, amount) {
      const transactionId = `txn_${Date.now().toString(36)}`;
      if (payment.method === "card" && payment.cardNumber) {
        const last4 = payment.cardNumber.replace(/\s/g, "").slice(-4);
        return success({
          transactionId,
          status: "succeeded",
          message: `Payment of $${amount.toFixed(2)} succeeded (card ending in ${last4})`,
        });
      }
      return success({
        transactionId,
        status: "succeeded",
        message: `Payment of $${amount.toFixed(2)} processed via ${payment.method}`,
      });
    },
  };
}
