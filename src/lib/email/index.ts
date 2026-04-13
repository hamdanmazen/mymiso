// Email client wrapper using Resend
// Gracefully skips if RESEND_API_KEY is not configured

export async function sendOrderConfirmation(params: {
  to: string;
  orderNumber: string;
  items: { title: string; quantity: number; price: number }[];
  total: number;
  shippingAddress: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[Email] Resend not configured, skipping email");
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const itemRows = params.items
      .map(
        (item) =>
          `<tr>
        <td style="padding:8px;border-bottom:1px solid #2a2f36">${item.title}</td>
        <td style="padding:8px;border-bottom:1px solid #2a2f36;text-align:center">${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #2a2f36;text-align:right">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
      )
      .join("");

    await resend.emails.send({
      from: "Mymiso <orders@mymiso.com>",
      to: params.to,
      subject: `Order Confirmed - ${params.orderNumber}`,
      html: `
        <div style="font-family:Inter,-apple-system,sans-serif;max-width:600px;margin:0 auto;background:#0f1114;color:#f5f5f5;padding:32px">
          <h1 style="font-size:24px;font-weight:700;margin-bottom:8px">Order Confirmed</h1>
          <p style="color:#9ca3af;font-size:14px;margin-bottom:24px">Order ${params.orderNumber}</p>

          <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
            <thead>
              <tr style="border-bottom:2px solid #2a2f36">
                <th style="padding:8px;text-align:left;font-size:13px;color:#9ca3af">Item</th>
                <th style="padding:8px;text-align:center;font-size:13px;color:#9ca3af">Qty</th>
                <th style="padding:8px;text-align:right;font-size:13px;color:#9ca3af">Total</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>

          <div style="border-top:2px solid #2a2f36;padding-top:16px;margin-bottom:24px">
            <p style="font-size:18px;font-weight:700;text-align:right">Total: $${params.total.toFixed(2)}</p>
          </div>

          <div style="background:#1a1d21;border-radius:8px;padding:16px;margin-bottom:24px">
            <p style="font-size:13px;color:#9ca3af;margin-bottom:4px">Shipping to:</p>
            <p style="font-size:14px">${params.shippingAddress}</p>
          </div>

          <p style="font-size:13px;color:#6b7280;text-align:center">Thank you for shopping with Mymiso!</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("[Email] Failed to send order confirmation:", error);
  }
}

export async function sendOrderStatusUpdate(params: {
  to: string;
  orderNumber: string;
  status: string;
  trackingNumber?: string;
  trackingUrl?: string;
}) {
  if (!process.env.RESEND_API_KEY) return;

  const statusLabels: Record<string, string> = {
    confirmed: "Your order has been confirmed",
    processing: "Your order is being prepared",
    shipped: "Your order has shipped",
    delivered: "Your order has been delivered",
    cancelled: "Your order has been cancelled",
  };

  const subject = statusLabels[params.status] || `Order ${params.orderNumber} updated`;

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const trackingHtml = params.trackingNumber
      ? `<div style="background:#1a1d21;border-radius:8px;padding:16px;margin:16px 0">
          <p style="font-size:13px;color:#9ca3af;margin-bottom:4px">Tracking Number:</p>
          <p style="font-size:14px;font-family:'JetBrains Mono',monospace">${params.trackingNumber}</p>
          ${params.trackingUrl ? `<a href="${params.trackingUrl}" style="color:#5f9ea0;font-size:13px;margin-top:8px;display:inline-block">Track your package</a>` : ""}
        </div>`
      : "";

    await resend.emails.send({
      from: "Mymiso <orders@mymiso.com>",
      to: params.to,
      subject: `${subject} - ${params.orderNumber}`,
      html: `
        <div style="font-family:Inter,-apple-system,sans-serif;max-width:600px;margin:0 auto;background:#0f1114;color:#f5f5f5;padding:32px">
          <h1 style="font-size:24px;font-weight:700;margin-bottom:8px">${subject}</h1>
          <p style="color:#9ca3af;font-size:14px;margin-bottom:24px">Order ${params.orderNumber}</p>
          ${trackingHtml}
          <p style="font-size:13px;color:#6b7280;text-align:center;margin-top:24px">Thank you for shopping with Mymiso!</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("[Email] Failed to send order status update:", error);
  }
}

export async function sendNewMessageNotification(params: {
  to: string;
  senderName: string;
  messagePreview: string;
  conversationUrl: string;
}) {
  if (!process.env.RESEND_API_KEY) return;

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Mymiso <notifications@mymiso.com>",
      to: params.to,
      subject: `New message from ${params.senderName}`,
      html: `
        <div style="font-family:Inter,-apple-system,sans-serif;max-width:600px;margin:0 auto;background:#0f1114;color:#f5f5f5;padding:32px">
          <h1 style="font-size:24px;font-weight:700;margin-bottom:8px">New Message</h1>
          <p style="color:#9ca3af;font-size:14px;margin-bottom:24px">from ${params.senderName}</p>
          <div style="background:#1a1d21;border-radius:8px;padding:16px;margin-bottom:24px">
            <p style="font-size:14px;line-height:1.5">${params.messagePreview}</p>
          </div>
          <a href="${params.conversationUrl}" style="display:inline-block;background:#5f9ea0;color:#fff;padding:12px 24px;border-radius:8px;font-weight:600;font-size:15px;text-decoration:none">Reply to Message</a>
          <p style="font-size:13px;color:#6b7280;text-align:center;margin-top:24px">You received this because you have a conversation on Mymiso.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("[Email] Failed to send message notification:", error);
  }
}

export async function sendNewReviewNotification(params: {
  to: string;
  productTitle: string;
  rating: number;
  reviewerName: string;
  reviewBody?: string;
}) {
  if (!process.env.RESEND_API_KEY) return;

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const stars = "★".repeat(params.rating) + "☆".repeat(5 - params.rating);

    await resend.emails.send({
      from: "Mymiso <notifications@mymiso.com>",
      to: params.to,
      subject: `New ${params.rating}-star review on "${params.productTitle}"`,
      html: `
        <div style="font-family:Inter,-apple-system,sans-serif;max-width:600px;margin:0 auto;background:#0f1114;color:#f5f5f5;padding:32px">
          <h1 style="font-size:24px;font-weight:700;margin-bottom:8px">New Review</h1>
          <p style="color:#9ca3af;font-size:14px;margin-bottom:24px">${params.reviewerName} reviewed "${params.productTitle}"</p>
          <div style="background:#1a1d21;border-radius:8px;padding:16px;margin-bottom:24px">
            <p style="font-size:20px;color:#f59e0b;margin-bottom:8px">${stars}</p>
            ${params.reviewBody ? `<p style="font-size:14px;line-height:1.5">${params.reviewBody.slice(0, 300)}</p>` : ""}
          </div>
          <p style="font-size:13px;color:#6b7280;text-align:center">You can reply to this review from your seller dashboard.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("[Email] Failed to send review notification:", error);
  }
}
