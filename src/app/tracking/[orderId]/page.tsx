"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const STAGES = [
  {
    stage: 1,
    title: "تخصيص الذبيحة",
    desc: "تم تسجيل طلبك وتخصيص الذبيحة للبائع",
    icon: "📋",
  },
  {
    stage: 2,
    title: "قبيل الذبح",
    desc: "الذبيحة جاهزة — يتم التصوير والتأكيد",
    icon: "📸",
  },
  {
    stage: 3,
    title: "بعد الذبح",
    desc: "تم الذبح وجارٍ التقطيع والتغليف",
    icon: "🔪",
  },
  {
    stage: 4,
    title: "التوصيل",
    desc: "ذبيحتك في الطريق إليك",
    icon: "🚗",
  },
];

function TrackingContent({ orderId }: { orderId: string }) {
  const params = useSearchParams();
  const paymentStatus = params.get("payment");
  const isPaid = paymentStatus === "success" || !paymentStatus; // بدون param = من redirect مباشر

  // حالة الطلب الحالية: الخطوتان الأوليتان مكتملتان بشكل افتراضي لإظهار التجربة
  const currentStage = 2;

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 pb-20">
      {/* بانر نجاح الدفع */}
      {isPaid && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-brand-dark p-5 text-white">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-red text-lg font-bold">
            ✓
          </span>
          <div>
            <p className="font-bold">تم الدفع بنجاح</p>
            <p className="text-sm text-white/70">طلبك قيد التنفيذ — نبلّغك بكل خطوة</p>
          </div>
        </div>
      )}

      {/* رقم الطلب */}
      <div className="mb-8 rounded-2xl border border-brand-border bg-white p-5">
        <p className="mb-1 text-sm text-brand-gray">رقم الطلب</p>
        <p className="text-xl font-bold text-brand-red">{orderId}</p>
        <div className="mt-3 flex items-center gap-4 text-sm text-brand-gray">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            قيد التنفيذ
          </span>
          <span>·</span>
          <span>التوصيل خلال ١–٢ أيام</span>
        </div>
      </div>

      {/* مراحل الختم */}
      <h2 className="mb-4 font-bold">مراحل التتبع</h2>
      <div className="relative space-y-4">
        {/* خط رأسي رابط */}
        <div className="absolute right-[23px] top-12 h-[calc(100%-48px)] w-0.5 bg-brand-border" />

        {STAGES.map((s) => {
          const done = s.stage <= currentStage;
          const active = s.stage === currentStage + 1;
          return (
            <div
              key={s.stage}
              className={`relative flex gap-4 rounded-2xl border p-5 transition ${
                done
                  ? "border-brand-border bg-white"
                  : active
                  ? "border-brand-red/30 bg-brand-off"
                  : "border-dashed border-brand-border bg-white opacity-50"
              }`}
            >
              {/* أيقونة الحالة */}
              <div
                className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl ${
                  done
                    ? "bg-brand-red text-white"
                    : active
                    ? "border-2 border-brand-red bg-white"
                    : "bg-brand-off"
                }`}
              >
                {done ? "✓" : s.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">{s.title}</h3>
                  {done && (
                    <span className="text-xs font-bold text-brand-red">مكتملة</span>
                  )}
                  {active && (
                    <span className="animate-pulse text-xs font-bold text-amber-600">
                      جارية...
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-brand-gray">{s.desc}</p>

                {/* صورة placeholder للمراحل المكتملة */}
                {done && (
                  <div className="mt-3 flex h-28 items-center justify-center rounded-xl bg-brand-off text-sm text-brand-gray">
                    📷 سيتم رفع صورة التأكيد هنا
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* تواصل مع البائع */}
      <div className="mt-6 rounded-2xl border border-brand-border bg-white p-5">
        <h3 className="mb-3 font-bold">تحتاج مساعدة؟</h3>
        <div className="flex gap-3">
          <a
            href="tel:+966500000000"
            className="flex-1 rounded-xl border border-brand-border py-3 text-center text-sm font-bold transition hover:bg-brand-off"
          >
            📞 اتصل بالبائع
          </a>
          <Link
            href="/browse"
            className="flex-1 rounded-xl border border-brand-border py-3 text-center text-sm font-bold transition hover:bg-brand-off"
          >
            🔄 طلب آخر
          </Link>
        </div>
      </div>

      {/* زر التقييم (يظهر عند اكتمال كل المراحل) */}
      {currentStage >= 4 && (
        <Link
          href={`/review/${orderId}`}
          className="mt-6 block w-full rounded-xl bg-brand-red py-3.5 text-center text-lg font-bold text-white"
        >
          قيّم تجربتك ⭐
        </Link>
      )}
    </main>
  );
}

export default function TrackingPage({ params }: { params: { orderId: string } }) {
  return (
    <Suspense>
      <TrackingContent orderId={params.orderId} />
    </Suspense>
  );
}
