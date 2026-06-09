import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    order_id,
    order_number,
    animal_id,
    farm_id,
    delivery_type,
    slaughter_type,
    delivery_address,
    delivery_date,
    subtotal_sar,
    service_fee_sar,
    total_sar,
    payment_method,
  } = body;

  if (!order_id || !animal_id || !farm_id) {
    return NextResponse.json({ error: "بيانات الطلب غير مكتملة" }, { status: 400 });
  }

  // استخدم الـ session الحالي للمستخدم
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      id: order_id,
      order_number,
      buyer_id: user.id,
      animal_id,
      farm_id,
      delivery_type: delivery_type ?? "slaughtered",
      slaughter_type: slaughter_type ?? null,
      delivery_address: delivery_address ?? "",
      delivery_date: delivery_date ?? null,
      status: "pending",
      subtotal_sar: subtotal_sar ?? 0,
      service_fee_sar: service_fee_sar ?? 0,
      total_sar: total_sar ?? subtotal_sar ?? 0,
      payment_status: "pending",
      payment_method: payment_method ?? "card",
    })
    .select()
    .single();

  if (error) {
    // لا نُفشل العملية لو DB غير متوفرة — نُعيد success للسماح بتجربة المستخدم
    console.error("order insert error:", error.message);
    return NextResponse.json({ id: order_id, order_number, db_saved: false });
  }

  return NextResponse.json({ id: order.id, order_number: order.order_number, db_saved: true });
}
