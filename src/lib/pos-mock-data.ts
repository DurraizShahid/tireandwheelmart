import type { POSAnalytics } from "@/lib/pos-types";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8);

export function getMockPOSAnalytics(): POSAnalytics {
  const hour = new Date().getHours();
  const todayDate = new Date().toISOString().slice(0, 10);

  return {
    todaySales: 47,
    todayRevenue: 12483.50,
    todayOrders: 23,
    averageOrderValue: 542.76,
    paymentMethodBreakdown: [
      { method: "cash", count: 8, total: 3890.00 },
      { method: "credit_card", count: 10, total: 5840.50 },
      { method: "debit_card", count: 4, total: 1953.00 },
      { method: "bank_transfer", count: 1, total: 800.00 },
    ],
    recentTransactions: [
      { id: "1", order_number: "POS-001", total: 1240.00, payment_method: "credit_card", created_at: `${todayDate}T${String(hour - 1).padStart(2, "0")}:15:00Z`, customer_name: "John Smith" },
      { id: "2", order_number: "POS-002", total: 850.50, payment_method: "cash", created_at: `${todayDate}T${String(hour - 1).padStart(2, "0")}:30:00Z`, customer_name: "Walk-in Customer" },
      { id: "3", order_number: "POS-003", total: 2100.00, payment_method: "credit_card", created_at: `${todayDate}T${String(hour - 2).padStart(2, "0")}:00:00Z`, customer_name: "Sarah Johnson" },
      { id: "4", order_number: "POS-004", total: 450.00, payment_method: "debit_card", created_at: `${todayDate}T${String(hour - 2).padStart(2, "0")}:45:00Z`, customer_name: "Mike Davis" },
      { id: "5", order_number: "POS-005", total: 320.00, payment_method: "cash", created_at: `${todayDate}T${String(hour - 3).padStart(2, "0")}:10:00Z`, customer_name: "Walk-in Customer" },
      { id: "6", order_number: "POS-006", total: 1670.00, payment_method: "credit_card", created_at: `${todayDate}T${String(hour - 3).padStart(2, "0")}:55:00Z`, customer_name: "Emily Wilson" },
      { id: "7", order_number: "POS-007", total: 780.00, payment_method: "bank_transfer", created_at: `${todayDate}T${String(hour - 4).padStart(2, "0")}:20:00Z`, customer_name: "Robert Brown" },
      { id: "8", order_number: "POS-008", total: 920.00, payment_method: "cash", created_at: `${todayDate}T${String(hour - 4).padStart(2, "0")}:40:00Z`, customer_name: "Lisa Anderson" },
      { id: "9", order_number: "POS-009", total: 2153.00, payment_method: "debit_card", created_at: `${todayDate}T${String(hour - 5).padStart(2, "0")}:05:00Z`, customer_name: "James Taylor" },
      { id: "10", order_number: "POS-010", total: 500.00, payment_method: "credit_card", created_at: `${todayDate}T${String(hour - 5).padStart(2, "0")}:35:00Z`, customer_name: "Walk-in Customer" },
    ],
    bestSellingProducts: [
      { product_id: "p1", product_name: "Pirelli P Zero All-Season 245/45R18", total_qty: 12, total_revenue: 4320.00 },
      { product_id: "p2", product_name: "Michelin Defender 2 225/65R17", total_qty: 8, total_revenue: 2560.00 },
      { product_id: "p3", product_name: "Fuel D572 Rebel 6 18x9", total_qty: 6, total_revenue: 2940.00 },
      { product_id: "p4", product_name: "Bridgestone Blizzak WS90 205/55R16", total_qty: 5, total_revenue: 1475.00 },
      { product_id: "p5", product_name: "Method Race Wheels MR701 17x8.5", total_qty: 4, total_revenue: 1960.00 },
    ],
    salesByHour: HOURS.map((h) => ({
      hour: h,
      sales: Math.floor(Math.random() * 8) + 1,
      revenue: Math.floor(Math.random() * 1500) + 300,
    })),
  };
}

export function generateMockOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `POS-${ts}-${rand}`;
}
