import type { Database, Json } from "./database";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type OrderItemRow = Database["public"]["Tables"]["order_items"]["Row"];
type AddressRow = Database["public"]["Tables"]["addresses"]["Row"];

export type OrderWithItems = OrderRow & {
  items: OrderItemRow[];
};

export type OrderSummary = {
  id: string;
  order_number: string;
  status: OrderRow["status"];
  total: number;
  currency: string;
  payment_method: OrderRow["payment_method"];
  item_count: number;
  first_item_thumbnail: string | null;
  first_item_title: string | null;
  created_at: string;
};

export type ShippingOption = {
  id: string;
  label: string;
  price: number;
  estimatedDays: number;
  carrier: string;
};

export type SellerGroup = {
  sellerId: string;
  sellerName: string;
  items: {
    productId: string;
    variantId: string | null;
    quantity: number;
    unitPrice: number;
    title: string;
    thumbnail_url: string | null;
    variantName: string | null;
    shippingFree: boolean;
  }[];
  shippingOptionId: string | null;
  shippingCost: number;
  subtotal: number;
};

export type CheckoutInput = {
  addressId: string;
  paymentMethod: "whish" | "tap" | "cod";
  shippingSelections: Record<string, string>;
  notes?: string;
};

export type PaymentResult = {
  success: boolean;
  paymentRefId?: string;
  redirectUrl?: string;
  error?: string;
};

export type PlaceOrderResult = {
  success?: boolean;
  orderIds?: string[];
  orderNumbers?: string[];
  error?: string;
};

export type { OrderRow, OrderItemRow, AddressRow };
