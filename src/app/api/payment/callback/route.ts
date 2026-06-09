import { NextResponse } from "next/server";

// Webhook استقبال نتيجة الدفع من Moyasar — يحدّث orders.payment_status إلى 'paid'
// عند status = 'paid' (يتطلب ربط service-role client بقاعدة البيانات الفعلية)
export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("order_id");
  const status = url.searchParams.get("status");

  const redirectTo = new URL(`/tracking/${orderId ?? ""}`, process.env.NEXT_PUBLIC_BASE_URL);
  redirectTo.searchParams.set("payment", status === "paid" ? "success" : "failed");

  return NextResponse.redirect(redirectTo);
}
