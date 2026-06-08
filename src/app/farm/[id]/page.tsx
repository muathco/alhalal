"use client";

import { useState } from "react";
import Link from "next/link";

const TABS = [
  { id: "animals", label: "المواشي المتاحة" },
  { id: "info", label: "معلومات الحضيرة" },
  { id: "reviews", label: "التقييمات" },
] as const;

export default function FarmPage({ params }: { params: { id: string } }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("animals");

  return (
    <main className="pb-28">
      {/* Header */}
      <div className="border-b border-brand-border bg-white px-6 py-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold">حضيرة الوادي الأخضر</h1>
          <p className="text-sm text-brand-gray">تقييم ٤.٩ · ١٢٠ تقييم · المنطقة الوسطى</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-10 border-b border-brand-border bg-white">
        <div className="mx-auto flex max-w-4xl gap-2 px-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`border-b-2 px-4 py-3 text-sm font-bold transition ${
                tab === t.id ? "border-brand-red text-brand-red" : "border-transparent text-brand-gray"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8">
        {tab === "animals" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl border border-brand-border bg-white p-4">
                <div className="mb-3 h-32 rounded-xl bg-brand-off" />
                <h3 className="font-bold">خروف نجدي #{i}</h3>
                <p className="text-sm text-brand-gray">الوزن: ١٨ كجم · تغذية طبيعية</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-brand-red">١٤٥٠ ر.س</span>
                  <Link href="/order" className="rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white">
                    اطلب
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "info" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-brand-border bg-white p-5">
              <h3 className="mb-2 font-bold">نوع التغذية</h3>
              <p className="text-sm text-brand-gray">تغذية طبيعية معتمدة من شهادة بيطرية موثقة</p>
            </div>
            <div className="rounded-2xl border border-brand-border bg-white p-5">
              <h3 className="mb-2 font-bold">الشهادة البيطرية</h3>
              <p className="text-sm text-brand-gray">موثقة ✓ — صادرة من الهيئة العامة للغذاء والدواء</p>
            </div>
            <div className="rounded-2xl border border-brand-border bg-white p-5">
              <h3 className="mb-2 font-bold">الموقع</h3>
              <p className="text-sm text-brand-gray">المنطقة الوسطى — طريق الرياض الخارجي، حضيرة #{params.id}</p>
            </div>
          </div>
        )}

        {tab === "reviews" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-brand-border bg-white p-5">
              <h3 className="mb-3 font-bold">متوسط التقييمات</h3>
              {[
                { label: "مطابقة الوزن", value: 4.8 },
                { label: "جودة اللحم", value: 4.9 },
                { label: "النظافة", value: 4.7 },
                { label: "التوصيل", value: 4.8 },
              ].map((r) => (
                <div key={r.label} className="mb-2 flex items-center gap-3">
                  <span className="w-28 text-sm text-brand-gray">{r.label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-brand-off">
                    <div className="h-full rounded-full bg-brand-red" style={{ width: `${(r.value / 5) * 100}%` }} />
                  </div>
                  <span className="text-sm font-bold">{r.value}</span>
                </div>
              ))}
            </div>

            {[1, 2].map((i) => (
              <div key={i} className="rounded-2xl border border-brand-border bg-white p-5">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-bold">مشترٍ {i}</span>
                  <span className="text-sm text-brand-red">★ ٤.٩</span>
                </div>
                <p className="text-sm text-brand-gray">جودة ممتازة وتوصيل في الموعد المحدد بالضبط، أنصح بهذه الحضيرة.</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* أخرى لديها نفس النوع */}
      <div className="mx-auto max-w-4xl px-6 pb-8">
        <h2 className="mb-4 text-lg font-bold">حضائر أخرى لديها نفس النوع</h2>
        <div className="flex gap-4 overflow-x-auto">
          {[2, 3, 4].map((i) => (
            <Link
              key={i}
              href={`/farm/${i}`}
              className="w-48 shrink-0 rounded-xl border border-brand-border bg-white p-4 transition hover:shadow-md"
            >
              <div className="mb-2 h-20 rounded-lg bg-brand-off" />
              <h4 className="font-bold">حضيرة رقم {i}</h4>
              <p className="text-xs text-brand-gray">تقييم ٤.{9 - i}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Sticky footer */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-brand-border bg-white p-4">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/order"
            className="block w-full rounded-xl bg-brand-red py-3.5 text-center text-lg font-bold text-white"
          >
            اطلب الآن
          </Link>
        </div>
      </div>
    </main>
  );
}
