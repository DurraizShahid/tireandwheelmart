export interface POSProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_price?: number;
  image_url: string;
  category_id: string;
  category_name: string;
  category_slug: string;
  brand?: string;
  stock_quantity: number;
  in_stock: boolean;
  sku?: string;
  tags: string[];
}

export interface POSCartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  brand?: string;
  maxQuantity: number;
}

export interface POSCustomer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  full_name?: string;
  vehicles?: POSVehicle[];
}

export interface POSVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  tire_size?: string;
}

export type POSPaymentMethod = "cash" | "credit_card" | "debit_card" | "bank_transfer";

export interface POSPayment {
  method: POSPaymentMethod;
  amount: number;
  card_last_four?: string;
  cardholder_name?: string;
}

export interface POSCheckoutRequest {
  customer_id?: string;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  items: { product_id: string; quantity: number; price: number }[];
  payments: POSPayment[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
}

export interface POSCheckoutResponse {
  order_id: string;
  order_number: string;
  status: string;
  created_at: string;
  customer?: POSCustomer;
  items: { name: string; quantity: number; price: number }[];
  payments: POSPayment[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}

export interface POSReceipt {
  order_number: string;
  created_at: string;
  cashier?: string;
  customer?: { name: string; email: string };
  items: { name: string; quantity: number; unit_price: number; total: number }[];
  payments: { method: string; amount: number }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}

export interface POSAnalytics {
  todaySales: number;
  todayRevenue: number;
  todayOrders: number;
  averageOrderValue: number;
  paymentMethodBreakdown: { method: string; count: number; total: number }[];
  recentTransactions: { id: string; order_number: string; total: number; payment_method: string; created_at: string; customer_name: string }[];
  bestSellingProducts: { product_id: string; product_name: string; total_qty: number; total_revenue: number }[];
  salesByHour: { hour: number; sales: number; revenue: number }[];
}

export type POSCategory = {
  id: string;
  name: string;
  slug: string;
  product_count: number;
};
