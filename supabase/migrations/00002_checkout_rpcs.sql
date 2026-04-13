-- ============================================================
-- Mymiso Database Schema
-- Migration 00002: Checkout RPCs, order insert policies
-- ============================================================

-- Generate order number: MYM-YYYYMMDD-XXXX
create or replace function public.generate_order_number()
returns text
language plpgsql
as $$
declare
  date_part text;
  rand_part text;
begin
  date_part := to_char(now(), 'YYYYMMDD');
  rand_part := upper(substr(md5(random()::text), 1, 4));
  return 'MYM-' || date_part || '-' || rand_part;
end;
$$;

-- Atomic order placement: creates order + items + decrements stock
-- Rolls back entirely if any product has insufficient stock
create or replace function public.place_order(
  p_buyer_id uuid,
  p_seller_id uuid,
  p_order_number text,
  p_items jsonb,
  p_shipping_address jsonb,
  p_payment_method text,
  p_shipping_cost numeric,
  p_shipping_method text,
  p_subtotal numeric,
  p_total numeric,
  p_currency text default 'USD',
  p_notes text default null
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_order_id uuid;
  v_item jsonb;
  v_product record;
  v_variant record;
  v_snapshot jsonb;
begin
  -- Create order
  insert into public.orders (
    order_number, buyer_id, seller_id, status,
    subtotal, shipping_cost, tax, total, currency,
    shipping_address, shipping_method, payment_method, notes
  ) values (
    p_order_number, p_buyer_id, p_seller_id, 'pending',
    p_subtotal, p_shipping_cost, 0, p_total, p_currency,
    p_shipping_address, p_shipping_method, p_payment_method, p_notes
  ) returning id into v_order_id;

  -- Process each item
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    -- Lock and fetch product
    select * into v_product
    from public.products
    where id = (v_item->>'product_id')::uuid
    for update;

    if not found then
      raise exception 'Product % not found', v_item->>'product_id';
    end if;

    -- Check variant stock if applicable
    if v_item->>'variant_id' is not null and v_item->>'variant_id' != '' then
      select * into v_variant
      from public.product_variants
      where id = (v_item->>'variant_id')::uuid
      for update;

      if not found then
        raise exception 'Variant % not found', v_item->>'variant_id';
      end if;

      if v_variant.stock_quantity < (v_item->>'quantity')::int then
        raise exception 'Insufficient stock for "%" (% variant). Available: %, Requested: %',
          v_product.title, v_variant.name, v_variant.stock_quantity, (v_item->>'quantity')::int;
      end if;

      -- Decrement variant stock
      update public.product_variants
      set stock_quantity = stock_quantity - (v_item->>'quantity')::int
      where id = v_variant.id;
    else
      -- Check product stock
      if v_product.stock_quantity < (v_item->>'quantity')::int then
        raise exception 'Insufficient stock for "%". Available: %, Requested: %',
          v_product.title, v_product.stock_quantity, (v_item->>'quantity')::int;
      end if;
    end if;

    -- Decrement product stock
    update public.products
    set stock_quantity = stock_quantity - (v_item->>'quantity')::int,
        total_sold = total_sold + (v_item->>'quantity')::int
    where id = v_product.id;

    -- Build product snapshot
    v_snapshot := jsonb_build_object(
      'title', v_product.title,
      'slug', v_product.slug,
      'thumbnail_url', v_product.thumbnail_url,
      'price', v_product.price,
      'variant_name', v_item->>'variant_name'
    );

    -- Insert order item
    insert into public.order_items (
      order_id, product_id, variant_id,
      product_snapshot, quantity, unit_price, total_price
    ) values (
      v_order_id,
      v_product.id,
      case when v_item->>'variant_id' is not null and v_item->>'variant_id' != ''
        then (v_item->>'variant_id')::uuid else null end,
      v_snapshot,
      (v_item->>'quantity')::int,
      (v_item->>'unit_price')::numeric,
      (v_item->>'quantity')::int * (v_item->>'unit_price')::numeric
    );
  end loop;

  return v_order_id;
end;
$$;

-- RLS: allow buyers to insert their own orders
create policy "Buyer creates orders" on public.orders
  for insert with check (buyer_id = auth.uid());

-- RLS: allow inserting order items for own orders
create policy "Insert order items for own orders" on public.order_items
  for insert with check (
    order_id in (select id from public.orders where buyer_id = auth.uid())
  );

-- RLS: allow buyers to update their own orders (for cancellation)
create policy "Buyer updates own orders" on public.orders
  for update using (buyer_id = auth.uid());

-- RLS: allow sellers to update orders they received (for status changes)
create policy "Seller updates received orders" on public.orders
  for update using (
    seller_id in (select id from public.sellers where user_id = auth.uid())
  );

-- RLS: notifications - users read/update own
alter table public.notifications enable row level security;
create policy "Own notifications" on public.notifications
  for select using (user_id = auth.uid());
create policy "Update own notifications" on public.notifications
  for update using (user_id = auth.uid());

-- RLS: addresses - users manage own
alter table public.addresses enable row level security;
create policy "Own addresses select" on public.addresses
  for select using (user_id = auth.uid());
create policy "Own addresses insert" on public.addresses
  for insert with check (user_id = auth.uid());
create policy "Own addresses update" on public.addresses
  for update using (user_id = auth.uid());
create policy "Own addresses delete" on public.addresses
  for delete using (user_id = auth.uid());
