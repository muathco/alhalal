-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'buyer' CHECK (role IN ('buyer','seller','admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Farms (الحضائر)
CREATE TABLE farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  region VARCHAR(50),
  location_text VARCHAR(200),
  bio TEXT,
  feed_type VARCHAR(50) CHECK (feed_type IN ('natural','certified','mixed')),
  vet_cert_url TEXT,
  id_doc_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  avg_rating NUMERIC(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Animals (المواشي)
CREATE TABLE animals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID REFERENCES farms(id),
  type VARCHAR(20) CHECK (type IN ('sheep','camel','cow','goat')),
  breed VARCHAR(100),
  live_weight_kg NUMERIC(6,1),
  net_weight_estimate_kg NUMERIC(6,1),
  price_sar NUMERIC(10,2) NOT NULL,
  slaughter_options JSONB DEFAULT '["live","slaughtered","cut"]',
  feed_type VARCHAR(50),
  images TEXT[],
  is_available BOOLEAN DEFAULT true,
  is_reserved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders (الطلبات)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) UNIQUE,
  buyer_id UUID REFERENCES users(id),
  animal_id UUID REFERENCES animals(id),
  farm_id UUID REFERENCES farms(id),
  delivery_type VARCHAR(20) CHECK (delivery_type IN ('live','slaughtered','cut')),
  slaughter_type VARCHAR(20) CHECK (slaughter_type IN ('full','half')),
  delivery_address TEXT,
  delivery_date DATE,
  delivery_time_slot VARCHAR(30),
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN (
    'pending','accepted','rejected','in_progress',
    'seal_1','seal_2','seal_3','seal_4',
    'delivered','completed','cancelled','disputed'
  )),
  subtotal_sar NUMERIC(10,2),
  service_fee_sar NUMERIC(10,2),
  total_sar NUMERIC(10,2),
  payment_status VARCHAR(20) DEFAULT 'unpaid',
  moyasar_payment_id TEXT,
  routing_attempts INTEGER DEFAULT 1,
  acceptance_deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seal Stages (مراحل الختم)
CREATE TABLE seal_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  stage INTEGER CHECK (stage IN (1,2,3,4)),
  image_url TEXT,
  message TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews (التقييمات)
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) UNIQUE,
  buyer_id UUID REFERENCES users(id),
  farm_id UUID REFERENCES farms(id),
  weight_score INTEGER CHECK (weight_score BETWEEN 1 AND 5),
  quality_score INTEGER CHECK (quality_score BETWEEN 1 AND 5),
  cleanliness_score INTEGER CHECK (cleanliness_score BETWEEN 1 AND 5),
  delivery_score INTEGER CHECK (delivery_score BETWEEN 1 AND 5),
  avg_score NUMERIC(3,2),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disputes (النزاعات)
CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  raised_by UUID REFERENCES users(id),
  reason TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open','resolved','escalated')),
  resolution TEXT,
  refund_amount NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Payments (المدفوعات)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  amount_sar NUMERIC(10,2),
  gateway VARCHAR(20) DEFAULT 'moyasar',
  gateway_ref TEXT,
  status VARCHAR(20) CHECK (status IN ('paid','refunded','partial_refund','failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Routing Log (سجل التوجيه)
CREATE TABLE order_routing_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  farm_id UUID REFERENCES farms(id),
  attempt_number INTEGER,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  response VARCHAR(20) CHECK (response IN ('accepted','rejected','timeout','pending'))
);

-- Indexes
CREATE INDEX idx_animals_type ON animals(type);
CREATE INDEX idx_animals_farm ON animals(farm_id);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_farm ON orders(farm_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_reviews_farm ON reviews(farm_id);

-- Auto-update farm avg_rating after review
CREATE OR REPLACE FUNCTION update_farm_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE farms SET
    avg_rating = (
      SELECT AVG(avg_score) FROM reviews WHERE farm_id = NEW.farm_id
    ),
    total_reviews = (
      SELECT COUNT(*) FROM reviews WHERE farm_id = NEW.farm_id
    )
  WHERE id = NEW.farm_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_review_insert
AFTER INSERT ON reviews
FOR EACH ROW EXECUTE FUNCTION update_farm_rating();

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'HL-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('order_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE order_seq START 1;
CREATE TRIGGER before_order_insert
BEFORE INSERT ON orders
FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "buyers_own_orders" ON orders
  FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "sellers_farm_orders" ON orders
  FOR SELECT USING (
    farm_id IN (SELECT id FROM farms WHERE owner_id = auth.uid())
  );

ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_available_animals" ON animals
  FOR SELECT USING (is_available = true AND is_reserved = false);
CREATE POLICY "farm_owner_write" ON animals
  FOR ALL USING (
    farm_id IN (SELECT id FROM farms WHERE owner_id = auth.uid())
  );
