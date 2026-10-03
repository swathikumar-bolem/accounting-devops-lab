ALTER TABLE customers ADD COLUMN IF NOT EXISTS business_name VARCHAR(200);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS business_type VARCHAR(100);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS pan VARCHAR(20);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS plan VARCHAR(30) NOT NULL DEFAULT 'BASIC';

CREATE TABLE transactions (
  id BIGSERIAL PRIMARY KEY,
  business_id BIGINT NOT NULL REFERENCES businesses(id),
  customer_id BIGINT REFERENCES customers(id),
  type VARCHAR(30) NOT NULL,
  txn_date DATE NOT NULL,
  reference_no VARCHAR(100),
  description VARCHAR(500) NOT NULL,
  amount NUMERIC(14,2) NOT NULL CHECK (amount >= 0),
  status VARCHAR(20) NOT NULL DEFAULT 'POSTED',
  remarks VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_transactions_business_date ON transactions(business_id, txn_date DESC);
CREATE INDEX idx_transactions_customer ON transactions(business_id, customer_id);

CREATE TABLE invoices (
  id BIGSERIAL PRIMARY KEY,
  business_id BIGINT NOT NULL REFERENCES businesses(id),
  customer_id BIGINT NOT NULL REFERENCES customers(id),
  invoice_number VARCHAR(100) NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE,
  subtotal NUMERIC(14,2) NOT NULL DEFAULT 0,
  discount NUMERIC(14,2) NOT NULL DEFAULT 0,
  gst_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  paid_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'UNPAID',
  notes VARCHAR(1000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_invoice_number_per_business UNIQUE (business_id, invoice_number)
);
CREATE INDEX idx_invoices_business_date ON invoices(business_id, invoice_date DESC);
CREATE INDEX idx_invoices_customer ON invoices(business_id, customer_id);

CREATE TABLE invoice_items (
  id BIGSERIAL PRIMARY KEY,
  invoice_id BIGINT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description VARCHAR(300) NOT NULL,
  quantity NUMERIC(12,2) NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(14,2) NOT NULL CHECK (unit_price >= 0),
  gst_rate NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (gst_rate >= 0),
  line_total NUMERIC(14,2) NOT NULL DEFAULT 0
);
CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);
