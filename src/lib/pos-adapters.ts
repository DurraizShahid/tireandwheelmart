// Future POS Architecture — Adapter Interfaces
// These define contracts for future production integrations.
// No real implementations are provided — only typed abstractions.

import type { POSCheckoutRequest, POSCheckoutResponse, POSReceipt } from "@/lib/pos-types";

// ── Payment Provider Adapters ──

export interface PaymentProviderAdapter {
  name: string;
  processPayment(amount: number, currency: string, metadata?: Record<string, unknown>): Promise<PaymentResult>;
  refundPayment(transactionId: string, amount?: number): Promise<PaymentResult>;
  voidPayment(transactionId: string): Promise<PaymentResult>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  authorizationCode?: string;
  error?: string;
  raw?: Record<string, unknown>;
}

// Future: StripeAdapter implements PaymentProviderAdapter
// Future: SquareAdapter implements PaymentProviderAdapter
// Future: CloverAdapter implements PaymentProviderAdapter

// ── Terminal / Device Adapters ──

export interface TerminalAdapter {
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
  processPayment(amount: number): Promise<PaymentResult>;
  processRefund(transactionId: string, amount: number): Promise<PaymentResult>;
  getStatus(): Promise<"connected" | "disconnected" | "error">;
}

// Future: CloverTerminalAdapter implements TerminalAdapter
// Future: SquareTerminalAdapter implements TerminalAdapter

// ── Receipt Printer Adapter ──

export interface ReceiptPrinterAdapter {
  name: string;
  printReceipt(receipt: POSReceipt, options?: PrintOptions): Promise<PrintResult>;
  printText(text: string): Promise<PrintResult>;
  getStatus(): Promise<"online" | "offline" | "error">;
}

export interface PrintOptions {
  copies?: number;
  paperSize?: "3inch" | "4inch";
  characterSet?: string;
}

export interface PrintResult {
  success: boolean;
  jobId?: string;
  error?: string;
}

// Future: EpsonPrinterAdapter implements ReceiptPrinterAdapter
// Future: StarPrinterAdapter implements ReceiptPrinterAdapter

// ── Cash Drawer Adapter ──

export interface CashDrawerAdapter {
  open(): Promise<boolean>;
  isOpen(): Promise<boolean>;
  getStatus(): Promise<"open" | "closed" | "error">;
}

// Future: CashDrawerAdapterImpl implements CashDrawerAdapter

// ── Barcode Scanner Adapter ──

export interface BarcodeScannerAdapter {
  onScan(callback: (barcode: string) => void): void;
  removeScanListener(): void;
  startScanning(): Promise<void>;
  stopScanning(): Promise<void>;
}

// Future: USBScannerAdapter implements BarcodeScannerAdapter
// Future: BluetoothScannerAdapter implements BarcodeScannerAdapter

// ── QR Code Scanner Adapter ──

export interface QRScannerAdapter {
  scan(): Promise<string | null>;
  startContinuousScan(callback: (qrData: string) => void): void;
  stopContinuousScan(): void;
}

// Future: QRScannerAdapterImpl implements QRScannerAdapter

// ── Offline Mode ──

export interface OfflineSyncAdapter {
  savePendingTransaction(request: POSCheckoutRequest): Promise<string>;
  getPendingTransactions(): Promise<PendingTransaction[]>;
  syncPendingTransaction(pendingId: string): Promise<POSCheckoutResponse>;
  syncAllPending(): Promise<{ synced: number; failed: number }>;
  getNetworkStatus(): Promise<"online" | "offline">;
}

export interface PendingTransaction {
  id: string;
  request: POSCheckoutRequest;
  created_at: string;
  status: "pending" | "syncing" | "synced" | "failed";
}

// Future: IndexedDBOfflineAdapter implements OfflineSyncAdapter

// ── Multi-Store / Multi-Register ──

export interface StoreConfig {
  id: string;
  name: string;
  address?: string;
  timezone: string;
  currency: string;
  taxRate: number;
}

export interface RegisterConfig {
  id: string;
  name: string;
  storeId: string;
  isActive: boolean;
}

export interface MultiStoreAdapter {
  getCurrentStore(): Promise<StoreConfig>;
  getCurrentRegister(): Promise<RegisterConfig>;
  switchStore(storeId: string): Promise<void>;
  switchRegister(registerId: string): Promise<void>;
  listStores(): Promise<StoreConfig[]>;
  listRegisters(storeId: string): Promise<RegisterConfig[]>;
}

// Future: StoreSettingsAdapter implements MultiStoreAdapter

// ── Employee Shift Management ──

export interface EmployeeShift {
  id: string;
  employeeId: string;
  employeeName: string;
  startTime: string;
  endTime?: string;
  status: "active" | "completed" | "break";
  openingCash: number;
  closingCash?: number;
  expectedCash?: number;
  variance?: number;
}

export interface ShiftManagementAdapter {
  startShift(employeeId: string, openingCash: number): Promise<EmployeeShift>;
  endShift(shiftId: string, closingCash: number): Promise<EmployeeShift>;
  getActiveShift(employeeId: string): Promise<EmployeeShift | null>;
  recordBreak(shiftId: string): Promise<void>;
  recordBreakEnd(shiftId: string): Promise<void>;
  getShiftReport(shiftId: string): Promise<EmployeeShift>;
}

// Future: ShiftServiceImpl implements ShiftManagementAdapter

// ── POS Registration / Setup ──

export interface POSAdapterRegistry {
  payment: PaymentProviderAdapter | null;
  terminal: TerminalAdapter | null;
  printer: ReceiptPrinterAdapter | null;
  cashDrawer: CashDrawerAdapter | null;
  barcode: BarcodeScannerAdapter | null;
  qrScanner: QRScannerAdapter | null;
  offline: OfflineSyncAdapter | null;
  multiStore: MultiStoreAdapter | null;
  shiftManagement: ShiftManagementAdapter | null;
}

export function createEmptyAdapterRegistry(): POSAdapterRegistry {
  return {
    payment: null,
    terminal: null,
    printer: null,
    cashDrawer: null,
    barcode: null,
    qrScanner: null,
    offline: null,
    multiStore: null,
    shiftManagement: null,
  };
}
