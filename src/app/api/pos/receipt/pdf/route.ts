import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import { createPOSService } from "@/lib/services/pos-service";

function formatCurrency(amount: number): string {
  return `$${Math.abs(amount).toFixed(2)}`;
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatTime(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function buildReceiptHtml(receipt: {
  order_number: string;
  created_at: string;
  customer?: { name: string; email?: string };
  items: { name: string; quantity: number; unit_price: number; total: number }[];
  payments: { method: string; amount: number }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}) {
  const itemsRows = receipt.items
    .map(
      (item) => `
        <tr>
          <td>${item.name}</td>
          <td class="right">${item.quantity}</td>
          <td class="right">${formatCurrency(item.unit_price)}</td>
          <td class="right">${formatCurrency(item.total)}</td>
        </tr>`
    )
    .join("");

  const paymentsRows = receipt.payments
    .map(
      (p) => `
        <tr>
          <td>${p.method.replace(/_/g, " ")}</td>
          <td class="right">${formatCurrency(p.amount)}</td>
        </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receipt - ${receipt.order_number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
      font-size: 11pt;
      color: #1a1a1a;
      line-height: 1.5;
      padding: 40px 48px;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
    .receipt { max-width: 210mm; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb; }
    .header h1 { font-size: 22pt; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 4px; }
    .header .store-detail { font-size: 9pt; color: #6b7280; }
    .header .store-detail > div { margin-top: 1px; }
    .header .receipt-title { font-size: 10pt; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 8px; }
    .meta { margin-bottom: 20px; font-size: 9pt; color: #374151; }
    .meta table { width: 100%; }
    .meta td { padding: 2px 8px 2px 0; vertical-align: top; }
    .meta td:last-child { text-align: right; }
    .customer { margin-bottom: 20px; padding: 12px 16px; background: #f9fafb; border-radius: 6px; font-size: 9pt; }
    .customer strong { font-weight: 600; }
    table.items { width: 100%; border-collapse: collapse; margin-bottom: 4px; font-size: 10pt; }
    table.items thead { border-bottom: 2px solid #e5e7eb; }
    table.items th { text-align: left; padding: 8px 4px; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; font-weight: 600; }
    table.items td { padding: 6px 4px; border-bottom: 1px solid #f3f4f6; }
    table.items .right { text-align: right; }
    .totals { margin-top: 8px; margin-left: auto; width: 280px; font-size: 10pt; }
    .totals table { width: 100%; }
    .totals td { padding: 3px 4px; }
    .totals .right { text-align: right; }
    .totals .label { color: #6b7280; }
    .totals .divider td { border-top: 1px solid #d1d5db; padding: 0; height: 8px; }
    .totals .grand-total td { font-weight: 700; font-size: 12pt; padding-top: 4px; }
    .payments { margin-top: 20px; font-size: 9pt; }
    .payments h3 { font-size: 9pt; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 4px; }
    .payments table { width: 200px; }
    .payments td { padding: 2px 4px; }
    .payments .right { text-align: right; }
    .signature { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 9pt; color: #6b7280; }
    .signature .sig-line { display: inline-block; width: 200px; border-bottom: 1px solid #9ca3af; margin-top: 28px; }
    .signature .sig-label { font-size: 8pt; color: #9ca3af; margin-top: 2px; }
    .footer { margin-top: 24px; text-align: center; font-size: 8pt; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>Tire &amp; Wheel Mart</h1>
      <div class="store-detail">
        <div>1234 Auto Lane, Suite 100</div>
        <div>Phoenix, AZ 85001</div>
        <div>(602) 555-0123 &nbsp;|&nbsp; Tax ID: TX-47-1234567</div>
      </div>
      <div class="receipt-title">INVOICE / RECEIPT</div>
    </div>

    <div class="meta">
      <table>
        <tr>
          <td><strong>Order #:</strong> ${receipt.order_number}</td>
          <td><strong>Date:</strong> ${formatDate(receipt.created_at)} ${formatTime(receipt.created_at)}</td>
        </tr>
      </table>
    </div>

    ${receipt.customer ? `
    <div class="customer">
      <strong>Customer:</strong> ${receipt.customer.name}${receipt.customer.email ? ` &lt;${receipt.customer.email}&gt;` : ""}
    </div>` : ""}

    <table class="items">
      <thead>
        <tr>
          <th>Item</th>
          <th class="right">Qty</th>
          <th class="right">Unit Price</th>
          <th class="right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <div class="totals">
      <table>
        <tr>
          <td class="label">Subtotal</td>
          <td class="right">${formatCurrency(receipt.subtotal)}</td>
        </tr>
        ${receipt.discount > 0 ? `
        <tr>
          <td class="label">Discount</td>
          <td class="right" style="color:#dc2626;">-${formatCurrency(receipt.discount)}</td>
        </tr>` : ""}
        <tr>
          <td class="label">Tax</td>
          <td class="right">${formatCurrency(receipt.tax)}</td>
        </tr>
        <tr class="divider"><td colspan="2"></td></tr>
        <tr class="grand-total">
          <td>Total</td>
          <td class="right">${formatCurrency(receipt.total)}</td>
        </tr>
      </table>
    </div>

    <div class="payments">
      <h3>Payments</h3>
      <table>
        ${paymentsRows}
      </table>
    </div>

    <div class="signature">
      <div>Authorized Signature</div>
      <div class="sig-line"></div>
      <div class="sig-label">Signature</div>
    </div>

    <div class="footer">
      <p>Thank you for your business!</p>
      <p style="margin-top:2px;">Tire &amp; Wheel Mart &mdash; ${receipt.order_number}</p>
    </div>
  </div>
</body>
</html>`;
}

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ error: "orderId query parameter is required" }, { status: 400 });
    }

    const supabase = createServerClient();
    const pos = createPOSService(supabase);
    const receipt = await pos.getReceipt(orderId);

    if (!receipt) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
    }

    const html = buildReceiptHtml(receipt);

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
