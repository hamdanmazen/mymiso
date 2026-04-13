# Mymizo Design System

## 1. Visual Theme & Atmosphere

Mymizo is a multi-vendor marketplace built on the principle that product discovery should feel cinematic, not cluttered. Where competitors like AliExpress drown users in visual noise, Mymizo uses a dark-first, content-forward approach inspired by Shopify's cinematic design language -- but tuned for a marketplace where thousands of sellers compete for attention on the same stage.

The foundation is a deep charcoal canvas (`#0f1114`) that lets product photography become the primary color in any layout. Against this darkness, a restrained set of brand colors drawn from the Mymizo tile logo -- a muted coral-red (`#c0392b`), a calming teal (`#5f9ea0`), a sage green (`#6b8e6b`), and a warm cream (`#d4c5a0`) -- create a palette that feels grounded and trustworthy, not screaming for attention. The wordmark's deep navy (`#2c3e50`) appears as a secondary heading color in light-mode contexts, while pure white (`#f5f5f5`) serves as the primary text color on dark surfaces.

Typography uses `Inter` as the primary typeface -- a variable font that renders crisply at every size from 10px micro labels to 56px hero headlines. At display sizes, Inter runs at weight 600 with tight negative tracking, creating dense, confident headlines. Body text uses weight 400 at comfortable line heights for long product descriptions and reviews. The system avoids decorative or serif fonts entirely -- this is a transactional platform where clarity drives conversion.

The shadow system uses brand-tinted shadows with a subtle teal undertone (`rgba(95,158,160,0.15)`) that echoes the logo's teal tile. This creates elevation that feels atmospheric and on-brand rather than generic. Cards lift off the dark canvas with multi-layer shadows that create a sense of floating product displays -- like merchandise spotlit in a premium showroom.

**Key Characteristics:**
- Dark-first canvas (`#0f1114`) with product photography as the primary color source
- Inter variable font at weight 600 for headlines, 400 for body -- clean, transactional, universal
- Negative letter-spacing at display sizes (-1.2px at 56px, progressive relaxation downward)
- Teal-tinted multi-layer shadows using `rgba(95,158,160,0.15)` -- elevation that feels brand-colored
- Muted coral-red (`#c0392b`) as the primary action color -- urgency without aggression
- Conservative border-radius (6px-12px) -- modern and friendly without being childish
- Four-tile brand palette (red, teal, green, cream) used sparingly for category coding and accents
- Light mode available as an alternate surface (`#ffffff`) with dark text for accessibility preference

## 2. Color Palette & Roles

### Primary Brand (from logo tiles)
- **Mizo Red** (`#c0392b`): Primary CTA color, flash deal badges, urgency indicators, "Add to Cart" and "Buy Now" buttons. The dominant tile in the logo -- assertive but not aggressive.
- **Mizo Teal** (`#5f9ea0`): Secondary accent, seller verification badges, shipping indicators, links, info states. The calming counterpoint to red -- signals trust and reliability.
- **Mizo Sage** (`#6b8e6b`): Success states, in-stock indicators, eco/sustainability badges, positive reviews. Organic, grounded, growth.
- **Mizo Cream** (`#d4c5a0`): Highlight backgrounds, featured seller badges, premium tier indicators, warm surface tints. Warmth without weight.

### Dark Mode Surfaces (Primary)
- **Canvas** (`#0f1114`): Primary page background. Near-black with a cool blue undertone.
- **Surface Raised** (`#1a1d21`): Card backgrounds, product tiles, elevated containers.
- **Surface Overlay** (`#22262b`): Dropdowns, modals, popovers, sidepanels.
- **Surface Subtle** (`#2a2f36`): Hover states on dark surfaces, active tabs, selected items.
- **Surface Input** (`#161a1e`): Form field backgrounds, search bar fill.

### Light Mode Surfaces (Alternate)
- **Canvas Light** (`#ffffff`): Light mode page background.
- **Surface Light** (`#f7f8fa`): Light mode card backgrounds, alternate section fill.
- **Surface Light Hover** (`#eef0f3`): Light mode hover states.

### Text Colors
- **Text Primary** (`#f5f5f5`): Main text on dark surfaces. Not pure white -- softened to reduce eye strain.
- **Text Secondary** (`#9ca3af`): Descriptions, captions, metadata on dark surfaces.
- **Text Muted** (`#6b7280`): Placeholder text, disabled labels, tertiary information.
- **Text Dark Primary** (`#1a1a2e`): Main text on light surfaces. Deep indigo-black, not pure black.
- **Text Dark Secondary** (`#4b5563`): Secondary text on light surfaces.

### Interactive States
- **Red Default** (`#c0392b`): Primary button background, active links.
- **Red Hover** (`#a93226`): Darkened red for hover on primary actions.
- **Red Pressed** (`#922b21`): Even darker for pressed/active state.
- **Red Subtle** (`rgba(192,57,43,0.12)`): Subtle red background for badges, notifications.
- **Teal Default** (`#5f9ea0`): Secondary interactive color, link text.
- **Teal Hover** (`#528b8d`): Darkened teal for hover states.
- **Teal Subtle** (`rgba(95,158,160,0.12)`): Subtle teal background for info badges.

### Semantic Colors
- **Success** (`#22c55e`): Order confirmed, payment successful, item in stock.
- **Success Subtle** (`rgba(34,197,94,0.12)`): Success badge backgrounds.
- **Warning** (`#f59e0b`): Low stock, shipping delays, pending verification.
- **Warning Subtle** (`rgba(245,158,11,0.12)`): Warning badge backgrounds.
- **Error** (`#ef4444`): Payment failed, out of stock, form validation errors.
- **Error Subtle** (`rgba(239,68,68,0.12)`): Error badge backgrounds.
- **Info** (`#5f9ea0`): Aliases to Mizo Teal for informational states.

### Borders
- **Border Default** (`#2a2f36`): Standard border on dark surfaces.
- **Border Subtle** (`#1f2328`): Minimal separation lines, dividers within cards.
- **Border Focus** (`#5f9ea0`): Focus ring color for accessibility (teal, not red -- calmer).
- **Border Light** (`#e5e7eb`): Standard border on light surfaces.
- **Border Active** (`#c0392b`): Active/selected state borders on filters, tabs.

### Shadow Colors
- **Shadow Teal** (`rgba(95,158,160,0.15)`): Brand-tinted primary shadow.
- **Shadow Dark** (`rgba(0,0,0,0.4)`): Deep shadow for elevated dark-mode elements.
- **Shadow Ambient** (`rgba(0,0,0,0.2)`): Soft ambient shadow for subtle lift.
- **Shadow Light** (`rgba(0,0,0,0.08)`): Minimal shadow for light-mode surfaces.

## 3. Typography Rules

### Font Family
- **Primary**: `Inter`, with fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Monospace**: `"JetBrains Mono", "Fira Code", monospace` (used for prices, order numbers, tracking codes)
- **Variable Font Features**: `font-feature-settings: "cv01", "cv02"` for alternate character forms; `"tnum"` for tabular numbers on prices, quantities, and financial data.

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display Hero | Inter | 56px (3.50rem) | 700 | 1.05 | -1.2px | Homepage hero, mega sale banners |
| Display Large | Inter | 48px (3.00rem) | 700 | 1.10 | -0.96px | Section heroes ("Flash Deals", "Best Sellers") |
| Section Heading | Inter | 32px (2.00rem) | 600 | 1.15 | -0.64px | Category titles, dashboard sections |
| Card Title Large | Inter | 24px (1.50rem) | 600 | 1.20 | -0.36px | Featured product names, seller names |
| Card Title | Inter | 18px (1.13rem) | 600 | 1.25 | -0.18px | Standard product card titles |
| Body Large | Inter | 16px (1.00rem) | 400 | 1.55 | normal | Product descriptions, review text |
| Body | Inter | 14px (0.88rem) | 400 | 1.50 | normal | Standard reading text, form labels |
| Body Small | Inter | 13px (0.81rem) | 400 | 1.45 | normal | Secondary descriptions, metadata |
| Price Display | Inter | 24px (1.50rem) | 700 | 1.00 | -0.24px | Main product price (uses `tnum`) |
| Price Original | Inter | 16px (1.00rem) | 400 | 1.00 | normal | Strikethrough original price (uses `tnum`) |
| Price Discount | Inter | 14px (0.88rem) | 600 | 1.00 | normal | Discount percentage badge text |
| Button | Inter | 15px (0.94rem) | 600 | 1.00 | 0.01em | Button labels |
| Button Small | Inter | 13px (0.81rem) | 600 | 1.00 | 0.01em | Compact buttons, filter pills |
| Navigation | Inter | 14px (0.88rem) | 500 | 1.00 | normal | Top nav links, breadcrumbs |
| Caption | Inter | 12px (0.75rem) | 500 | 1.35 | normal | Timestamps, seller ratings, shipping labels |
| Micro | Inter | 11px (0.69rem) | 500 | 1.20 | 0.02em | Tiny labels, badge text, stock count |
| Order Number | JetBrains Mono | 13px (0.81rem) | 500 | 1.00 | 0.05em | Order IDs, tracking numbers |

### Principles
- **Weight 600-700 for headlines**: Mymizo uses bold, confident headlines that compete for attention in a marketplace context. Unlike editorial sites, product titles need to be scannable at speed.
- **Weight 400 for body**: Clean, comfortable reading weight for product descriptions and reviews where users need to absorb detail.
- **Tabular numbers everywhere prices appear**: `"tnum"` is mandatory for all price displays, quantities, ratings counts, and order data. Misaligned decimal points kill trust in a transactional context.
- **Progressive tracking**: Letter-spacing tightens with size: -1.2px at 56px, -0.96px at 48px, -0.64px at 32px, normal at 16px and below.
- **Monospace for transactional data**: Order numbers, tracking codes, and coupon codes use `JetBrains Mono` to signal "this is system data you might need to copy."

## 4. Component Stylings

### Buttons

**Primary (Red CTA)**
- Background: `#c0392b`
- Text: `#ffffff`
- Padding: 12px 24px
- Radius: 8px
- Font: 15px Inter weight 600, letter-spacing 0.01em
- Hover: `#a93226` background
- Pressed: `#922b21` background, scale(0.98)
- Use: "Add to Cart", "Buy Now", "Place Order", "Start Selling"

**Secondary (Teal)**
- Background: `rgba(95,158,160,0.12)`
- Text: `#5f9ea0`
- Padding: 12px 24px
- Radius: 8px
- Border: `1px solid rgba(95,158,160,0.3)`
- Font: 15px Inter weight 600
- Hover: `rgba(95,158,160,0.20)` background
- Use: "Add to Wishlist", "Contact Seller", "View All"

**Ghost (Outline)**
- Background: transparent
- Text: `#f5f5f5` (dark mode) / `#1a1a2e` (light mode)
- Padding: 12px 24px
- Radius: 8px
- Border: `1px solid #2a2f36` (dark) / `1px solid #e5e7eb` (light)
- Hover: `#1a1d21` background (dark) / `#f7f8fa` (light)
- Use: "Cancel", "Back", secondary navigation actions

**Danger**
- Background: `rgba(239,68,68,0.12)`
- Text: `#ef4444`
- Padding: 12px 24px
- Radius: 8px
- Border: `1px solid rgba(239,68,68,0.3)`
- Hover: `rgba(239,68,68,0.20)` background
- Use: "Remove Item", "Delete Listing", "Cancel Order"

### Product Cards
- Background: `#1a1d21` (dark) / `#ffffff` (light)
- Border: `1px solid #2a2f36` (dark) / `1px solid #e5e7eb` (light)
- Radius: 10px
- Shadow (default): `rgba(0,0,0,0.2) 0px 4px 12px`
- Shadow (hover): `rgba(95,158,160,0.15) 0px 12px 32px -8px, rgba(0,0,0,0.3) 0px 8px 16px -4px`
- Hover: translateY(-2px) transition, shadow elevation increase
- Image container: top section, radius `10px 10px 0 0`, overflow hidden
- Image hover: scale(1.05) with 300ms ease transition
- Price: `#c0392b` for sale price, `#6b7280` with line-through for original
- Discount badge: `#c0392b` background, white text, 6px radius, positioned top-right of image
- Rating stars: `#f59e0b` fill, `#6b7280` empty
- Seller name: `#5f9ea0` text, 12px caption weight 500
- Free shipping badge: `#22c55e` text, `rgba(34,197,94,0.12)` background

### Cards & Containers (General)
- Background: `#1a1d21` (dark) / `#ffffff` (light)
- Border: `1px solid #2a2f36` (dark) / `1px solid #e5e7eb` (light)
- Radius: 10px (standard), 12px (featured/large), 8px (compact)
- Shadow: `rgba(0,0,0,0.2) 0px 4px 12px`
- Padding: 16px (compact), 20px (standard), 24px (spacious)

### Badges & Tags

**Flash Deal Badge**
- Background: `#c0392b`
- Text: `#ffffff`
- Padding: 4px 10px
- Radius: 6px
- Font: 11px Inter weight 700, uppercase, letter-spacing 0.05em
- Animation: subtle pulse (opacity 0.9 to 1.0, 2s loop) for active deals

**Discount Percentage**
- Background: `#c0392b`
- Text: `#ffffff`
- Padding: 2px 8px
- Radius: 4px
- Font: 13px Inter weight 700

**Seller Verified**
- Background: `rgba(95,158,160,0.12)`
- Text: `#5f9ea0`
- Padding: 3px 8px
- Radius: 6px
- Font: 11px Inter weight 600
- Icon: checkmark circle, 12px, inline before text

**Free Shipping**
- Background: `rgba(34,197,94,0.12)`
- Text: `#22c55e`
- Padding: 3px 8px
- Radius: 6px
- Font: 11px Inter weight 600

**Category Tag**
- Background: `rgba(212,197,160,0.12)` (cream subtle)
- Text: `#d4c5a0`
- Padding: 4px 12px
- Radius: 20px (pill shape -- exception to conservative radius for tags only)
- Font: 12px Inter weight 500

### Inputs & Forms
- Background: `#161a1e` (dark) / `#ffffff` (light)
- Border: `1px solid #2a2f36` (dark) / `1px solid #e5e7eb` (light)
- Radius: 8px
- Padding: 12px 16px
- Focus: `1px solid #5f9ea0`, `0 0 0 3px rgba(95,158,160,0.2)` ring
- Label: `#9ca3af` (dark) / `#4b5563` (light), 13px Inter weight 500, margin-bottom 6px
- Text: `#f5f5f5` (dark) / `#1a1a2e` (light)
- Placeholder: `#6b7280`
- Error: `1px solid #ef4444`, error text `#ef4444` below input at 12px

**Search Bar (Hero Component)**
- Background: `#1a1d21` (dark) / `#ffffff` (light)
- Border: `2px solid #2a2f36` (dark) / `2px solid #e5e7eb` (light)
- Radius: 12px
- Height: 52px
- Padding: 12px 20px
- Focus: `2px solid #5f9ea0`
- Search icon: `#6b7280`, 20px, left-aligned
- Clear button: `#6b7280`, appears when input has value
- Search submit: `#c0392b` background, white icon, 40px square, right-aligned inside input, 8px radius

### Navigation

**Top Navigation Bar**
- Background: `#0f1114` with `backdrop-filter: blur(12px)` when scrolled
- Height: 64px
- Border-bottom: `1px solid #1f2328`
- Logo: left-aligned, Mymizo wordmark + tile icon
- Search bar: center, 40% width on desktop, expanding on focus
- Right section: Cart icon (with red badge count), User avatar/login, language/currency selector
- Links: 14px Inter weight 500, `#9ca3af` default, `#f5f5f5` hover
- Active link: `#f5f5f5` text, `2px solid #c0392b` bottom border

**Category Navigation (Sub-nav)**
- Background: `#1a1d21`
- Height: 48px
- Horizontal scroll on mobile, full display on desktop
- Items: 13px Inter weight 500, `#9ca3af` text
- Hover: `#f5f5f5` text
- Active: `#f5f5f5` text, bottom border `2px solid #c0392b`
- Icons: 18px, inline before text, `#6b7280` default, `#f5f5f5` active

### Banner Carousel
- Full-width container, max-height 400px on desktop, 200px on mobile
- Radius: 0 (full bleed) or 12px (if contained in content area)
- Navigation dots: 8px circles, `#6b7280` default, `#c0392b` active
- Arrow buttons: 40px circle, `rgba(0,0,0,0.5)` background, white icon, appear on hover
- Transition: 400ms ease slide
- Auto-advance: 5 second interval, pauses on hover

### Star Rating Component
- Filled star: `#f59e0b` (amber/gold)
- Empty star: `#2a2f36` (dark) / `#e5e7eb` (light)
- Half star: gradient fill from `#f59e0b` to empty
- Size: 14px (card), 18px (product detail), 12px (compact)
- Rating number: `#f5f5f5`, Inter weight 600, inline after stars
- Review count: `#6b7280`, Inter weight 400, inline in parentheses

### Tabs
- Background: transparent
- Tab text: 14px Inter weight 500, `#6b7280` default
- Active tab: `#f5f5f5` text, `2px solid #c0392b` bottom border
- Hover: `#9ca3af` text
- Spacing: 24px gap between tabs
- Use: Product detail tabs (Description, Reviews, Seller Info, Shipping)

## 5. Layout Principles

### Spacing System
- Base unit: 4px
- Scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px
- Compact marketplace spacing: 8px between product cards in grid, 16px section padding, 12px internal card padding
- The scale is dense at the small end to accommodate the high information density of marketplace listings

### Grid & Container
- Max content width: 1400px (wider than editorial sites -- marketplace needs more columns)
- Product grid: 5 columns on large desktop, 4 on desktop, 3 on tablet, 2 on mobile
- Gap: 12px between product cards (tight for maximum product visibility)
- Side padding: 24px (desktop), 16px (tablet), 12px (mobile)
- Homepage sections: full-width backgrounds, content within 1400px container
- Seller dashboard: 240px fixed sidebar + fluid content area

### Content Density Strategy
- **Homepage**: Medium density -- large hero banner, then progressively denser product grids
- **Product listing**: High density -- maximize products visible above the fold, minimal chrome
- **Product detail**: Medium-low density -- generous image gallery, clear price hierarchy, spacious review section
- **Dashboard**: High density -- tables, charts, order lists with compact spacing
- **Checkout**: Low density -- generous whitespace, focused single-column flow to reduce abandonment

### Whitespace Philosophy
- **Product-first negative space**: Whitespace exists to frame products, not to create empty aesthetic. Every pixel of space should make a product image or price more scannable.
- **Section rhythm**: Dark canvas sections alternate with slightly elevated surface sections (`#1a1d21`), creating depth through surface color rather than excessive spacing.
- **Horizontal density, vertical breathing**: Product grids are tight horizontally (12px gaps) but sections have generous vertical spacing (48px-64px between sections) to create clear content blocks.

### Border Radius Scale
- Compact (4px): Discount badges, tiny tags
- Standard (6px): Badges, pills, small buttons
- Comfortable (8px): Buttons, inputs, compact cards
- Spacious (10px): Standard product cards, containers
- Large (12px): Featured cards, modals, search bar, banners
- Pill (20px): Category tags only -- exception to the conservative approach
- Circle (50%): Avatars, icon buttons, notification dots

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow | Page canvas, inline content |
| Subtle (Level 1) | `rgba(0,0,0,0.15) 0px 2px 8px` | Resting product cards, list items |
| Standard (Level 2) | `rgba(0,0,0,0.2) 0px 4px 12px` | Hovered cards, active containers |
| Elevated (Level 3) | `rgba(95,158,160,0.15) 0px 12px 32px -8px, rgba(0,0,0,0.3) 0px 8px 16px -4px` | Featured products, dropdowns, popovers |
| Floating (Level 4) | `rgba(95,158,160,0.2) 0px 20px 48px -12px, rgba(0,0,0,0.4) 0px 12px 24px -8px` | Modals, lightboxes, image zoom overlay |
| Focus Ring | `0 0 0 3px rgba(95,158,160,0.3)` | Keyboard focus indication |

**Shadow Philosophy**: Mymizo's shadow system uses teal-tinted shadows (`rgba(95,158,160,...)`) as the brand layer, paired with neutral dark shadows for depth reinforcement. On the dark canvas, shadows are primarily used to lift content into the foreground -- the color contrast between `#0f1114` (canvas) and `#1a1d21` (surface) handles most of the visual hierarchy. Shadows become more prominent on hover and for floating elements, where they create a "product spotlight" effect that draws attention to the item being interacted with.

### Surface Elevation (Dark Mode)
- Level 0: `#0f1114` -- page canvas
- Level 1: `#1a1d21` -- primary card surface
- Level 2: `#22262b` -- overlays, dropdowns
- Level 3: `#2a2f36` -- modals, active states

The dark mode elevation system relies more on surface color progression than shadows. Each level steps up in lightness by approximately 6-8 points, creating a clear spatial hierarchy through tone rather than drop shadows alone.

## 7. Do's and Don'ts

### Do
- Use the dark canvas (`#0f1114`) as the primary background -- let product images provide the color
- Use `#c0392b` (Mizo Red) exclusively for primary purchase actions -- "Add to Cart", "Buy Now", flash deals
- Use `#5f9ea0` (Mizo Teal) for trust signals -- verified sellers, secure payment, links
- Apply `"tnum"` (tabular numbers) on all price displays, quantities, and financial data
- Keep product card spacing tight (12px gap) to maximize visible inventory
- Use the four logo tile colors for category coding in a consistent, systematic way
- Maintain a clear price hierarchy: sale price large and red, original price smaller and strikethrough
- Use `Inter` variable font with the `"cv01"` alternate characters for a distinctive look
- Provide both dark and light mode -- respect user preference via `prefers-color-scheme`
- Use skeleton loading states (animated pulse on `#1a1d21` to `#22262b`) for product cards

### Don't
- Don't use red for non-purchase interactive elements -- red means "buy" or "deal" in this system
- Don't use pure black (`#000000`) for text -- `#f5f5f5` on dark, `#1a1a2e` on light
- Don't use large border-radius (16px+) on product cards -- 10px max keeps the grid tight and professional
- Don't crowd product titles with more than 2 lines -- truncate with ellipsis at line 2
- Don't use the brand tile colors (red, teal, sage, cream) for large surfaces -- they're accents only
- Don't put more than one animated/pulsing element per viewport -- flash deal badges pulse, nothing else should
- Don't hide prices behind clicks -- price and discount must be visible on the product card surface
- Don't use light gray text smaller than 12px on dark surfaces -- accessibility minimum
- Don't auto-play video on product cards -- still images with hover-to-second-image only
- Don't use horizontal scrolling for product grids on desktop -- grid wraps, carousel only for curated sections

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Columns | Key Changes |
|------|-------|---------|-------------|
| Mobile S | <375px | 1 | Single column products, stacked everything |
| Mobile | 375-639px | 2 | 2-column product grid, bottom tab navigation |
| Tablet | 640-1023px | 3 | 3-column grid, side filters as drawer |
| Desktop | 1024-1399px | 4 | Full nav, sidebar filters, 4-column grid |
| Large Desktop | >=1400px | 5 | Maximum density, 5-column grid, all panels visible |

### Touch Targets
- All interactive elements: minimum 44px touch target (iOS HIG)
- Product cards: entire card is tappable, not just the title
- Filter checkboxes: 44px row height with full-row tap area
- Star rating input: each star has 44px tap zone
- Quantity stepper: +/- buttons are 44px squares
- Bottom navigation (mobile): 56px bar height, icons 24px with 44px touch area

### Navigation Strategy
- **Desktop**: Full horizontal top bar with search, categories sub-nav, all controls visible
- **Tablet**: Hamburger for categories, search remains visible, cart/user icons
- **Mobile**: Bottom tab bar (Home, Categories, Cart, Account), top bar simplified to logo + search icon
- Search: Always accessible -- persistent on desktop, expandable icon on mobile

### Collapsing Strategy
- Product grids: 5 → 4 → 3 → 2 columns as viewport narrows
- Product cards: image aspect ratio stays consistent, title truncates earlier on mobile
- Filters sidebar: visible panel on desktop → slide-out drawer on tablet/mobile with "Filter" button
- Banner carousel: 400px → 200px height, content repositions
- Product detail images: horizontal gallery → vertical stack or swipeable carousel
- Price display: maintains size hierarchy, never shrinks below 18px for sale price
- Section headings: 32px → 24px → 20px across breakpoints
- Dashboard sidebar: visible on desktop → collapsible on tablet → bottom sheet on mobile
- Checkout: always single column, padding reduces from 48px → 24px → 16px

### Image Behavior
- Product card images: consistent aspect ratio (1:1 square or 4:3), object-fit: cover
- Product detail gallery: large hero image + thumbnail strip, pinch-to-zoom on mobile
- Lazy loading: all product images below fold use IntersectionObserver
- Placeholder: `#1a1d21` surface with subtle shimmer animation during load
- Hover state (desktop only): crossfade to second product image on card hover

## 9. Agent Prompt Guide

### Quick Color Reference
- Primary CTA / Buy: Mizo Red (`#c0392b`)
- CTA Hover: Red Dark (`#a93226`)
- Secondary / Trust: Mizo Teal (`#5f9ea0`)
- Success / In Stock: Green (`#22c55e`)
- Warning / Low Stock: Amber (`#f59e0b`)
- Error / Out of Stock: Red (`#ef4444`)
- Page background (dark): Canvas (`#0f1114`)
- Card surface (dark): Surface (`#1a1d21`)
- Primary text (dark): Near-white (`#f5f5f5`)
- Secondary text (dark): Gray (`#9ca3af`)
- Muted text: Dark gray (`#6b7280`)
- Border (dark): Charcoal (`#2a2f36`)
- Price sale: Mizo Red (`#c0392b`)
- Price original: Muted (`#6b7280`) with line-through
- Star rating: Amber (`#f59e0b`)
- Seller verified: Mizo Teal (`#5f9ea0`)
- Category accent: Mizo Cream (`#d4c5a0`)

### Example Component Prompts
- "Create a product card on `#1a1d21` surface, `1px solid #2a2f36` border, 10px radius. Product image top (1:1 ratio, overflow hidden, `10px 10px 0 0` radius). Discount badge top-right: `#c0392b` bg, white text, 11px Inter bold. Title: 18px Inter weight 600, `#f5f5f5`, max 2 lines truncate. Price: 24px Inter weight 700, `#c0392b`, font-feature-settings `tnum`. Original price: 16px `#6b7280` line-through next to it. Stars: 14px amber `#f59e0b`. Seller: 12px `#5f9ea0`. Shadow default `rgba(0,0,0,0.2) 0px 4px 12px`, hover translateY(-2px) with `rgba(95,158,160,0.15) 0px 12px 32px -8px`."
- "Create the top navbar: `#0f1114` bg, 64px height, `1px solid #1f2328` bottom border. Logo left. Search bar center: `#1a1d21` bg, `2px solid #2a2f36` border, 12px radius, 52px height, search icon `#6b7280` left, red submit button right. Right side: cart icon with red dot badge, user avatar. Links 14px Inter weight 500, `#9ca3af`."
- "Build a flash deal section: Section heading 32px Inter weight 600, `#f5f5f5`, letter-spacing -0.64px. Countdown timer: `#c0392b` bg, white text, 11px Inter bold, colon-separated HH:MM:SS. Product grid: 12px gap, cards with pulsing `#c0392b` 'FLASH DEAL' badge."
- "Design the Add to Cart button: `#c0392b` bg, `#ffffff` text, 15px Inter weight 600, 12px 24px padding, 8px radius. Hover `#a93226`. Active scale(0.98). Full width on product detail page."
- "Create seller verification badge: `rgba(95,158,160,0.12)` bg, `#5f9ea0` text, 11px Inter weight 600, 3px 8px padding, 6px radius. Checkmark icon 12px inline before text 'Verified Seller'."
- "Build the filter sidebar: `#1a1d21` bg, 280px width, `1px solid #2a2f36` right border. Section titles: 14px Inter weight 600, `#f5f5f5`. Checkbox items: 14px Inter weight 400, `#9ca3af`, 44px row height. Price range slider: track `#2a2f36`, fill `#5f9ea0`, thumb 16px circle `#5f9ea0`. Apply button: `#c0392b` bg, full width."

### Iteration Guide
1. Always start with the dark canvas (`#0f1114`) -- Mymizo is dark-first
2. Product images are the primary color -- keep UI chrome neutral and dark
3. Red (`#c0392b`) = purchase intent. Teal (`#5f9ea0`) = trust/info. Never swap these roles
4. Use `"tnum"` for every number that appears near another number (prices, ratings, quantities)
5. Shadow formula: `rgba(95,158,160,0.15) 0px Y1 B1 -S1, rgba(0,0,0,0.3) 0px Y2 B2 -S2` for featured; plain `rgba(0,0,0,0.2) 0px 4px 12px` for resting
6. Product card grids use 12px gap -- tighter than most systems, intentional for marketplace density
7. Respect the 44px minimum touch target on every interactive element
8. The four logo colors (red, teal, sage, cream) can be used for category coding -- assign consistently
9. Skeleton loading states use animated `#1a1d21` → `#22262b` pulse for all async content
10. When in doubt, reference Shopify's cinematic approach: dark, photography-forward, typographically precise
