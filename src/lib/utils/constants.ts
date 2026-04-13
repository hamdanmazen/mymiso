export const APP_NAME = "Mymiso";
export const APP_TAGLINE = "Sell Fast. Shop Better.";

export const CURRENCIES = ["USD", "LBP"] as const;
export const DEFAULT_CURRENCY = "USD";

export const LANGUAGES = ["en", "ar"] as const;
export const DEFAULT_LANGUAGE = "en";

export const USER_ROLES = ["buyer", "seller", "both"] as const;

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;

export const PAYMENT_METHODS = ["whish", "tap", "cod"] as const;

export const PRODUCT_GRID_GAPS = 12; // px — tight marketplace spacing

export const BREAKPOINTS = {
  mobileS: 375,
  mobile: 640,
  tablet: 1024,
  desktop: 1400,
} as const;

export const PRODUCT_COLUMNS = {
  mobileS: 1,
  mobile: 2,
  tablet: 3,
  desktop: 4,
  largeDesktop: 5,
} as const;

export const LOW_STOCK_THRESHOLD = 5;
