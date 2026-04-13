import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // TODO: Verify webhook signature using TAP_WEBHOOK_SECRET
  // TODO: Parse Tap webhook payload
  // TODO: Update order status based on charge event (captured/failed)
  // TODO: Send notifications to buyer
  console.warn("[Tap Webhook] Not yet implemented");
  return NextResponse.json({ received: true });
}
