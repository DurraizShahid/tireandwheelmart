-- Inventory Management System
-- Extends products with automatic stock tracking, balancing, alerts

-- 1. Inventory Transactions (audit log for all stock movements)
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  previous_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN (
    'sale', 'return', 'reservation', 'release', 'manual_adjustment',
    'import', 'restock', 'cancel', 'refund', 'transfer_out', 'transfer_in'
  )),
  user_id TEXT,
  source_module TEXT NOT NULL DEFAULT 'manual',
  source_reference_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_inv_tx_product ON inventory_transactions(product_id);
CREATE INDEX idx_inv_tx_type ON inventory_transactions(transaction_type);
CREATE INDEX idx_inv_tx_created ON inventory_transactions(created_at DESC);
CREATE INDEX idx_inv_tx_source ON inventory_transactions(source_module, source_reference_id);

-- 2. Inventory Alerts
CREATE TABLE IF NOT EXISTS inventory_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN (
    'low_stock', 'out_of_stock', 'overstock', 'reorder_reminder'
  )),
  message TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'warning' CHECK (severity IN ('info', 'warning', 'critical')),
  dismissed BOOLEAN NOT NULL DEFAULT false,
  dismissed_at TIMESTAMPTZ,
  dismissed_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_inv_alerts_product ON inventory_alerts(product_id);
CREATE INDEX idx_inv_alerts_type ON inventory_alerts(alert_type);
CREATE INDEX idx_inv_alerts_dismissed ON inventory_alerts(dismissed, created_at DESC);

-- 3. Reorder Points (configurable per product)
CREATE TABLE IF NOT EXISTS inventory_reorder_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE UNIQUE,
  reorder_level INTEGER NOT NULL DEFAULT 10,
  low_stock_threshold INTEGER NOT NULL DEFAULT 10,
  overstock_threshold INTEGER NOT NULL DEFAULT 100,
  preferred_quantity INTEGER NOT NULL DEFAULT 20,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_inv_reorder_product ON inventory_reorder_points(product_id);

-- 4. Future: Warehouse locations (scaffold for future multi-warehouse)
CREATE TABLE IF NOT EXISTS warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Default warehouse for existing single-location setup
INSERT INTO warehouses (id, name, code, is_active)
VALUES ('00000000-0000-0000-0000-000000000001', 'Main Warehouse', 'MAIN', true)
ON CONFLICT (code) DO NOTHING;

-- 5. Product-Warehouse stock (for future multi-warehouse)
CREATE TABLE IF NOT EXISTS product_warehouse_stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  reserved_quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_id, warehouse_id)
);
CREATE INDEX idx_pws_product ON product_warehouse_stock(product_id);
CREATE INDEX idx_pws_warehouse ON product_warehouse_stock(warehouse_id);

-- Seed default warehouse stock for all existing products
INSERT INTO product_warehouse_stock (product_id, warehouse_id, quantity, reserved_quantity)
SELECT p.id, '00000000-0000-0000-0000-000000000001', p.stock_quantity, 0
FROM products p
WHERE NOT EXISTS (
  SELECT 1 FROM product_warehouse_stock pws WHERE pws.product_id = p.id
);

-- 6. RLS Policies
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_reorder_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_warehouse_stock ENABLE ROW LEVEL SECURITY;

-- Service role full access (admin)
CREATE POLICY "Service role full access inventory_transactions"
  ON inventory_transactions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access inventory_alerts"
  ON inventory_alerts FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access inventory_reorder_points"
  ON inventory_reorder_points FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access warehouses"
  ON warehouses FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access product_warehouse_stock"
  ON product_warehouse_stock FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Authenticated admin read access
CREATE POLICY "Authenticated read inventory_transactions"
  ON inventory_transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read inventory_alerts"
  ON inventory_alerts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read inventory_reorder_points"
  ON inventory_reorder_points FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read warehouses"
  ON warehouses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read product_warehouse_stock"
  ON product_warehouse_stock FOR SELECT TO authenticated USING (true);

-- 7. Function: Get inventory status for a product
CREATE OR REPLACE FUNCTION get_inventory_status(p_product_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_stock INTEGER;
  v_low_stock INTEGER;
  v_overstock INTEGER;
  v_status TEXT;
BEGIN
  SELECT p.stock_quantity INTO v_stock
  FROM products p WHERE p.id = p_product_id;
  IF NOT FOUND THEN RETURN 'unknown'; END IF;

  SELECT COALESCE(irp.low_stock_threshold, 10), COALESCE(irp.overstock_threshold, 100)
  INTO v_low_stock, v_overstock
  FROM inventory_reorder_points irp WHERE irp.product_id = p_product_id;

  IF v_stock <= 0 THEN v_status := 'out_of_stock';
  ELSIF v_stock <= v_low_stock THEN v_status := 'low_stock';
  ELSIF v_stock >= v_overstock THEN v_status := 'overstock';
  ELSE v_status := 'in_stock';
  END IF;
  RETURN v_status;
END;
$$;

-- 8. Function: Transactional stock adjustment with audit log
CREATE OR REPLACE FUNCTION adjust_stock(
  p_product_id UUID,
  p_quantity INTEGER,
  p_transaction_type TEXT,
  p_user_id TEXT DEFAULT NULL,
  p_source_module TEXT DEFAULT 'manual',
  p_source_reference_id TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_old_qty INTEGER;
  v_new_qty INTEGER;
  v_transaction_id UUID;
  v_in_stock BOOLEAN;
BEGIN
  -- Lock product row to prevent race conditions
  SELECT stock_quantity INTO v_old_qty
  FROM products WHERE id = p_product_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Product not found');
  END IF;

  v_new_qty := v_old_qty + p_quantity;

  -- Prevent negative inventory
  IF v_new_qty < 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Insufficient stock',
      'available', v_old_qty,
      'requested', ABS(p_quantity)
    );
  END IF;

  -- Update product stock
  v_in_stock := v_new_qty > 0;
  UPDATE products
  SET stock_quantity = v_new_qty,
      in_stock = v_in_stock,
      updated_at = now()
  WHERE id = p_product_id;

  -- Update warehouse stock (default warehouse)
  UPDATE product_warehouse_stock
  SET quantity = v_new_qty,
      updated_at = now()
  WHERE product_id = p_product_id
    AND warehouse_id = '00000000-0000-0000-0000-000000000001';

  -- Create audit transaction
  INSERT INTO inventory_transactions (
    product_id, quantity, previous_quantity, new_quantity,
    transaction_type, user_id, source_module, source_reference_id, notes
  ) VALUES (
    p_product_id, p_quantity, v_old_qty, v_new_qty,
    p_transaction_type, p_user_id, p_source_module, p_source_reference_id, p_notes
  ) RETURNING id INTO v_transaction_id;

  -- Auto-generate inventory alerts based on new stock level
  PERFORM check_and_create_inventory_alert(p_product_id, v_new_qty);

  RETURN jsonb_build_object(
    'success', true,
    'previous_quantity', v_old_qty,
    'new_quantity', v_new_qty,
    'transaction_id', v_transaction_id
  );
END;
$$;

-- 9. Function: Check and create inventory alerts
CREATE OR REPLACE FUNCTION check_and_create_inventory_alert(
  p_product_id UUID,
  p_stock_quantity INTEGER DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_stock INTEGER;
  v_low_stock INTEGER;
  v_overstock INTEGER;
  v_product_name TEXT;
  v_existing_id UUID;
BEGIN
  SELECT COALESCE(p_stock_quantity, stock_quantity) INTO v_stock
  FROM products WHERE id = p_product_id;
  IF NOT FOUND THEN RETURN; END IF;

  SELECT name INTO v_product_name FROM products WHERE id = p_product_id;

  SELECT COALESCE(irp.low_stock_threshold, 10), COALESCE(irp.overstock_threshold, 100)
  INTO v_low_stock, v_overstock
  FROM inventory_reorder_points irp WHERE irp.product_id = p_product_id;

  -- Dismiss old alerts for this product
  UPDATE inventory_alerts SET dismissed = true, dismissed_at = now()
  WHERE product_id = p_product_id AND dismissed = false;

  -- Out of stock alert (critical)
  IF v_stock <= 0 THEN
    INSERT INTO inventory_alerts (product_id, alert_type, message, severity)
    VALUES (p_product_id, 'out_of_stock',
      v_product_name || ' is out of stock',
      'critical');

  -- Low stock alert (warning)
  ELSIF v_stock <= v_low_stock THEN
    INSERT INTO inventory_alerts (product_id, alert_type, message, severity)
    VALUES (p_product_id, 'low_stock',
      v_product_name || ' is low on stock (' || v_stock || ' remaining, threshold: ' || v_low_stock || ')',
      'warning');

  -- Overstock alert (info)
  ELSIF v_stock >= v_overstock THEN
    INSERT INTO inventory_alerts (product_id, alert_type, message, severity)
    VALUES (p_product_id, 'overstock',
      v_product_name || ' is overstocked (' || v_stock || ' units, threshold: ' || v_overstock || ')',
      'info');
  END IF;
END;
$$;

-- 10. Trigger: Auto-create inventory alert on product stock change
CREATE OR REPLACE FUNCTION trg_product_stock_alert()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.stock_quantity IS DISTINCT FROM OLD.stock_quantity THEN
    PERFORM check_and_create_inventory_alert(NEW.id, NEW.stock_quantity);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_product_stock_alert ON products;
CREATE TRIGGER trg_product_stock_alert
  AFTER UPDATE OF stock_quantity ON products
  FOR EACH ROW
  EXECUTE FUNCTION trg_product_stock_alert();
