-- ============================================================
-- Mymiso Database Schema
-- Migration 00001: Create all core tables
-- ============================================================

-- Users extend Supabase auth.users
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  phone text,
  role text check (role in ('buyer', 'seller', 'both')) default 'buyer',
  preferred_language text default 'en',
  preferred_currency text default 'USD',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Seller profiles (users who sell)
create table public.sellers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  shop_name text not null,
  shop_slug text unique not null,
  shop_description text,
  shop_logo_url text,
  shop_banner_url text,
  tap_destination_id text,
  tap_business_id text,
  tap_onboarding_complete boolean default false,
  rating_average numeric(3,2) default 0,
  rating_count integer default 0,
  total_sales integer default 0,
  is_verified boolean default false,
  country text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Product categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  icon text,
  parent_id uuid references public.categories(id),
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references public.sellers(id) on delete cascade,
  category_id uuid references public.categories(id),
  title text not null,
  slug text unique not null,
  description text,
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  currency text default 'USD',
  sku text,
  stock_quantity integer default 0,
  low_stock_threshold integer default 5,
  images text[] default '{}',
  thumbnail_url text,
  tags text[] default '{}',
  is_active boolean default true,
  is_featured boolean default false,
  is_flash_deal boolean default false,
  flash_deal_ends_at timestamptz,
  rating_average numeric(3,2) default 0,
  rating_count integer default 0,
  total_sold integer default 0,
  shipping_weight numeric(8,2),
  shipping_free boolean default false,
  shipping_origin_country text,
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Product variants (size, color, etc.)
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  name text not null,
  sku text,
  price_modifier numeric(10,2) default 0,
  stock_quantity integer default 0,
  attributes jsonb not null,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Shopping cart
create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id),
  quantity integer default 1 check (quantity > 0),
  created_at timestamptz default now(),
  unique(user_id, product_id, variant_id)
);

-- Wishlist
create table public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- Addresses
create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  label text default 'Home',
  full_name text not null,
  phone text,
  street_address text not null,
  apartment text,
  city text not null,
  state text,
  postal_code text not null,
  country text not null,
  is_default boolean default false,
  created_at timestamptz default now()
);

-- Orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  buyer_id uuid references public.profiles(id),
  seller_id uuid references public.sellers(id),
  status text check (status in (
    'pending', 'confirmed', 'processing',
    'shipped', 'delivered', 'cancelled', 'refunded'
  )) default 'pending',
  subtotal numeric(10,2) not null,
  shipping_cost numeric(10,2) default 0,
  tax numeric(10,2) default 0,
  total numeric(10,2) not null,
  currency text default 'USD',
  shipping_address jsonb not null,
  shipping_method text,
  tracking_number text,
  tracking_url text,
  estimated_delivery_date date,
  payment_method text check (payment_method in ('whish', 'tap', 'cod')) default 'whish',
  payment_ref_id text,
  tap_transfer_id text,
  cod_confirmed_at timestamptz,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order line items
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  variant_id uuid references public.product_variants(id),
  product_snapshot jsonb not null,
  quantity integer not null,
  unit_price numeric(10,2) not null,
  total_price numeric(10,2) not null,
  created_at timestamptz default now()
);

-- Reviews
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  order_id uuid references public.orders(id),
  rating integer check (rating >= 1 and rating <= 5) not null,
  title text,
  body text,
  images text[] default '{}',
  is_verified_purchase boolean default false,
  helpful_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(product_id, user_id, order_id)
);

-- Buyer-seller messaging
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid references public.profiles(id),
  seller_id uuid references public.sellers(id),
  product_id uuid references public.products(id),
  last_message_at timestamptz default now(),
  created_at timestamptz default now(),
  unique(buyer_id, seller_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  sender_id uuid references public.profiles(id),
  body text not null,
  image_url text,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Notifications
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  link text,
  is_read boolean default false,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- ============================================================
-- Indexes
-- ============================================================
create index idx_products_seller on public.products(seller_id);
create index idx_products_category on public.products(category_id);
create index idx_products_active on public.products(is_active) where is_active = true;
create index idx_products_flash_deal on public.products(is_flash_deal, flash_deal_ends_at) where is_flash_deal = true;
create index idx_products_search on public.products using gin(to_tsvector('english', title || ' ' || coalesce(description, '')));
create index idx_orders_buyer on public.orders(buyer_id);
create index idx_orders_seller on public.orders(seller_id);
create index idx_orders_status on public.orders(status);
create index idx_reviews_product on public.reviews(product_id);
create index idx_messages_conversation on public.messages(conversation_id);
create index idx_notifications_user on public.notifications(user_id, is_read);
create index idx_cart_user on public.cart_items(user_id);
create index idx_wishlist_user on public.wishlist_items(user_id);

-- ============================================================
-- Row Level Security
-- ============================================================

-- Profiles: users can read all, update own
alter table public.profiles enable row level security;
create policy "Public profiles" on public.profiles for select using (true);
create policy "Own profile" on public.profiles for update using (auth.uid() = id);
create policy "Insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Sellers: anyone can read, owners manage
alter table public.sellers enable row level security;
create policy "Public sellers" on public.sellers for select using (true);
create policy "Own seller profile" on public.sellers for insert with check (user_id = auth.uid());
create policy "Update own seller" on public.sellers for update using (user_id = auth.uid());

-- Categories: public read
alter table public.categories enable row level security;
create policy "Public categories" on public.categories for select using (true);

-- Products: anyone can read active, sellers manage own
alter table public.products enable row level security;
create policy "Read active products" on public.products for select using (is_active = true);
create policy "Seller manages own products" on public.products for all
  using (seller_id in (select id from public.sellers where user_id = auth.uid()));

-- Product variants: public read, seller manages
alter table public.product_variants enable row level security;
create policy "Public variants" on public.product_variants for select using (true);
create policy "Seller manages variants" on public.product_variants for all
  using (product_id in (
    select p.id from public.products p
    join public.sellers s on p.seller_id = s.id
    where s.user_id = auth.uid()
  ));

-- Cart: users manage own
alter table public.cart_items enable row level security;
create policy "Own cart" on public.cart_items for all using (user_id = auth.uid());

-- Wishlist: users manage own
alter table public.wishlist_items enable row level security;
create policy "Own wishlist" on public.wishlist_items for all using (user_id = auth.uid());

-- Addresses: users manage own
alter table public.addresses enable row level security;
create policy "Own addresses" on public.addresses for all using (user_id = auth.uid());

-- Orders: buyers see own, sellers see their orders
alter table public.orders enable row level security;
create policy "Buyer own orders" on public.orders for select
  using (buyer_id = auth.uid());
create policy "Seller own orders" on public.orders for select
  using (seller_id in (select id from public.sellers where user_id = auth.uid()));

-- Order items: accessible through order access
alter table public.order_items enable row level security;
create policy "Order items via order" on public.order_items for select
  using (order_id in (
    select id from public.orders
    where buyer_id = auth.uid()
    or seller_id in (select id from public.sellers where user_id = auth.uid())
  ));

-- Reviews: anyone reads, authors manage own
alter table public.reviews enable row level security;
create policy "Read reviews" on public.reviews for select using (true);
create policy "Own reviews" on public.reviews for insert with check (user_id = auth.uid());
create policy "Update own reviews" on public.reviews for update using (user_id = auth.uid());

-- Conversations: participants only
alter table public.conversations enable row level security;
create policy "Conversation participants" on public.conversations for select
  using (
    buyer_id = auth.uid()
    or seller_id in (select id from public.sellers where user_id = auth.uid())
  );
create policy "Create conversation" on public.conversations for insert
  with check (buyer_id = auth.uid());

-- Messages: participants only
alter table public.messages enable row level security;
create policy "Message participants" on public.messages for select
  using (conversation_id in (
    select id from public.conversations
    where buyer_id = auth.uid()
    or seller_id in (select id from public.sellers where user_id = auth.uid())
  ));
create policy "Send message" on public.messages for insert
  with check (sender_id = auth.uid());

-- Notifications: users see own
alter table public.notifications enable row level security;
create policy "Own notifications" on public.notifications for select using (user_id = auth.uid());
create policy "Update own notifications" on public.notifications for update using (user_id = auth.uid());

-- ============================================================
-- Auto-create profile on signup (trigger)
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Auto-update updated_at timestamp
-- ============================================================
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

create trigger update_sellers_updated_at
  before update on public.sellers
  for each row execute procedure public.update_updated_at();

create trigger update_products_updated_at
  before update on public.products
  for each row execute procedure public.update_updated_at();

create trigger update_orders_updated_at
  before update on public.orders
  for each row execute procedure public.update_updated_at();

create trigger update_reviews_updated_at
  before update on public.reviews
  for each row execute procedure public.update_updated_at();
