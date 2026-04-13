import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // TODO: Verify webhook signature using WHISH_WEBHOOK_SECRET
  // TODO: Parse Whish webhook payload
  // TODO: Update order status based on payment event (confirmed/failed)
  // TODO: Send notifications to buyer
  console.warn("[Whish Webhook] Not yet implemented");
  return NextResponse.json({ received: true });
}
