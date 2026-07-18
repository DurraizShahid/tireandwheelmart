// Future Inventory Architecture Interfaces
// These interfaces define the contract for upcoming modules (POS, Mobile, Barcode, etc.)
// Do NOT implement the features — only provide the architecture for plug-and-play.

// ── POS Interface ──
export interface POSInventoryAdapter {
  getStockAtRegister(productId: string, registerId: string): Promise<number>;
  holdStockForPOS(productId: string, registerId: string, quantity: number, timeoutMs: number): Promise<string>;
  releaseHeldStock(holdId: string): Promise<void>;
  completePOSTransaction(items: { product_id: string; quantity: number; price: number }[], userId: string): Promise<{ success: boolean; transaction_id: string }>;
}

// ── Mobile Inventory App ──
export interface MobileInventoryAdapter {
  scanBarcode(barcode: string): Promise<{ productId: string; name: string; stock: number }>;
  getLowStockAlerts(warehouseId?: string): Promise<LowStockAlert[]>;
  performAdjustment(params: MobileAdjustmentParams): Promise<{ success: boolean; newStock: number }>;
  getWarehouseTransferOptions(): Promise<{ warehouses: WarehouseOption[]; inTransit: InTransitShipment[] }>;
}

export interface LowStockAlert {
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  warehouseId: string;
  warehouseName: string;
}

export interface MobileAdjustmentParams {
  productId: string;
  warehouseId: string;
  quantity: number;
  reason: string;
  userId: string;
}

export interface WarehouseOption {
  id: string;
  code: string;
  name: string;
  distance?: number;
}

export interface InTransitShipment {
  id: string;
  fromWarehouse: string;
  toWarehouse: string;
  productId: string;
  quantity: number;
  status: "in_transit" | "received" | "partial";
  eta?: string;
}

// ── Barcode / QR Interface ──
export interface BarcodeAdapter {
  generateBarcode(productId: string, sku: string): Promise<string>;
  decodeBarcode(imageData: string): Promise<{ productId: string; sku: string }>;
  generateQRCode(productId: string, warehouseId: string, data?: Record<string, unknown>): Promise<string>;
}

// ── Warehouse Transfer Interface ──
export interface WarehouseTransferAdapter {
  initiateTransfer(params: TransferParams): Promise<string>;
  receiveTransfer(transferId: string, receivedBy: string): Promise<TransferReceipt>;
  getTransferStatus(transferId: string): Promise<TransferStatus>;
  listTransfers(warehouseId: string): Promise<TransferSummary[]>;
}

export interface TransferParams {
  fromWarehouseId: string;
  toWarehouseId: string;
  productId: string;
  quantity: number;
  initiatedBy: string;
  notes?: string;
}

export interface TransferReceipt {
  transferId: string;
  receivedAt: string;
  discrepancies: { expected: number; received: number; productId: string }[];
}

export type TransferStatus = "pending" | "in_transit" | "received" | "partial" | "cancelled";
export interface TransferSummary {
  id: string;
  from: string;
  to: string;
  productName: string;
  quantity: number;
  status: TransferStatus;
  createdAt: string;
}

// ── Purchase Order Interface ──
export interface PurchaseOrderAdapter {
  createPO(params: PurchaseOrderParams): Promise<string>;
  receivePO(poId: string, receivedBy: string): Promise<POReceipt>;
  getPO(poId: string): Promise<PurchaseOrder>;
  listPOs(supplierId?: string): Promise<PurchaseOrderSummary[]>;
}

export interface PurchaseOrderParams {
  supplierId: string;
  items: { productId: string; quantity: number; unitCost: number }[];
  warehouseId: string;
  expectedDelivery?: string;
  notes?: string;
  createdBy: string;
}

export interface POReceipt {
  poId: string;
  receivedAt: string;
  items: { productId: string; ordered: number; received: number; accepted: number }[];
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  items: { productId: string; productName: string; quantity: number; unitCost: number }[];
  warehouseId: string;
  status: "draft" | "sent" | "partial" | "received" | "cancelled";
  totalCost: number;
  expectedDelivery?: string;
  createdAt: string;
}

export interface PurchaseOrderSummary {
  id: string;
  supplierName: string;
  itemCount: number;
  totalCost: number;
  status: string;
  createdAt: string;
}

// ── Stock Audit Interface ──
export interface StockAuditAdapter {
  startAudit(warehouseId: string, initiatedBy: string): Promise<string>;
  recordCount(auditId: string, productId: string, countedQuantity: number, notes?: string): Promise<void>;
  completeAudit(auditId: string): Promise<AuditReport>;
  getAuditHistory(warehouseId: string, limit?: number): Promise<AuditSummary[]>;
}

export interface AuditReport {
  auditId: string;
  totalProducts: number;
  countedProducts: number;
  discrepancies: { productId: string; productName: string; systemQty: number; countedQty: number; diff: number }[];
  resolvedCount: number;
  status: "in_progress" | "completed" | "resolved";
}

export interface AuditSummary {
  id: string;
  warehouseName: string;
  status: string;
  productCount: number;
  discrepancyCount: number;
  initiatedBy: string;
  createdAt: string;
}

// ── Multiple Warehouse Interface ──
export interface MultiWarehouseAdapter {
  getStockAcrossWarehouses(productId: string): Promise<{ warehouseId: string; warehouseName: string; quantity: number }[]>;
  getPrimaryWarehouse(productId: string): Promise<string>;
  setPrimaryWarehouse(productId: string, warehouseId: string): Promise<void>;
  consolidateStock(productId: string): Promise<{ warehouseId: string; transferId: string }[]>;
}
