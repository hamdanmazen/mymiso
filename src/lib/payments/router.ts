import type { PaymentResult } from "@/types/order";
import { processCOD } from "./cod";
import { createWhishCharge } from "./whish";
import { createTapCharge } from "./tap-client";

export async function processPayment(
  method: "whish" | "tap" | "cod",
  orderIds: string[],
  totalAmount: number,
  currency: string
): Promise<PaymentResult> {
  switch (method) {
    case "cod":
      return processCOD();
    case "whish":
      return createWhishCharge({
        amount: totalAmount,
        currency,
        orderIds,
      });
    case "tap":
      return createTapCharge({
        amount: totalAmount,
        currency,
        orderIds,
      });
    default:
      return { success: false, error: "Unknown payment method" };
  }
}
