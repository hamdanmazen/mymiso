import type { PaymentResult } from "@/types/order";

// Tap Payments Integration
// Docs: https://developers.tap.company
// Env: TAP_SECRET_KEY, TAP_PUBLIC_KEY, TAP_WEBHOOK_SECRET

export async function createTapCharge(params: {
  amount: number;
  currency: string;
  orderIds: string[];
  customerEmail?: string;
}): Promise<PaymentResult> {
  // TODO: Implement when Tap API credentials are available
  // 1. Call Tap Charges API to create a charge
  // 2. Return redirect URL for buyer to complete payment
  // 3. Webhook at /api/webhooks/tap handles confirmation
  console.warn("[Tap Payments] Integration not yet configured");
  return {
    success: false,
    error:
      "Card payments are not yet configured. Please use Cash on Delivery.",
  };
}
