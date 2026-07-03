-- PR-23: customer return requests (no auto-refund — manual admin step in Phase 2)

CREATE TABLE return_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  refund_amount_cents INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT return_requests_status_check CHECK (
    status IN ('pending', 'approved', 'rejected', 'refunded')
  ),
  CONSTRAINT return_requests_reason_check CHECK (
    reason IN ('damaged', 'wrong_item', 'not_as_described', 'changed_mind', 'other')
  )
);

CREATE INDEX idx_return_requests_user ON return_requests(user_id);
CREATE INDEX idx_return_requests_order ON return_requests(order_id);
CREATE INDEX idx_return_requests_status ON return_requests(status);

CREATE UNIQUE INDEX idx_return_requests_active_per_order
  ON return_requests(order_id)
  WHERE status IN ('pending', 'approved');

ALTER TABLE return_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "return_requests_select_own"
  ON return_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "return_requests_insert_own"
  ON return_requests FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = return_requests.order_id
        AND orders.user_id = auth.uid()
        AND orders.payment_status = 'paid'
    )
  );

COMMENT ON TABLE return_requests IS 'Customer-initiated return/refund requests; fulfillment is manual (no Stripe auto-refund).';