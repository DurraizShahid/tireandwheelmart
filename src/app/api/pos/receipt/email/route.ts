import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import { createEmailService } from "@/lib/services/email-service";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { orderNumber } = await req.json();
    if (!orderNumber || typeof orderNumber !== "string") {
      return NextResponse.json({ error: "orderNumber is required" }, { status: 400 });
    }

    const db = createServerClient();

    const { data: order, error: orderError } = await db
      .from("orders")
      .select("*, customers(first_name, last_name, email, phone), order_items(*, products(name))")
      .eq("order_number", orderNumber)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const customerEmail = order.customers?.email;
    if (!customerEmail) {
      return NextResponse.json({ error: "Customer has no email address" }, { status: 400 });
    }

    const customerName = order.customers
      ? [order.customers.first_name, order.customers.last_name].filter(Boolean).join(" ")
      : "Valued Customer";

    const payments = (
      order.payment_method as {
        method?: string;
        details?: Array<{ method: string; amount: number }>;
      }
    )?.details ?? [];
    const paymentInfo =
      payments.length > 0
        ? payments.map((p) => `${p.method.replace(/_/g, " ")}: $${p.amount.toFixed(2)}`).join(", ")
        : `Cash: $${(order.total ?? 0).toFixed(2)}`;

    const itemsHtml = (order.order_items ?? [])
      .map(
        (item: {
          quantity: number;
          unit_price: number;
          total_price: number;
          products?: { name: string };
        }) => {
          const name = (item.products as { name?: string })?.name ?? "Unknown Product";
          return `<tr>
            <td style="padding:10px;border-bottom:1px solid #e2e8f0">${name}</td>
            <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:center">${item.quantity}</td>
            <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right">$${item.unit_price.toFixed(2)}</td>
            <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right">$${item.total_price.toFixed(2)}</td>
          </tr>`;
        },
      )
      .join("");

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,Helvetica,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden">
        <tr>
          <td style="background-color:#1e293b;padding:24px;text-align:center">
            <h1 style="margin:0;color:#ffffff;font-size:22px">Tire&Wheel Mart</h1>
            <p style="margin:8px 0 0;color:#94a3b8;font-size:14px">POS Receipt</p>
          </td>
        </tr>
        <tr><td style="padding:24px">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:14px;color:#475569">
                <strong>${customerName}</strong><br>
                ${customerEmail ? `Email: ${customerEmail}` : ""}
              </td>
              <td style="font-size:14px;color:#475569;text-align:right">
                <strong>Order #${order.order_number}</strong><br>
                ${new Date(order.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </td>
            </tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;border-collapse:collapse">
            <thead>
              <tr style="background-color:#f8fafc">
                <th style="padding:10px;text-align:left;font-size:13px;color:#64748b;text-transform:uppercase">Item</th>
                <th style="padding:10px;text-align:center;font-size:13px;color:#64748b;text-transform:uppercase">Qty</th>
                <th style="padding:10px;text-align:right;font-size:13px;color:#64748b;text-transform:uppercase">Price</th>
                <th style="padding:10px;text-align:right;font-size:13px;color:#64748b;text-transform:uppercase">Total</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px">
            <tr>
              <td style="padding:6px;font-size:14px;color:#475569">Subtotal</td>
              <td style="padding:6px;font-size:14px;color:#475569;text-align:right">$${(order.subtotal ?? 0).toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding:6px;font-size:14px;color:#475569">Tax</td>
              <td style="padding:6px;font-size:14px;color:#475569;text-align:right">$${(order.tax ?? 0).toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding:6px;font-size:14px;color:#475569">Shipping</td>
              <td style="padding:6px;font-size:14px;color:#475569;text-align:right">$${(order.shipping_cost ?? 0).toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding:8px 6px;font-size:16px;font-weight:bold;color:#1e293b;border-top:2px solid #1e293b">Total</td>
              <td style="padding:8px 6px;font-size:16px;font-weight:bold;color:#1e293b;border-top:2px solid #1e293b;text-align:right">$${(order.total ?? 0).toFixed(2)}</td>
            </tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;padding:12px;background-color:#f8fafc;border-radius:6px">
            <tr>
              <td style="font-size:13px;color:#64748b"><strong>Payment:</strong> ${paymentInfo}</td>
            </tr>
            ${order.notes ? `<tr><td style="font-size:13px;color:#64748b;padding-top:8px"><strong>Notes:</strong> ${order.notes}</td></tr>` : ""}
          </table>
        </td></tr>
        <tr>
          <td style="background-color:#f8fafc;padding:16px 24px;text-align:center;font-size:12px;color:#94a3b8">
            Thank you for your business!<br>Tire&Wheel Mart &mdash; ${new Date().getFullYear()}
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const emailService = createEmailService(db);
    await emailService.sendEmail({
      to: customerEmail,
      subject: `Receipt for Order #${order.order_number}`,
      html,
      eventType: "pos.receipt_email",
      relatedEntityType: "order",
      relatedEntityId: order.id,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
