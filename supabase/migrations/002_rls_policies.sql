ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_read_own" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth.uid() = id);

ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "farms_public_read_verified" ON farms FOR SELECT USING (is_verified = true AND is_active = true);
CREATE POLICY "farms_owner_all" ON farms FOR ALL USING (auth.uid() = owner_id);

ALTER TABLE seal_stages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "seal_stages_order_parties" ON seal_stages FOR SELECT USING (
  order_id IN (
    SELECT id FROM orders WHERE buyer_id = auth.uid()
    OR farm_id IN (SELECT id FROM farms WHERE owner_id = auth.uid())
  )
);
CREATE POLICY "seal_stages_farm_owner_write" ON seal_stages FOR INSERT WITH CHECK (
  order_id IN (SELECT id FROM orders WHERE farm_id IN (SELECT id FROM farms WHERE owner_id = auth.uid()))
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_buyer_write" ON reviews FOR INSERT WITH CHECK (auth.uid() = buyer_id);

ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "disputes_parties_read" ON disputes FOR SELECT USING (
  auth.uid() = raised_by
  OR order_id IN (SELECT id FROM orders WHERE buyer_id = auth.uid() OR farm_id IN (SELECT id FROM farms WHERE owner_id = auth.uid()))
);
CREATE POLICY "disputes_buyer_create" ON disputes FOR INSERT WITH CHECK (auth.uid() = raised_by);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payments_order_parties_read" ON payments FOR SELECT USING (
  order_id IN (SELECT id FROM orders WHERE buyer_id = auth.uid() OR farm_id IN (SELECT id FROM farms WHERE owner_id = auth.uid()))
);

ALTER TABLE order_routing_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "routing_log_farm_owner_read" ON order_routing_log FOR SELECT USING (
  farm_id IN (SELECT id FROM farms WHERE owner_id = auth.uid())
);
