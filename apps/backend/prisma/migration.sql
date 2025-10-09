-- Moisture range 0..100
ALTER TABLE production_output
  ADD CONSTRAINT chk_output_moisture
  CHECK (moisture_pct IS NULL OR (moisture_pct >= 0 AND moisture_pct <= 100));

ALTER TABLE waste
  ADD CONSTRAINT chk_waste_moisture
  CHECK (moisture_pct IS NULL OR (moisture_pct >= 0 AND moisture_pct <= 100));

-- StageExecution: finished_at >= started_at (if both present)
ALTER TABLE stage_execution
  ADD CONSTRAINT chk_stage_time
  CHECK (finished_at IS NULL OR started_at IS NULL OR finished_at >= started_at);

-- StockMove: exactly one of output_id or waste_id (XOR)
ALTER TABLE stock_move
  ADD CONSTRAINT chk_stockmove_xor
  CHECK (
    (output_id IS NOT NULL AND waste_id IS NULL)
    OR
    (output_id IS NULL AND waste_id IS NOT NULL)
  );

-- ProductionOutput: either order_id or owner_customer_id must be set (pre-order stock)
ALTER TABLE production_output
  ADD CONSTRAINT chk_output_order_or_owner
  CHECK (
    (order_id IS NOT NULL AND owner_customer_id IS NULL)
    OR
    (order_id IS NULL AND owner_customer_id IS NOT NULL)
  );
