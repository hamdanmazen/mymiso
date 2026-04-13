# Mymizo — Implementation Plan

> Multi-vendor marketplace. Next.js + Supabase + Tailwind.
> "Sell Fast. Shop Better."

---

## Tech Stack

> Versions pinned as of April 2026. Update as needed.

| Layer | Technology | Version | Why |
|-------|-----------|---------|-----|
| Framework | Next.js (App Router) | 16.2 | SSR for SEO, React Server Components, Turbopack builds, AI-ready with AGENTS.md support, ~400% faster dev startup |
| Database | Supabase (PostgreSQL) | Latest | Auth, RLS, Realtime, Storage, Edge Functions — all-in-one. AI-powered table filters, queued Table Editor |
| Auth | Supabase Auth | — | Email/password, OAuth (Google, Facebook), magic link, networked onboarding |
| Styling | Tailwind CSS | 4.2 | CSS-first config (no more tailwind.config.ts), Rust-based engine, logical property utilities, native dark mode with `@custom-variant` |
| State | Zustand | 5.x | Lightweight, no boilerplate, improved persist middleware, good for cart/wishlist |
| Payments (Primary) | Whish Pay | Latest | Lebanon's #1 fintech — 1M+ users, 1,000+ agent locations, licensed by Banque du Liban. Supports wallet payments, Visa card (digital + physical), 10,000+ POS locations, Google Wallet tap-to-pay, Mastercard cross-border. Covers both wallet and card payments in one integration |
| Payments (Backup) | Tap Payments (Marketplace API) | Latest | Optional MENA-native card gateway if you need broader international card coverage (Apple Pay, mada) or Tap's Destinations API for automatic multi-vendor splits. Can be added later if Whish doesn't cover all card needs |
| Payments (COD) | Cash on Delivery | — | ~60-70% of Lebanese e-commerce is COD — non-negotiable. Order confirmed on delivery via driver/agent confirmation. Whish agent locations can also serve as pickup/payment points |
| Chat | Supabase Realtime | — | Buyer-seller messaging with zero extra infrastructure |
| Images | Supabase Storage + CDN | — | Product images with on-the-fly transforms, 14.8x faster object listing |
| Search | Supabase full-text search (pg_trgm) → Meilisearch later | — | Start simple, upgrade when needed. Meilisearch adds federated search, ~100ms faster |
| i18n | next-intl | 4.x | Multi-language with App Router + RSC support, type-safe translations, ICU message format |
| Email | Resend | Latest | Transactional emails, inbound email webhooks, rebuilt no-code editor, batch endpoint |
| Testing | Vitest + Playwright | 4.x / 1.59 | Vitest 4 with Vite 8 support, async leak detection. Playwright with Timeline debug, Chrome for Testing |
| Deployment | Vercel | — | Zero-config Next.js 16 hosting, edge functions, Adapter API |

---

## Project Structure

```
mymizo/
├── DESIGN.md                    # Design system (AI agent reference)
├── PLAN.md                      # This file
├── next.config.ts               # Next.js 16 config (TypeScript native)
├── app.css                      # Tailwind v4 CSS-first config + DESIGN.md tokens
├── package.json
│
├── supabase/
│   ├── migrations/              # SQL migration files (versioned)
│   ├── seed.sql                 # Dev seed data
│   └── config.toml
│
├── src/
│   ├── app/
│   │   ├── (storefront)/        # Buyer-facing route group
│   │   │   ├── page.tsx                    # Homepage
│   │   │   ├── products/
│   │   │   │   ├── page.tsx                # Product listing + filters
│   │   │   │   └── [slug]/page.tsx         # Product detail
│   │   │   ├── categories/
│   │   │   │   └── [slug]/page.tsx         # Category listing
│   │   │   ├── cart/page.tsx               # Shopping cart
│   │   │   ├── checkout/page.tsx           # Checkout flow
│   │   │   ├── search/page.tsx             # Search results
│   │   │   └── sellers/
│   │   │       └── [id]/page.tsx           # Seller storefront
│   │   │
│   │   ├── (account)/           # Authenticated user route group
│   │   │   ├── dashboard/page.tsx          # Buyer dashboard
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx                # Order history
│   │   │   │   └── [id]/page.tsx           # Order detail + tracking
│   │   │   ├── wishlist/page.tsx           # Saved items
│   │   │   ├── addresses/page.tsx          # Address management
│   │   │   ├── reviews/page.tsx            # User's reviews
│   │   │   ├── messages/page.tsx           # Buyer-seller chat
│   │   │   └── settings/page.tsx           # Account settings
│   │   │
│   │   ├── (seller)/            # Seller dashboard route group
│   │   │   ├── seller/
│   │   │   │   ├── dashboard/page.tsx      # Seller overview (stats, revenue)
│   │   │   │   ├── products/
│   │   │   │   │   ├── page.tsx            # Product management list
│   │   │   │   │   ├── new/page.tsx        # Add product
│   │   │   │   │   └── [id]/edit/page.tsx  # Edit product
│   │   │   │   ├── orders/page.tsx         # Seller order management
│   │   │   │   ├── inventory/page.tsx      # Stock management
│   │   │   │   ├── analytics/page.tsx      # Sales analytics
│   │   │   │   ├── payouts/page.tsx        # Stripe payout history
│   │   │   │   ├── messages/page.tsx       # Customer messages
│   │   │   │   └── settings/page.tsx       # Shop settings, branding
│   │   │
│   │   ├── (auth)/              # Auth route group
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── verify/page.tsx
│   │   │
│   │   ├── api/                 # API routes
│   │   │   ├── webhooks/
│   │   │   │   ├── whish/route.ts          # Whish Pay webhook handler
│   │   │   │   └── tap/route.ts            # Tap Payments webhook handler
│   │   │   ├── checkout/route.ts           # Create charge (routes to whish/tap/cod)
│   │   │   ├── cod/confirm/route.ts        # COD delivery confirmation endpoint
│   │   │   └── upload/route.ts             # Image upload handler
│   │   │
│   │   ├── layout.tsx           # Root layout (providers, nav, footer)
│   │   └── globals.css          # Tailwind base + DESIGN.md custom props
│   │
│   ├── components/
│   │   ├── ui/                  # Atomic design system components
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── StarRating.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── Avatar.tsx
│   │   │
│   │   ├── layout/              # Structural components
│   │   │   ├── Navbar.tsx
│   │   │   ├── CategoryNav.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileBottomNav.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── SearchBar.tsx
│   │   │
│   │   ├── product/             # Product-related components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductGallery.tsx
│   │   │   ├── ProductFilters.tsx
│   │   │   ├── ProductSort.tsx
│   │   │   ├── PriceDisplay.tsx
│   │   │   ├── DiscountBadge.tsx
│   │   │   └── FlashDealTimer.tsx
│   │   │
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartItem.tsx
│   │   │   └── CartSummary.tsx
│   │   │
│   │   ├── checkout/
│   │   │   ├── CheckoutForm.tsx
│   │   │   ├── AddressForm.tsx
│   │   │   ├── ShippingOptions.tsx
│   │   │   └── PaymentForm.tsx
│   │   │
│   │   ├── seller/
│   │   │   ├── SellerCard.tsx
│   │   │   ├── SellerBadge.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── OrderTable.tsx
│   │   │   ├── InventoryTable.tsx
│   │   │   └── StatsCard.tsx
│   │   │
│   │   ├── review/
│   │   │   ├── ReviewCard.tsx
│   │   │   ├── ReviewForm.tsx
│   │   │   └── ReviewSummary.tsx
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   └── ChatList.tsx
│   │   │
│   │   └── home/
│   │       ├── HeroBanner.tsx
│   │       ├── BannerCarousel.tsx
│   │       ├── FlashDeals.tsx
│   │       ├── TrendingProducts.tsx
│   │       ├── BestSellers.tsx
│   │       ├── RecommendedForYou.tsx
│   │       └── CategoryGrid.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser Supabase client
│   │   │   ├── server.ts           # Server-side Supabase client
│   │   │   ├── middleware.ts        # Auth middleware
│   │   │   └── admin.ts            # Service role client (webhooks)
│   │   │
│   │   ├── payments/
│   │   │   ├── whish.ts            # Whish Pay wallet gateway integration
│   │   │   ├── tap-client.ts       # Tap Payments client init (card payments)
│   │   │   ├── tap-marketplace.ts  # Tap Marketplace / Destinations helpers
│   │   │   ├── tap-business.ts     # Seller onboarding (Business API + Connect API)
│   │   │   ├── cod.ts              # Cash on Delivery order flow + confirmation
│   │   │   ├── router.ts           # Payment method router (whish/tap/cod)
│   │   │   └── webhooks.ts         # Webhook handlers for Whish + Tap
│   │   │
│   │   ├── utils/
│   │   │   ├── formatPrice.ts      # Currency formatting with locale
│   │   │   ├── formatDate.ts
│   │   │   ├── slugify.ts
│   │   │   ├── validators.ts       # Zod schemas for forms
│   │   │   └── constants.ts        # App-wide constants
│   │   │
│   │   └── hooks/
│   │       ├── useCart.ts
│   │       ├── useWishlist.ts
│   │       ├── useAuth.ts
│   │       ├── useSearch.ts
│   │       ├── useChat.ts
│   │       └── useNotifications.ts
│   │
│   ├── stores/
│   │   ├── cartStore.ts
│   │   ├── wishlistStore.ts
│   │   └── notificationStore.ts
│   │
│   └── types/
│       ├── database.ts             # Supabase generated types
│       ├── product.ts
│       ├── order.ts
│       ├── user.ts
│       └── seller.ts
│
├── public/
│   ├── logo.svg
│   ├── logo-icon.svg
│   └── og-image.png
│
└── tests/
    ├── e2e/                        # Playwright E2E tests
    └── unit/                       # Vitest unit tests
```

---

## Database Schema

### Core Tables

```sql
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
  tap_destination_id text,            -- Tap Payments destination ID for split payments
  tap_business_id text,               -- Tap Business API account ID
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
  icon text,                          -- Icon identifier for category grid
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
  compare_at_price numeric(10,2),     -- Original price for showing discounts
  currency text default 'USD',
  sku text,
  stock_quantity integer default 0,
  low_stock_threshold integer default 5,
  images text[] default '{}',         -- Array of image URLs
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
  metadata jsonb default '{}',        -- Flexible key-value for variants, specs
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Product variants (size, color, etc.)
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  name text not null,                 -- e.g., "Red / Large"
  sku text,
  price_modifier numeric(10,2) default 0,
  stock_quantity integer default 0,
  attributes jsonb not null,          -- {"color": "red", "size": "L"}
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
  label text default 'Home',          -- Home, Work, etc.
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
  order_number text unique not null,  -- Human-readable: MYM-20260412-XXXX
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
  shipping_address jsonb not null,    -- Snapshot at time of order
  shipping_method text,
  tracking_number text,
  tracking_url text,
  estimated_delivery_date date,
  payment_method text check (payment_method in ('whish', 'tap', 'cod')) default 'whish',
  payment_ref_id text,                -- Whish transaction ID or Tap charge ID
  tap_transfer_id text,               -- Tap transfer to seller destination (card payments only)
  cod_confirmed_at timestamptz,       -- When COD was collected and confirmed by delivery agent
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
  product_snapshot jsonb not null,    -- Snapshot of product at purchase time
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
  product_id uuid references public.products(id),  -- Optional context
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
  type text not null,                 -- 'order_update', 'new_message', 'review', 'sale'
  title text not null,
  body text,
  link text,                          -- In-app deep link
  is_read boolean default false,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);
```

### Key Indexes

```sql
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
```

### Row Level Security Policies

```sql
-- Profiles: users can read all, update own
alter table public.profiles enable row level security;
create policy "Public profiles" on public.profiles for select using (true);
create policy "Own profile" on public.profiles for update using (auth.uid() = id);

-- Products: anyone can read active, sellers manage own
alter table public.products enable row level security;
create policy "Read active products" on public.products for select using (is_active = true);
create policy "Seller manages own products" on public.products for all
  using (seller_id in (select id from public.sellers where user_id = auth.uid()));

-- Orders: buyers see own, sellers see their orders
alter table public.orders enable row level security;
create policy "Buyer own orders" on public.orders for select
  using (buyer_id = auth.uid());
create policy "Seller own orders" on public.orders for select
  using (seller_id in (select id from public.sellers where user_id = auth.uid()));

-- Cart: users manage own
alter table public.cart_items enable row level security;
create policy "Own cart" on public.cart_items for all using (user_id = auth.uid());

-- Reviews: anyone reads, authors manage own
alter table public.reviews enable row level security;
create policy "Read reviews" on public.reviews for select using (true);
create policy "Own reviews" on public.reviews for insert with check (user_id = auth.uid());

-- Messages: participants only
alter table public.messages enable row level security;
create policy "Conversation participants" on public.messages for select
  using (conversation_id in (
    select id from public.conversations
    where buyer_id = auth.uid()
    or seller_id in (select id from public.sellers where user_id = auth.uid())
  ));
```

---

## Implementation Phases

### Phase 1 — Foundation (Week 1-2)

**Goal**: Project skeleton, auth, database, design system tokens in Tailwind.

| Task | Details |
|------|---------|
| Next.js 16 project init | `create-next-app` with App Router, TypeScript, Tailwind v4, ESLint, Prettier, AGENTS.md |
| Tailwind v4 CSS config | Map DESIGN.md tokens via `@theme` in `app.css` (no config file needed), `@custom-variant` for dark mode |
| CSS custom properties | DESIGN.md color palette, spacing scale, shadow system as CSS variables |
| Supabase project setup | Create project, enable Auth, configure providers |
| Database migrations | Run all `create table` statements, indexes, RLS policies |
| Auth flow | Login, signup, email verification, password reset |
| User profiles | Profile creation on signup, avatar upload |
| Seller onboarding | "Become a Seller" flow, shop name/slug setup |
| UI component library | Button, Badge, Card, Input, Modal, Skeleton, StarRating |
| Layout components | Navbar, Footer, MobileBottomNav, Sidebar |
| Seed data | 10 categories, 5 sellers, 50 products for development |

**Milestone**: Can sign up, log in, see a styled navbar, browse empty pages.

### Phase 2 — Buyer Experience (Week 3-6)

**Goal**: Full shopping experience from browsing to cart.

| Task | Details |
|------|---------|
| Homepage | HeroBanner, BannerCarousel, CategoryGrid |
| Homepage sections | FlashDeals, TrendingProducts, BestSellers, RecommendedForYou |
| Product listing page | Grid layout (responsive 2-5 columns per DESIGN.md) |
| Product filters | Price range, rating, category, shipping, free shipping |
| Product sort | Price low/high, popularity, newest, rating |
| Search | Full-text search with pg_trgm, SearchBar component |
| Product detail page | Image gallery with zoom, price display, shipping options |
| Product reviews display | ReviewSummary, ReviewCard, rating breakdown |
| Add to Cart | CartDrawer (slide-out), quantity picker, variant selection |
| Cart page | Full cart view, quantity edit, remove items, price summary |
| Wishlist | Add/remove from cards and detail page, wishlist page |
| Category pages | Category landing with subcategories and product grid |
| Seller storefront | Public seller page with products, rating, about |

**Milestone**: Complete browse-to-cart flow with real data.

### Phase 3 — Checkout & Orders (Week 7-9)

**Goal**: End-to-end purchasing, order management for buyers.

| Task | Details |
|------|---------|
| Checkout flow | Single-page: address → shipping → payment → review → confirm |
| Address management | Add/edit/delete addresses, set default |
| Shipping options | Multiple options per seller with delivery estimates |
| Payment integration | Whish Pay (wallet + Visa card + agent cash-in), optional Tap (international cards), COD flow |
| Order creation | Atomic: create order + line items + decrement stock |
| Order confirmation | Success page, confirmation email via Resend |
| Order history | Buyer dashboard with order list, status badges |
| Order detail | Full order view with items, tracking, status timeline |
| Order tracking | Tracking number input (seller), tracking display (buyer) |
| Review submission | Post-purchase review with rating + text + images |
| Notifications | Order status change notifications (in-app + email) |

**Milestone**: Can complete a purchase, see order status, leave a review.

### Phase 4 — Seller Dashboard (Week 10-13)

**Goal**: Sellers can manage their entire business.

| Task | Details |
|------|---------|
| Seller dashboard overview | Revenue stats, recent orders, low stock alerts |
| Product management | Add/edit/delete products, image upload (multi), variants |
| Product form | Rich form with all fields, variant builder, image reorder |
| Inventory management | Stock levels table, bulk update, low stock alerts |
| Order management | Incoming orders, status updates, shipping label entry |
| Payment onboarding | Tap Business API for card-accepting sellers, Whish merchant setup |
| Payout management | View payout history (Whish transfers + Tap splits + COD settlements) |
| Sales analytics | Revenue chart, top products, conversion metrics |
| Shop settings | Shop name, logo, banner, description, policies |
| Seller notifications | New order, low stock, new review alerts |

**Milestone**: Seller can list products, receive orders, get paid.

### Phase 5 — Communication & Social (Week 14-16)

**Goal**: Buyer-seller chat, full review system, notification center.

| Task | Details |
|------|---------|
| Chat system | Supabase Realtime channels, conversation list, message window |
| Chat from product page | "Contact Seller" button → opens chat with product context |
| Chat notifications | Unread badges, real-time message delivery |
| Review system enhancement | Helpful votes, seller replies, verified purchase badge |
| Notification center | Dropdown in navbar, notification page, read/unread |
| Email notifications | Configurable: order updates, messages, promotions |
| Push notifications | Web Push API for browser notifications (optional) |

**Milestone**: Full communication loop between buyer and seller.

### Phase 6 — Internationalization & Polish (Week 17-19)

**Goal**: Multi-language, multi-currency, performance optimization.

| Task | Details |
|------|---------|
| i18n setup | next-intl 4.x configuration, locale routing, streaming support |
| Translation | English (default), Arabic, French as initial languages |
| RTL support | Layout mirroring for Arabic using Tailwind v4 logical property utilities (pbs-*, mbs-*) |
| Multi-currency | Currency selector, conversion display, Stripe multi-currency |
| SEO optimization | Meta tags, Open Graph, structured data (Product schema) |
| Performance | Image optimization (next/image), lazy loading, code splitting |
| Skeleton loading | Shimmer loading states for all async content |
| Error handling | Error boundaries, 404 page, offline fallback |
| Accessibility | WCAG 2.1 AA: focus management, aria labels, keyboard nav |
| Dark/light mode | System preference detection + manual toggle |

**Milestone**: Production-ready international marketplace.

### Phase 7 — Testing & Launch Prep (Week 20-22)

**Goal**: Testing, security hardening, deployment.

| Task | Details |
|------|---------|
| Unit tests | Vitest 4 for utility functions, hooks, state stores (async leak detection) |
| Component tests | Testing Library for UI components |
| E2E tests | Playwright 1.59 for critical flows: signup → browse → purchase (Timeline debugging) |
| Security audit | RLS policy review, input sanitization, CSRF protection |
| Rate limiting | API route rate limiting, abuse prevention |
| Monitoring | Error tracking (Sentry), analytics (PostHog or Plausible) |
| Staging deployment | Vercel preview environment with Supabase staging project |
| Load testing | Basic load test on product listing and checkout |
| Documentation | API docs, seller onboarding guide, admin runbook |
| Production deployment | Vercel production, Supabase production, Stripe live mode |
| DNS & SSL | Custom domain setup, SSL verification |

**Milestone**: Live marketplace.

---

## Payment Flows

Mymizo supports three payment methods, prioritized for the Lebanese market:

### Flow A — Whish Pay (Primary — wallet, Visa card, or agent cash-in)

```
Buyer selects "Pay with Whish" at checkout
    │
    ├── Option 1: Pay from Whish wallet balance
    ├── Option 2: Pay with Whish Visa card (digital or physical)
    ├── Option 3: Pay via Google Wallet (tap-to-pay with Whish Visa)
    └── Option 4: Generate payment code → pay cash at any Whish agent location
    │
    ▼
Next.js API route creates Whish Pay charge
    │  - amount = order total
    │  - merchant_id = mymizo_whish_merchant
    │
    ▼
Buyer confirms payment (Whish app PIN / card details / agent scan)
    │
    ▼
Whish webhook → payment confirmed
    │
    ├── Update order status → 'confirmed'
    ├── Send confirmation email to buyer
    ├── Notify seller of new order
    └── Platform holds funds, releases to seller after delivery confirmation
        (minus platform fee)
```

### Flow B — Tap Payments (Optional — international cards, Apple Pay)

```
Buyer selects "Pay with Card" at checkout (non-Whish)
    │
    ▼
Next.js API route creates Tap Charge
    │  - amount = order total
    │  - destinations = [{ id: seller_tap_destination_id, amount: seller_share }]
    │  - remaining amount stays in marketplace Tap account (platform fee)
    │
    ▼
Buyer completes payment (Tap card form / Apple Pay)
    │
    ▼
Tap webhook → charge.captured
    │
    ├── Update order status → 'confirmed'
    ├── Send confirmation email to buyer
    ├── Notify seller of new order
    └── Tap auto-splits funds: seller gets their share, platform keeps fee
```

### Flow C — Cash on Delivery (COD)

```
Buyer selects "Cash on Delivery" at checkout
    │
    ▼
Order created with status 'pending_delivery'
    │  - No payment processed yet
    │  - Seller notified of new COD order
    │
    ▼
Seller ships order → status 'shipped'
    │
    ▼
Delivery agent collects cash from buyer
    │
    ▼
Agent/seller confirms delivery via app → POST /api/cod/confirm
    │
    ├── Update order status → 'delivered'
    ├── cod_confirmed_at timestamp recorded
    ├── Send delivery confirmation to buyer
    └── Platform invoices seller for platform fee (settled periodically)
```

### Platform Fee Structure
- Suggested starting fee: 8-12% per transaction
- Configurable per seller tier (verified sellers could get lower fees)
- Whish Pay: platform collects full amount, transfers seller share after delivery
- Tap Cards: automatic split via Destinations API — platform fee retained, seller share transferred
- COD: platform invoices sellers for fee on a weekly/monthly settlement cycle
- COD orders may require a small non-refundable deposit via Whish/Tap to reduce fake orders

---

## Key Architecture Decisions

### Why Next.js 16 over 14/15
- Turbopack is now default — ~400% faster dev startup, ~50% faster rendering
- Stable Adapter API for deployment flexibility beyond Vercel
- Server Fast Refresh — server component edits without full page reload
- AI-native features: AGENTS.md in create-next-app, browser log forwarding, experimental Agent DevTools
- TypeScript config (`next.config.ts`) is now native — no more `next.config.js`

### Why Tailwind v4 over v3
- CSS-first configuration — no `tailwind.config.ts` needed, everything in CSS via `@theme`
- Rust-based engine — dramatically faster builds and recompilation
- Logical property utilities (pbs-*, mbs-*, border-bs) for RTL support — critical for Arabic i18n
- Native `@custom-variant` for dark mode instead of class-based hacks
- Webpack plugin (`@tailwindcss/webpack`) for seamless integration

### Why Supabase over Firebase
- PostgreSQL with real relational queries, JOINs, and constraints — critical for marketplace data integrity (stock, orders, payments)
- Row Level Security at the database level — sellers can never accidentally see another seller's orders
- Full-text search built in — no need for a separate search service initially
- Supabase Realtime for chat without additional infrastructure
- AI-powered table filters and queued Table Editor for faster development
- Log Drains on Pro for Datadog, Sentry, Grafana integration
- Supabase Warehouse (Hydra + pg_duckdb) for 600x faster analytics queries when needed

### Why Whish Pay + COD (with optional Tap)
- **Whish is a full payment platform, not just a wallet**: supports wallet-to-wallet, digital Visa card, physical Visa card, Google Wallet tap-to-pay, 10,000+ POS locations, and Mastercard cross-border transfers
- **One integration covers most payment methods**: wallet for Whish users, Visa card for card users, cash-in at 1,000+ agent locations for unbanked users — all through Whish
- **COD is non-negotiable**: ~60-70% of Lebanese e-commerce is cash on delivery — skipping this kills adoption. Whish agent locations can double as COD payment/pickup points
- **Tap is optional backup**: only needed if you want Apple Pay, broader international card coverage, or Tap's Destinations API for automatic multi-vendor splits. Can be added in Phase 2 if Whish merchant API doesn't handle all card scenarios
- Licensed by Banque du Liban — regulatory compliance built in
- Mastercard partnership enables diaspora remittance-to-purchase flows

### Why Zustand 5 over Redux/Context
- Cart and wishlist need fast, synchronous updates with optimistic UI
- No boilerplate — a cart store is 20 lines, not 5 files
- v5 improved persist middleware with latest-state post-rehydration callbacks
- Works seamlessly with Next.js 16 App Router and Server Components

### Why next-intl 4 over next-i18next
- Built for App Router and React Server Components from the ground up
- Type-safe translations with full TypeScript inference
- ICU message format for plurals, dates, currencies
- Middleware-based locale detection
- v4 introduced streaming support and improved bundle splitting

### Why Vitest 4 + Playwright 1.59 for testing
- Vitest 4: Vite 8 beta support, async leak detection, static test collection, improved type inference
- Playwright 1.59: Timeline debugging in HTML reports, Chrome for Testing (not Chromium), dark mode UI
- Both tools are fast, modern, and actively maintained — no legacy Jest/Cypress baggage

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=           # Server-side only, never expose

# Whish Pay
WHISH_MERCHANT_ID=
WHISH_API_KEY=                       # Server-side only
WHISH_WEBHOOK_SECRET=

# Tap Payments
NEXT_PUBLIC_TAP_PUBLISHABLE_KEY=
TAP_SECRET_KEY=                      # Server-side only
TAP_WEBHOOK_SECRET=

# Platform
PLATFORM_FEE_PERCENT=10
COD_DEPOSIT_REQUIRED=false           # Set true to require small deposit on COD orders

# Resend (email)
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=https://mymizo.com
NEXT_PUBLIC_APP_NAME=Mymizo
NEXT_PUBLIC_DEFAULT_CURRENCY=USD     # USD or LBP
NEXT_PUBLIC_DEFAULT_LOCALE=en
```

---

## Commands Reference

```bash
# Development
npm run dev                    # Start Next.js 16 dev server (Turbopack default)
npx supabase start             # Start local Supabase (Docker)
npx supabase db reset          # Reset local DB + run migrations + seed
npx supabase gen types typescript --local > src/types/database.ts

# Database
npx supabase migration new <name>    # Create new migration file
npx supabase db push                 # Push migrations to remote

# Testing
npx vitest                     # Vitest 4 unit tests (watch mode)
npx vitest run                 # Vitest 4 single run
npx playwright test            # Playwright 1.59 E2E tests
npx playwright test --ui       # Playwright UI mode with Timeline
npm run lint                   # ESLint

# Deployment
npm run build                  # Production build (Turbopack)
npx vercel --prod              # Deploy to Vercel
```

---

## Risk Areas & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Payment onboarding friction | Sellers abandon setup | Most sellers already have Whish wallets — minimal friction. Tap onboarding uses Business API with KYC. Clear progress indicators |
| COD fake orders | Wasted shipping on no-shows | Optional small Whish/Tap deposit at checkout, buyer reputation scoring, COD limit for new accounts |
| LBP currency volatility | Price confusion | Default to USD pricing, display LBP equivalent at live rate, update rate frequently |
| Stock race conditions | Overselling on flash deals | Use Supabase RPC with `SELECT FOR UPDATE` on stock decrement |
| Search performance at scale | Slow product discovery | Start with pg_trgm, migrate to Meilisearch at ~10k products |
| Image storage costs | Growing costs with many sellers | Enforce max 8 images per product, auto-compress on upload |
| Multi-currency accuracy | Wrong prices shown | Use Stripe's real-time exchange rates, cache for 1 hour |
| Seller fraud | Fake products, non-delivery | Verification tiers, escrow period (hold payout 7 days), dispute system |
| RLS policy gaps | Data leakage between sellers | Automated RLS tests, security audit before launch |

---

## Post-Launch Roadmap

| Feature | Priority | Phase |
|---------|----------|-------|
| Mobile app (React Native / Expo) | High | v2 |
| AI-powered product recommendations | Medium | v2 |
| Seller advertising / promoted listings | High | v2 |
| Affiliate program | Medium | v2 |
| Bulk import/export (CSV) for sellers | Medium | v2 |
| Advanced analytics dashboard | Medium | v2 |
| Dispute resolution system | High | v2 |
| Coupon / voucher system | Medium | v2 |
| Product Q&A section | Low | v3 |
| Live shopping / livestream | Low | v3 |
| Loyalty points program | Low | v3 |
