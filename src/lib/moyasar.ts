import type { Order } from "@/types";

const MOYASAR_API = "https://api.moyasar.com/v1";

export async function createPayment(order: Order) {
  const response = await fetch(`${MOYASAR_API}/payments`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.MOYASAR_SECRET_KEY!}:`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: Math.round(order.total_sar * 100), // halalas
      currency: "SAR",
      description: `طلب الحلال #${order.order_number}`,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/callback`,
      source: { type: "creditcard" }, // or stcpay, applepay
      metadata: { order_id: order.id },
    }),
  });
  return response.json();
}
