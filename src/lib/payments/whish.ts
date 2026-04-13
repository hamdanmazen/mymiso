import type { PaymentResult } from "@/types/order";

// Whish Pay Integration
// Docs: https://whish.money/developers
// Env: WHISH_MERCHANT_ID, WHISH_API_KEY, WHISH_WEBHOOK_SECRET

export async function createWhishCharge(params: {
  amount: number;
  currency: string;
  orderIds: string[];
  buyerPhone?: string;
}): Promise<PaymentResult> {
  // TODO: Implement when Whish API credentials are available
  // 1. Call Whish Pay API to create a charge
  // 2. Return redirect URL for buyer to complete payment
  // 3. Webhook at /api/webhooks/whish handles confirmation
  console.warn("[Whish Pay] Integration not yet configured");
  return {
    success: false,
    error:
      "Whish Pay is not yet configured. Please use Cash on Delivery.",
  };
}
