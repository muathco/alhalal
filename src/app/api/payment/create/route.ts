import { NextResponse } from "next/server";

const MOYASAR_API = "https://api.moyasar.com/v1";

export async function POST(request: Request) {
  const body = await request.json();
  const { amount_sar, order_number, order_id, source } = body as {
    amount_sar: number;
    order_number: string;
    order_id: string;
    source: { type: "creditcard" | "stcpay" | "applepay" };
  };

  if (!amount_sar || !order_number || !order_id) {
    return NextResponse.json({ error: "بيانات الطلب غير مكتملة" }, { status: 400 });
  }

  const secretKey = process.env.MOYASAR_SECRET_KEY;
  if (!secretKey || secretKey.includes("placeholder")) {
    // Sandbox key غير مفعّل بعد — نحاكي نجاح الدفع لإكمال تجربة المستخدم في بيئة التطوير
    return NextResponse.json({ status: "paid", id: `sandbox_${order_id}`, simulated: true });
  }

  const response = await fetch(`${MOYASAR_API}/payments`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: Math.round(amount_sar * 100),
      currency: "SAR",
      description: `طلب الحلال #${order_number}`,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/callback?order_id=${order_id}`,
      source: source ?? { type: "creditcard" },
      metadata: { order_id, order_number },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    return NextResponse.json({ error: data.message ?? "تعذّر إنشاء عملية الدفع" }, { status: response.status });
  }

  return NextResponse.json(data);
}
