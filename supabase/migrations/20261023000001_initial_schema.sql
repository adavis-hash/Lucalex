-- ==============================================================================
-- Migration: 20261023000001_initial_schema.sql
-- Description: Core Schema for Lucalex / MODULO Modular Construction E-Commerce
-- Tables: profiles, collections, products, carts, cart_items, orders, order_items
-- Security: Row Level Security (RLS) enabled on all tables, Admin RBAC
-- ==============================================================================

-- 1. EXTENSIONS & ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index on profile role for fast RBAC checks
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Helper function to check if the current requester is an administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Trigger: Automatically create public.profile when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    'customer' -- New signups are always customers
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url);
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: Prevent non-admin users from self-promoting or altering their role
CREATE OR REPLACE FUNCTION public.prevent_self_promotion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If role is changing
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Check if executing user is an existing admin or executing with service_role
    IF NOT (public.is_admin() OR auth.jwt()->>'role' = 'service_role') THEN
      RAISE EXCEPTION 'Unauthorized: Users cannot change their own role.';
    END IF;
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_prevent_self_promotion ON public.profiles;
CREATE TRIGGER tr_prevent_self_promotion
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_self_promotion();

-- 3. COLLECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.collections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT,
  image TEXT NOT NULL,
  featured_badge TEXT,
  item_count TEXT,
  accent_color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  set_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  collection_id TEXT REFERENCES public.collections(id) ON DELETE SET NULL,
  collection_name TEXT,
  pieces INTEGER NOT NULL CHECK (pieces > 0),
  age TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  is_new BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  badge TEXT,
  image TEXT NOT NULL,
  tagline TEXT,
  dimensions TEXT,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  difficulty TEXT,
  stock INTEGER NOT NULL DEFAULT 100 CHECK (stock >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_collection ON public.products(collection_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_set_number ON public.products(set_number);

-- 5. CARTS TABLE (One persistent shopping cart per authenticated user)
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_carts_user ON public.carts(user_id);

-- 6. CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_cart_product UNIQUE (cart_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON public.cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product ON public.cart_items(product_id);

-- 7. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
  total_pieces INTEGER NOT NULL DEFAULT 0,
  shipping_address JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);

-- 8. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- ==============================================================================
-- 9. TRANSACTIONAL CHECKOUT FUNCTION (create_order)
-- ==============================================================================
-- Securely creates an order directly within the database:
-- 1. Identifies the authenticated caller via auth.uid()
-- 2. Reads the user's active cart and locks cart items and products
-- 3. Looks up canonical product prices and verifies real-time stock in 'products'
-- 4. Computes total amount and total pieces on the server (client CANNOT tamper with prices)
-- 5. Inserts the order and order items
-- 6. Decrements stock for each purchased product
-- 7. Empties the user's cart ONLY if all previous operations succeed
-- 8. Returns the newly created order UUID
-- Entire process executes in a single ACID transaction; any error rolls back all changes.
CREATE OR REPLACE FUNCTION public.create_order(
  p_shipping_address JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_cart_id UUID;
  v_order_id UUID;
  v_total_amount NUMERIC(10,2) := 0;
  v_total_pieces INTEGER := 0;
  v_item_count INTEGER := 0;
  v_rec RECORD;
BEGIN
  -- 1. Identify the authenticated user
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required: User must be signed in to place an order.';
  END IF;

  -- 2. Fetch user's cart
  SELECT id INTO v_cart_id
  FROM public.carts
  WHERE user_id = v_user_id;

  IF v_cart_id IS NULL THEN
    RAISE EXCEPTION 'No active cart found for user %.', v_user_id;
  END IF;

  -- 3. Verify cart items and lock rows to prevent race conditions / double-spend
  FOR v_rec IN
    SELECT 
      ci.product_id,
      ci.quantity,
      p.name AS product_name,
      p.price AS unit_price,
      p.pieces,
      p.stock
    FROM public.cart_items ci
    JOIN public.products p ON p.id = ci.product_id
    WHERE ci.cart_id = v_cart_id
    FOR UPDATE OF ci, p
  LOOP
    v_item_count := v_item_count + 1;

    -- Verify inventory
    IF v_rec.stock < v_rec.quantity THEN
      RAISE EXCEPTION 'Insufficient stock for product "%". Available: %, requested: %',
        v_rec.product_name, v_rec.stock, v_rec.quantity;
    END IF;

    -- Compute canonical total amount and total pieces server-side
    v_total_amount := v_total_amount + (v_rec.unit_price * v_rec.quantity);
    v_total_pieces := v_total_pieces + (v_rec.pieces * v_rec.quantity);
  END LOOP;

  IF v_item_count = 0 THEN
    RAISE EXCEPTION 'Cannot checkout: Shopping cart is empty.';
  END IF;

  -- 4. Create order record (status is always 'pending' upon creation)
  INSERT INTO public.orders (
    user_id,
    status,
    total_amount,
    total_pieces,
    shipping_address
  )
  VALUES (
    v_user_id,
    'pending',
    v_total_amount,
    v_total_pieces,
    COALESCE(p_shipping_address, '{}'::jsonb)
  )
  RETURNING id INTO v_order_id;

  -- 5. Insert order items with canonical prices and decrement stock
  FOR v_rec IN
    SELECT 
      ci.product_id,
      ci.quantity,
      p.name AS product_name,
      p.price AS unit_price
    FROM public.cart_items ci
    JOIN public.products p ON p.id = ci.product_id
    WHERE ci.cart_id = v_cart_id
  LOOP
    INSERT INTO public.order_items (
      order_id,
      product_id,
      product_name,
      unit_price,
      quantity
    )
    VALUES (
      v_order_id,
      v_rec.product_id,
      v_rec.product_name,
      v_rec.unit_price,
      v_rec.quantity
    );

    -- Deduct product stock
    UPDATE public.products
    SET stock = stock - v_rec.quantity
    WHERE id = v_rec.product_id;
  END LOOP;

  -- 6. Empty the shopping cart
  DELETE FROM public.cart_items
  WHERE cart_id = v_cart_id;

  -- Update cart timestamp
  UPDATE public.carts
  SET updated_at = now()
  WHERE id = v_cart_id;

  RETURN v_order_id;
END;
$$;

-- Revoke default PUBLIC execution privileges granted by PostgreSQL and restrict to authenticated
REVOKE ALL ON FUNCTION public.create_order(JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.create_order(JSONB) FROM anon;
GRANT EXECUTE ON FUNCTION public.create_order(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_order(JSONB) TO service_role;

-- ==============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- A. COLLECTIONS & PRODUCTS: Public Read-Only, Admin Full Access
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view collections" ON public.collections;
CREATE POLICY "Public can view collections"
  ON public.collections FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage collections" ON public.collections;
CREATE POLICY "Admins can manage collections"
  ON public.collections FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products"
  ON public.products FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- B. PROFILES: Owners view & edit their profile, Admins view all
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- ------------------------------------------------------------------------------
-- C. CARTS & CART ITEMS: Users strictly access their own cart
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view their own cart" ON public.carts;
CREATE POLICY "Users can view their own cart"
  ON public.carts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own cart" ON public.carts;
CREATE POLICY "Users can create their own cart"
  ON public.carts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own cart" ON public.carts;
CREATE POLICY "Users can update their own cart"
  ON public.carts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own cart" ON public.carts;
CREATE POLICY "Users can delete their own cart"
  ON public.carts FOR DELETE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own cart items" ON public.cart_items;
CREATE POLICY "Users can view their own cart items"
  ON public.cart_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.carts
      WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can manage their own cart items" ON public.cart_items;
CREATE POLICY "Users can manage their own cart items"
  ON public.cart_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.carts
      WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.carts
      WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()
    )
  );

-- ------------------------------------------------------------------------------
-- D. ORDERS & ORDER ITEMS: Strict User Read-Only, Admin-Only Management
-- ------------------------------------------------------------------------------
-- Clients can ONLY read their own orders and line items.
-- Clients CANNOT directly insert, update, or delete orders or order lines via REST.
-- Order creation MUST be performed through the transactional 'create_order' function.
-- Only administrators can modify order status or delete orders.

DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Admins can insert orders" ON public.orders;
CREATE POLICY "Admins can insert orders"
  ON public.orders FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;
CREATE POLICY "Admins can delete orders"
  ON public.orders FOR DELETE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
CREATE POLICY "Users can view their own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "Admins can insert order items" ON public.order_items;
CREATE POLICY "Admins can insert order items"
  ON public.order_items FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage order items" ON public.order_items;
CREATE POLICY "Admins can manage order items"
  ON public.order_items FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 11. EXPLICIT GRANTS FOR SUPABASE DATA API (POSTGREST)
-- ==============================================================================
-- With automatic table exposure disabled, explicit table privileges must be granted
-- to 'anon' and 'authenticated' roles. Row Level Security (RLS) then constrains
-- every operation to ensure privacy and role-based permissions.

-- Schema usage
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Execute permissions on security helper functions
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

-- create_order: Strictly restricted to authenticated users
REVOKE ALL ON FUNCTION public.create_order(JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.create_order(JSONB) FROM anon;
GRANT EXECUTE ON FUNCTION public.create_order(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_order(JSONB) TO service_role;

-- Catalog: Public read-only for anonymous & authenticated users; Admins manage via RLS
GRANT SELECT ON public.collections, public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.collections, public.products TO authenticated;
GRANT ALL ON public.collections, public.products TO service_role;

-- Profiles: Strictly authenticated users (owners & admins); anon has NO access
REVOKE ALL ON public.profiles FROM anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- Carts & Cart Items: Authenticated users only; anon has NO access
REVOKE ALL ON public.carts, public.cart_items FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.carts, public.cart_items TO authenticated;
GRANT ALL ON public.carts, public.cart_items TO service_role;

-- Orders & Order Items: Authenticated users can SELECT their own; Admins write; anon has NO access
REVOKE ALL ON public.orders, public.order_items FROM anon;
GRANT SELECT ON public.orders, public.order_items TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.orders, public.order_items TO authenticated; -- RLS blocks regular customers; only public.is_admin() passes
GRANT ALL ON public.orders, public.order_items TO service_role;

-- Sequences usage across the public schema
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon, service_role;


