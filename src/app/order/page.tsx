"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAnimal, getFarm, TYPE_LABELS } from "@/lib/data";

const FEE_RATE = 0.04;

const DELIVERY_DAYS = [
  { id: "fri", label: "الجمعة", price: 0 },
  { id: "sat", label: "السبت", price: 0 },
  { id: "sun", label: "الأحد", price: 50 },
];

const DELIVERY_TYPE_LABEL: Record<DeliveryType, string> = {
  live: "حي",
  slaughtered: "مذبوح",
  cut: "مقطّع",
};
const PAYMENT_LABEL = { mada: "مدى", card: "بطاقة", applepay: "Apple Pay" } as const;

type DeliveryType = "live" | "slaughtered" | "cut";

function StepHeader({
  number,
  title,
  summary,
  onEdit,
}: {
  number: number;
  title: string;
  summary?: string;
  onEdit?: () => void;
}) {
  const done = !!summary;
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
            done ? "bg-brand-red text-white" : "bg-brand-off text-brand-gray"
          }`}
        >
          {done ? "✓" : number}
        </span>
        <div>
          <h2 className="font-bold">{title}</h2>
          {summary && <p className="text-sm text-brand-gray">{summary}</p>}
        </div>
      </div>
      {done && onEdit && (
        <button onClick={onEdit} className="text-sm font-bold text-brand-red">
          تعديل
        </button>
      )}
    </div>
  );
}

function OrderContent() {
  const router = useRouter();
  const params = useSearchParams();

  const animalId = params.get("animal");
  const farmId = params.get("farm");

  // All hooks must come before any conditional return
  const [detailsConfirmed, setDetailsConfirmed] = useState(false);
  const [editingDetails, setEditingDetails] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("slaughtered");
  const [slaughterType, setSlaughterType] = useState<"full" | "half">("full");
  const [day, setDay] = useState(DELIVERY_DAYS[0].id);
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<"mada" | "card" | "applepay">("mada");
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const animal = animalId ? getAnimal(animalId) : undefined;
  const farm = farmId ? getFarm(farmId) : animal ? getFarm(animal.farm_id) : undefined;

  const price = animal?.price_sar ?? 0;
  const fee = useMemo(() => Math.round(price * FEE_RATE), [price]);
  const deliveryFee = DELIVERY_DAYS.find((d) => d.id === day)?.price ?? 0;
  const total = price + fee + deliveryFee;
  const dayLabel = DELIVERY_DAYS.find((d) => d.id === day)?.label;

  useEffect(() => {
    if (!animal || !farm) {
      router.replace("/browse");
    }
  }, [animal, farm, router]);

  if (!animal || !farm) {
    return (
      <main className="mx-auto max-w-md px-6 py-20 text-center text-sm text-brand-gray">
        لم يتم العثور على ذبيحة محددة — جارٍ تحويلك إلى صفحة التصفح...
      </main>
    );
  }

  const showDetails = !detailsConfirmed || editingDetails;

  const detailsSummary = detailsConfirmed
    ? `${DELIVERY_TYPE_LABEL[deliveryType]}${deliveryType !== "live" ? ` · ${slaughterType === "full" ? "كامل" : "نصف"}` : ""} · ${dayLabel} · ${address.slice(0, 24)}${address.length > 24 ? "…" : ""}`
    : undefined;

  async function handlePay() {
    setPaying(true);
    setPayError(null);
    try {
      const generatedOrderId = crypto.randomUUID();
      const generatedOrderNumber = `HL-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

      // ١. احفظ الطلب في Supabase
      await fetch("/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: generatedOrderId,
          order_number: generatedOrderNumber,
          animal_id: animal!.id,
          farm_id: farm!.id,
          delivery_type: deliveryType,
          slaughter_type: deliveryType !== "live" ? slaughterType : null,
          delivery_address: address,
          delivery_date: day,
          subtotal_sar: price,
          service_fee_sar: fee,
          delivery_fee_sar: deliveryFee,
          total_sar: total,
          payment_method: payment,
        }),
      });

      // ٢. أنشئ عملية الدفع عبر Moyasar
      const sourceType = payment === "applepay" ? "applepay" : "creditcard";
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount_sar: total,
          order_number: generatedOrderNumber,
          order_id: generatedOrderId,
          source: { type: sourceType },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "تعذّر إتمام الدفع");

      setOrderNumber(generatedOrderNumber);
      setOrderConfirmed(true);

      setTimeout(() => {
        router.push(`/tracking/${generatedOrderNumber}?payment=success`);
      }, 1800);
    } catch (e) {
      setPayError(
        e instanceof Error ? e.message : "تعذّر إتمام الدفع، حاول مرة أخرى"
      );
    } finally {
      setPaying(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-6 py-10 pb-28">
      <h1 className="text-center text-2xl font-bold">إتمام الطلب</h1>

      {/* الخطوة ١ — تفاصيل الطلب */}
      <section className="rounded-2xl border border-brand-border bg-white p-6">
        <StepHeader
          number={1}
          title="تفاصيل الطلب"
          summary={detailsSummary}
          onEdit={() => setEditingDetails(true)}
        />

        {showDetails && (
          <div className="mt-5 space-y-6">
            {/* ملخص الذبيحة */}
            <div className="rounded-xl border border-brand-border p-4">
              <h3 className="mb-3 font-bold">الذبيحة المختارة</h3>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-brand-off text-3xl">
                  {TYPE_LABELS[animal.type].emoji}
                </div>
                <div>
                  <p className="font-bold">
                    {animal.breed} — {farm.name}
                  </p>
                  <p className="text-sm text-brand-gray">
                    الوزن: {animal.live_weight_kg} كجم ·{" "}
                    {price.toLocaleString("ar-SA")} ر.س
                  </p>
                </div>
              </div>
            </div>

            {/* نوع التسليم */}
            <div className="rounded-xl border border-brand-border p-4">
              <h3 className="mb-3 font-bold">نوع التسليم</h3>
              <div className="grid grid-cols-3 gap-3">
                {(["live", "slaughtered", "cut"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDeliveryType(d)}
                    className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                      deliveryType === d
                        ? "border-brand-red bg-brand-red text-white"
                        : "border-brand-border text-brand-gray"
                    }`}
                  >
                    {DELIVERY_TYPE_LABEL[d]}
                  </button>
                ))}
              </div>
            </div>

            {/* طريقة السلخ */}
            {deliveryType !== "live" && (
              <div className="rounded-xl border border-brand-border p-4">
                <h3 className="mb-3 font-bold">طريقة السلخ</h3>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      { id: "full", label: "كامل" },
                      { id: "half", label: "نصف" },
                    ] as const
                  ).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSlaughterType(s.id)}
                      className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                        slaughterType === s.id
                          ? "border-brand-red bg-brand-red text-white"
                          : "border-brand-border text-brand-gray"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* موعد التسليم */}
            <div className="rounded-xl border border-brand-border p-4">
              <h3 className="mb-3 font-bold">موعد التسليم</h3>
              <div className="grid grid-cols-3 gap-3">
                {DELIVERY_DAYS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDay(d.id)}
                    className={`rounded-xl border px-3 py-3 text-center text-sm font-bold transition ${
                      day === d.id
                        ? "border-brand-red bg-brand-red text-white"
                        : "border-brand-border text-brand-gray"
                    }`}
                  >
                    <div>{d.label}</div>
                    <div className="text-xs font-normal opacity-80">
                      {d.price === 0 ? "مجاناً" : `+${d.price} ر.س`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* عنوان التوصيل */}
            <div className="rounded-xl border border-brand-border p-4">
              <h3 className="mb-3 font-bold">عنوان التوصيل</h3>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="أدخل عنوان التوصيل بالتفصيل"
                className="w-full rounded-xl border border-brand-border bg-brand-off p-3 text-sm outline-none focus:border-brand-red"
                rows={3}
              />
            </div>

            {/* طريقة الدفع */}
            <div className="rounded-xl border border-brand-border p-4">
              <h3 className="mb-3 font-bold">طريقة الدفع</h3>
              <div className="grid grid-cols-3 gap-3">
                {(["mada", "card", "applepay"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPayment(p)}
                    className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${
                      payment === p
                        ? "border-brand-red bg-brand-red text-white"
                        : "border-brand-border text-brand-gray"
                    }`}
                  >
                    {PAYMENT_LABEL[p]}
                  </button>
                ))}
              </div>
            </div>

            {/* ملخص الأسعار */}
            <div className="rounded-xl border border-brand-border p-4">
              <h3 className="mb-3 font-bold">ملخص الأسعار</h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-brand-gray">سعر الذبيحة</span>
                  <span>{price.toLocaleString("ar-SA")} ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-gray">رسوم الخدمة (٤٪)</span>
                  <span>{fee.toLocaleString("ar-SA")} ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-gray">التوصيل</span>
                  <span>{deliveryFee === 0 ? "مجاناً" : `${deliveryFee} ر.س`}</span>
                </div>
                <div className="mt-2 flex justify-between border-t border-brand-border pt-2 font-bold">
                  <span>الإجمالي</span>
                  <span className="text-brand-red">
                    {total.toLocaleString("ar-SA")} ر.س
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-brand-dark p-4 text-center text-sm text-white">
              🔒 ذبيحتك مضمونة بنظام الختم — تتبع كل مرحلة بصورة وتوقيت حتى
              التسليم
            </div>

            <button
              onClick={() => {
                setDetailsConfirmed(true);
                setEditingDetails(false);
              }}
              disabled={!address.trim()}
              className="w-full rounded-xl bg-brand-red py-3.5 text-lg font-bold text-white disabled:opacity-40"
            >
              متابعة
            </button>
          </div>
        )}
      </section>

      {/* الخطوة ٢ — تأكيد ودفع */}
      {detailsConfirmed && !editingDetails && (
        <section className="rounded-2xl border border-brand-border bg-white p-6">
          <StepHeader
            number={2}
            title="تأكيد ودفع"
            summary={
              orderConfirmed
                ? `تم الدفع — ${total.toLocaleString("ar-SA")} ر.س`
                : undefined
            }
          />

          {!orderConfirmed && (
            <div className="mt-5 space-y-6">
              <div className="rounded-xl border border-brand-border p-4">
                <h3 className="mb-3 font-bold">مراجعة الطلب</h3>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-brand-gray">نوع التسليم</span>
                    <span>{DELIVERY_TYPE_LABEL[deliveryType]}</span>
                  </div>
                  {deliveryType !== "live" && (
                    <div className="flex justify-between">
                      <span className="text-brand-gray">طريقة السلخ</span>
                      <span>{slaughterType === "full" ? "كامل" : "نصف"}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-brand-gray">الموعد</span>
                    <span>{dayLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-gray">العنوان</span>
                    <span className="max-w-[60%] truncate">{address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-gray">الدفع</span>
                    <span>{PAYMENT_LABEL[payment]}</span>
                  </div>
                  <div className="mt-2 flex justify-between border-t border-brand-border pt-2 font-bold">
                    <span>الإجمالي</span>
                    <span className="text-brand-red">
                      {total.toLocaleString("ar-SA")} ر.س
                    </span>
                  </div>
                </div>
              </div>

              {payError && <p className="text-sm text-brand-red">{payError}</p>}

              <button
                onClick={handlePay}
                disabled={paying}
                className="w-full rounded-xl bg-brand-red py-3.5 text-lg font-bold text-white disabled:opacity-50"
              >
                {paying
                  ? "جارٍ معالجة الدفع عبر Moyasar..."
                  : `تأكيد ودفع ${total.toLocaleString("ar-SA")} ر.س`}
              </button>
            </div>
          )}
        </section>
      )}

      {/* الخطوة ٣ — نجاح */}
      {orderConfirmed && orderNumber && (
        <section className="rounded-2xl border border-brand-border bg-white p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-red text-2xl text-white">
            ✓
          </div>
          <h2 className="mb-1 text-xl font-bold">تم تأكيد طلبك والدفع بنجاح</h2>
          <p className="mb-1 text-sm text-brand-gray">رقم طلبك</p>
          <p className="mb-4 text-lg font-bold text-brand-red">{orderNumber}</p>
          <p className="text-sm text-brand-gray">جارٍ تحويلك لصفحة التتبع...</p>
        </section>
      )}
    </main>
  );
}

export default function OrderPage() {
  return (
    <Suspense>
      <OrderContent />
    </Suspense>
  );
}
