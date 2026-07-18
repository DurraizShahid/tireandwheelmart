import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  getPaymentProvider,
  type PaymentProviderName,
} from "@/lib/payment-providers";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { provider, transactionId, amount } = body as {
      provider: PaymentProviderName;
      transactionId: string;
      amount?: number;
    };

    if (!provider || !transactionId) {
      return NextResponse.json(
        { error: "Invalid request: provider and transactionId required" },
        { status: 400 }
      );
    }

    const paymentProvider = getPaymentProvider(provider);
    if (!paymentProvider.isConfigured()) {
      return NextResponse.json(
        { error: "Payment provider is not configured" },
        { status: 400 }
      );
    }

    const result = await paymentProvider.refundPayment(transactionId, amount);

    return NextResponse.json(result, {
      status: result.success ? 200 : 422,
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
