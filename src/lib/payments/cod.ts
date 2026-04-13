import type { PaymentResult } from "@/types/order";

export async function processCOD(): Promise<PaymentResult> {
  // COD requires no payment processing at checkout.
  // Payment is collected on delivery and confirmed via /api/cod/confirm
  return { success: true, paymentRefId: `COD-${Date.now()}` };
}
