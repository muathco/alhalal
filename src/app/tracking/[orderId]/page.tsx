"use client";

import Link from "next/link";

const STAGES = [
  { stage: 1, title: "تخصيص الذبيحة", message: "تم تخصيص ذبيحتك ✓ — التاج #٤٤١٢", time: "اليوم — ٨:٣٠ ص", done: true },
  { stage: 2, title: "قبيل الذبح", message: "ذبيحتك في طريقها للذبح الآن", time: "اليوم — ١٠:١٥ ص", done: true },
  { stage: 3, title: "بعد الذبح", message: "تم الذبح ✓ — جاري التقطيع", time: "اليوم — ١١:٠٠ ص", done: true },
  { stage: 4, title: "التغليف", message: "ذبيحتك جاهزة وفي الطريق إليك 🚗", time: "في الانتظار", done: false },
];

export default function TrackingPage({ params }: { params: { orderId: string } }) {
  const delivered = STAGES.every((s) => s.done);

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-1 text-2xl font-bold">تتبع طلبك</h1>
      <p className="mb-8 text-sm text-brand-gray">رقم الطلب: {params.orderId}</p>

      <div className="space-y-4">
        {STAGES.map((s) => (
          <div
            key={s.stage}
            className={`flex gap-4 rounded-2xl border p-5 ${
              s.done ? "border-brand-border bg-white" : "border-dashed border-brand-border bg-brand-off"
            }`}
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold ${
                s.done ? "bg-brand-red text-white" : "bg-white text-brand-gray"
              }`}
            >
              {s.done ? "✓" : s.stage}
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{s.title}</h3>
              {s.done ? (
                <>
                  <div className="my-2 h-28 rounded-xl bg-brand-off" />
                  <p className="text-sm">{s.message}</p>
                  <p className="mt-1 text-xs text-brand-gray">{s.time}</p>
                </>
              ) : (
                <p className="text-sm text-brand-gray">في الانتظار</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {delivered && (
        <Link
          href={`/review/${params.orderId}`}
          className="mt-8 block w-full rounded-xl bg-brand-red py-3.5 text-center text-lg font-bold text-white"
        >
          قيّم الآن
        </Link>
      )}
    </main>
  );
}
