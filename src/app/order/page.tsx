"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const PRICE = 1450;
const FEE_RATE = 0.04;

const DELIVERY_DAYS = [
  { id: "fri", label: "الجمعة", price: 0 },
  { id: "sat", label: "السبت", price: 0 },
  { id: "sun", label: "الأحد", price: 50 },
];

type DeliveryType = "live" | "slaughtered" | "cut";

export default function OrderPage() {
  const [stage, setStage] = useState<"details" | "confirm" | "success">("details");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("slaughtered");
  const [slaughterType, setSlaughterType] = useState<"full" | "half">("full");
  const [day, setDay] = useState(DELIVERY_DAYS[0].id);
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<"mada" | "card" | "applepay">("mada");

  const fee = useMemo(() => Math.round(PRICE * FEE_RATE), []);
  const deliveryFee = DELIVERY_DAYS.find((d) => d.id === day)?.price ?? 0;
  const total = PRICE + fee + deliveryFee;

  const orderNumber = "HL-20260608-0001";

  if (stage === "success") {
    return (
      <main className="mx-auto max-w-lg px-6 py-16 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-red text-2xl text-white">✓</div>
        <h1 className="mb-2 text-2xl font-bold">تم تأكيد طلبك</h1>
        <p className="mb-6 text-brand-gray">رقم طلبك</p>
        <p className="mb-8 text-xl font-bold text-brand-red">{orderNumber}</p>

        <div className="mb-8 rounded-2xl border border-brand-border bg-white p-5 text-right">
          <h3 className="mb-3 font-bold">مراحل الختم القادمة</h3>
          <ul className="space-y-2 text-sm text-brand-gray">
            <li>١. تخصيص الذبيحة</li>
            <li>٢. قبيل الذبح</li>
            <li>٣. بعد الذبح</li>
            <li>٤. التغليف والتوصيل</li>
          </ul>
        </div>

        <Link
          href={`/tracking/${orderNumber}`}
          className="block w-full rounded-xl bg-brand-red py-3.5 text-center text-lg font-bold text-white"
        >
          تتبع طلبي
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 pb-28">
      {/* Progress bar */}
      <div className="mb-8 flex items-center justify-center gap-2 text-sm">
        <span className="font-bold text-brand-red">اختيار ✓</span>
        <span className="text-brand-border">—</span>
        <span className={stage === "details" ? "font-bold text-brand-red" : "text-brand-gray"}>تفاصيل الطلب</span>
        <span className="text-brand-border">—</span>
        <span className={stage === "confirm" ? "font-bold text-brand-red" : "text-brand-gray"}>تأكيد</span>
      </div>

      {stage === "details" && (
        <div className="space-y-6">
          {/* ملخص الذبيحة */}
          <section className="rounded-2xl border border-brand-border bg-white p-5">
            <h3 className="mb-3 font-bold">ملخص الذبيحة المختارة</h3>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 shrink-0 rounded-lg bg-brand-off" />
              <div>
                <p className="font-bold">خروف نجدي — حضيرة الوادي الأخضر</p>
                <p className="text-sm text-brand-gray">الوزن: ١٨ كجم · {PRICE} ر.س</p>
              </div>
            </div>
          </section>

          {/* نوع التسليم */}
          <section className="rounded-2xl border border-brand-border bg-white p-5">
            <h3 className="mb-3 font-bold">نوع التسليم</h3>
            <div className="grid grid-cols-3 gap-3">
              {([
                { id: "live", label: "حي" },
                { id: "slaughtered", label: "مذبوح" },
                { id: "cut", label: "مقطّع" },
              ] as const).map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDeliveryType(d.id)}
                  className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                    deliveryType === d.id ? "border-brand-red bg-brand-red text-white" : "border-brand-border text-brand-gray"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </section>

          {/* طريقة السلخ */}
          {deliveryType !== "live" && (
            <section className="rounded-2xl border border-brand-border bg-white p-5">
              <h3 className="mb-3 font-bold">طريقة السلخ</h3>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { id: "full", label: "كامل" },
                  { id: "half", label: "نصف" },
                ] as const).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSlaughterType(s.id)}
                    className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                      slaughterType === s.id ? "border-brand-red bg-brand-red text-white" : "border-brand-border text-brand-gray"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* موعد التسليم */}
          <section className="rounded-2xl border border-brand-border bg-white p-5">
            <h3 className="mb-3 font-bold">موعد التسليم</h3>
            <div className="grid grid-cols-3 gap-3">
              {DELIVERY_DAYS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDay(d.id)}
                  className={`rounded-xl border px-3 py-3 text-center text-sm font-bold transition ${
                    day === d.id ? "border-brand-red bg-brand-red text-white" : "border-brand-border text-brand-gray"
                  }`}
                >
                  <div>{d.label}</div>
                  <div className="text-xs font-normal opacity-80">{d.price === 0 ? "مجاناً" : `+${d.price} ر.س`}</div>
                </button>
              ))}
            </div>
          </section>

          {/* عنوان التوصيل */}
          <section className="rounded-2xl border border-brand-border bg-white p-5">
            <h3 className="mb-3 font-bold">عنوان التوصيل</h3>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="أدخل عنوان التوصيل بالتفصيل"
              className="w-full rounded-xl border border-brand-border bg-brand-off p-3 text-sm outline-none focus:border-brand-red"
              rows={3}
            />
          </section>

          {/* طريقة الدفع */}
          <section className="rounded-2xl border border-brand-border bg-white p-5">
            <h3 className="mb-3 font-bold">طريقة الدفع</h3>
            <div className="grid grid-cols-3 gap-3">
              {([
                { id: "mada", label: "مدى" },
                { id: "card", label: "بطاقة" },
                { id: "applepay", label: "Apple Pay" },
              ] as const).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPayment(p.id)}
                  className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${
                    payment === p.id ? "border-brand-red bg-brand-red text-white" : "border-brand-border text-brand-gray"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </section>

          {/* ملخص الأسعار */}
          <section className="rounded-2xl border border-brand-border bg-white p-5">
            <h3 className="mb-3 font-bold">ملخص الأسعار</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-brand-gray">سعر الذبيحة</span><span>{PRICE} ر.س</span></div>
              <div className="flex justify-between"><span className="text-brand-gray">رسوم الخدمة (٤٪)</span><span>{fee} ر.س</span></div>
              <div className="flex justify-between"><span className="text-brand-gray">التوصيل</span><span>{deliveryFee === 0 ? "مجاناً" : `${deliveryFee} ر.س`}</span></div>
              <div className="mt-2 flex justify-between border-t border-brand-border pt-2 font-bold"><span>الإجمالي</span><span className="text-brand-red">{total} ر.س</span></div>
            </div>
          </section>

          {/* شريط ضمان الختم */}
          <div className="rounded-xl bg-brand-dark p-4 text-center text-sm text-white">
            🔒 ذبيحتك مضمونة بنظام الختم — تتبع كل مرحلة بصورة وتوقيت حتى التسليم
          </div>

          <button
            onClick={() => setStage("confirm")}
            disabled={!address.trim()}
            className="w-full rounded-xl bg-brand-red py-3.5 text-lg font-bold text-white disabled:opacity-40"
          >
            متابعة
          </button>
        </div>
      )}

      {stage === "confirm" && (
        <div className="space-y-6">
          <section className="rounded-2xl border border-brand-border bg-white p-5">
            <h3 className="mb-3 font-bold">مراجعة الطلب</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-brand-gray">نوع التسليم</span><span>{deliveryType === "live" ? "حي" : deliveryType === "slaughtered" ? "مذبوح" : "مقطّع"}</span></div>
              {deliveryType !== "live" && (
                <div className="flex justify-between"><span className="text-brand-gray">طريقة السلخ</span><span>{slaughterType === "full" ? "كامل" : "نصف"}</span></div>
              )}
              <div className="flex justify-between"><span className="text-brand-gray">الموعد</span><span>{DELIVERY_DAYS.find((d) => d.id === day)?.label}</span></div>
              <div className="flex justify-between"><span className="text-brand-gray">العنوان</span><span className="max-w-[60%] truncate">{address}</span></div>
              <div className="flex justify-between"><span className="text-brand-gray">الدفع</span><span>{payment === "mada" ? "مدى" : payment === "card" ? "بطاقة" : "Apple Pay"}</span></div>
              <div className="mt-2 flex justify-between border-t border-brand-border pt-2 font-bold"><span>الإجمالي</span><span className="text-brand-red">{total} ر.س</span></div>
            </div>
          </section>

          <div className="flex gap-3">
            <button onClick={() => setStage("details")} className="flex-1 rounded-xl border border-brand-border py-3.5 font-bold text-brand-gray">
              رجوع
            </button>
            <button onClick={() => setStage("success")} className="flex-1 rounded-xl bg-brand-red py-3.5 font-bold text-white">
              تأكيد ودفع {total} ر.س
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
