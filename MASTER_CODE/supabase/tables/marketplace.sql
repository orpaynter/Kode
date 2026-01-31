-- Enable RLS
ALTER TABLE IF EXISTS supplier_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS supplier_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS marketplace_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS marketplace_order_items ENABLE ROW LEVEL SECURITY;

-- Create Tables
CREATE TABLE IF NOT EXISTS supplier_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  sku TEXT,
  category TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS supplier_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES supplier_products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketplace_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contractor_id UUID REFERENCES auth.users(id),
  supplier_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending',
  total_amount DECIMAL(10,2) DEFAULT 0,
  shipping_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketplace_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES marketplace_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES supplier_products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL
);

-- RLS Policies

-- Products: Everyone can view active products. Suppliers can edit their own.
CREATE POLICY "Public products are viewable by everyone" ON supplier_products
  FOR SELECT USING (true);

CREATE POLICY "Suppliers can insert their own products" ON supplier_products
  FOR INSERT WITH CHECK (auth.uid() = supplier_id);

CREATE POLICY "Suppliers can update their own products" ON supplier_products
  FOR UPDATE USING (auth.uid() = supplier_id);

-- Inventory: Suppliers view/edit their own.
CREATE POLICY "Suppliers can view their own inventory" ON supplier_inventory
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM supplier_products WHERE id = supplier_inventory.product_id AND supplier_id = auth.uid())
  );

CREATE POLICY "Suppliers can update their own inventory" ON supplier_inventory
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM supplier_products WHERE id = supplier_inventory.product_id AND supplier_id = auth.uid())
  );

-- Orders: Contractors view their own purchases. Suppliers view their own sales.
CREATE POLICY "Users can view their own orders" ON marketplace_orders
  FOR SELECT USING (
    auth.uid() = contractor_id OR auth.uid() = supplier_id
  );

CREATE POLICY "Contractors can create orders" ON marketplace_orders
  FOR INSERT WITH CHECK (auth.uid() = contractor_id);

CREATE POLICY "Suppliers can update order status" ON marketplace_orders
  FOR UPDATE USING (auth.uid() = supplier_id);

-- Order Items: Viewable if the parent order is viewable.
CREATE POLICY "Users can view their own order items" ON marketplace_order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM marketplace_orders WHERE id = marketplace_order_items.order_id AND (contractor_id = auth.uid() OR supplier_id = auth.uid()))
  );
