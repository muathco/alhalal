"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ANIMALS, FARMS, TYPE_LABELS, getFarm, getFarmAnimals } from "@/lib/data";

const TABS = [
  { id: "animals", label: "المواشي المتاحة" },
  { id: "info", label: "معلومات الحضيرة" },
  { id: "reviews", label: "التقييمات" },
] as const;

const FEED_LABELS: Record<string, string> = {
  natural: "تغذية طبيعية",
  certified: "تغذية معتمدة بشهادة بيطرية",
  mixed: "تغذية مختلطة",
};

export default function FarmPage({ params, searchParams }: { params: { id: string }; searchParams: { animal?: string } }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("animals");

  const farm = getFarm(params.id);
  if (!farm) notFound();

  const animals = getFarmAnimals(farm.id);
  const highlightedAnimalId = searchParams.animal;

  const competing = FARMS.filter((f) => f.id !== farm.id && ANIMALS.some((a) => a.farm_id === f.id && animals.some((fa) => fa.type === a.type))).slice(0, 3);

  function orderHref(animalId: string) {
    return `/order?animal=${animalId}&farm=${farm!.id}`;
  }

  return (
    <main className="pb-28">
      {/* Header */}
      <div className="border-b border-brand-border bg-white px-6 py-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold">{farm.name}</h1>
          <p className="text-sm text-brand-gray">
            تقييم {farm.avg_rating} · {farm.total_reviews} تقييم · {farm.region}
            {farm.is_verified && <span className="mr-2 rounded-full bg-brand-off px-2 py-0.5 text-xs font-bold text-brand-red">موثقة ✓</span>}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-10 border-b border-brand-border bg-white">
        <div className="mx-auto flex max-w-4xl gap-2 px-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`border-b-2 px-4 py-3 text-sm font-bold transition ${tab === t.id ? "border-brand-red text-brand-red" : "border-transparent text-brand-gray"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8">
        {tab === "animals" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {animals.map((a) => (
              <div
                key={a.id}
                className={`rounded-2xl border bg-white p-4 ${highlightedAnimalId === a.id ? "border-brand-red ring-1 ring-brand-red" : "border-brand-border"}`}
              >
                <div className="mb-3 flex h-32 items-center justify-center rounded-xl bg-brand-off text-5xl">
                  {TYPE_LABELS[a.type].emoji}
                </div>
                <h3 className="font-bold">{a.breed} — {TYPE_LABELS[a.type].label}</h3>
                <p className="text-sm text-brand-gray">الوزن: {a.live_weight_kg} كجم · {FEED_LABELS[a.feed_type ?? "natural"]}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-brand-red">{a.price_sar.toLocaleString("ar-SA")} ر.س</span>
                  <Link href={orderHref(a.id)} className="rounded-lg bg-brand-red px-4 py-2 text-sm font-bold text-white">
                    اطلب
                  </Link>
                </div>
              </div>
            ))}
            {animals.length === 0 && <p className="text-sm text-brand-gray">لا توجد مواشٍ متاحة حالياً في هذه الحضيرة</p>}
          </div>
        )}

        {tab === "info" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-brand-border bg-white p-5">
              <h3 className="mb-2 font-bold">عن الحضيرة</h3>
              <p className="text-sm text-brand-gray">{farm.bio}</p>
            </div>
            <div className="rounded-2xl border border-brand-border bg-white p-5">
              <h3 className="mb-2 font-bold">نوع التغذية</h3>
              <p className="text-sm text-brand-gray">{FEED_LABELS[farm.feed_type ?? "natural"]}</p>
            </div>
            <div className="rounded-2xl border border-brand-border bg-white p-5">
              <h3 className="mb-2 font-bold">الشهادة البيطرية</h3>
              <p className="text-sm text-brand-gray">{farm.is_verified ? "موثقة ✓ — صادرة من الهيئة العامة للغذاء والدواء" : "قيد المراجعة"}</p>
            </div>
            <div className="rounded-2xl border border-brand-border bg-white p-5">
              <h3 className="mb-2 font-bold">الموقع</h3>
              <p className="text-sm text-brand-gray">{farm.location_text}</p>
            </div>
          </div>
        )}

        {tab === "reviews" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-brand-border bg-white p-5">
              <h3 className="mb-3 font-bold">متوسط التقييمات</h3>
              {[
                { label: "مطابقة الوزن", value: Math.min(5, farm.avg_rating + 0.1) },
                { label: "جودة اللحم", value: farm.avg_rating },
                { label: "النظافة", value: Math.max(1, farm.avg_rating - 0.2) },
                { label: "التوصيل", value: Math.min(5, farm.avg_rating) },
              ].map((r) => (
                <div key={r.label} className="mb-2 flex items-center gap-3">
                  <span className="w-28 text-sm text-brand-gray">{r.label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-brand-off">
                    <div className="h-full rounded-full bg-brand-red" style={{ width: `${(r.value / 5) * 100}%` }} />
                  </div>
                  <span className="text-sm font-bold">{r.value.toFixed(1)}</span>
                </div>
              ))}
            </div>

            {farm.total_reviews > 0 ? (
              [1, 2].map((i) => (
                <div key={i} className="rounded-2xl border border-brand-border bg-white p-5">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-bold">مشترٍ {i}</span>
                    <span className="text-sm text-brand-red">★ {farm.avg_rating}</span>
                  </div>
                  <p className="text-sm text-brand-gray">جودة ممتازة وتوصيل في الموعد المحدد بالضبط، أنصح بهذه الحضيرة.</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-brand-gray">لا توجد تقييمات بعد</p>
            )}
          </div>
        )}
      </div>

      {/* حضائر أخرى لديها نفس النوع */}
      {competing.length > 0 && (
        <div className="mx-auto max-w-4xl px-6 pb-8">
          <h2 className="mb-4 text-lg font-bold">حضائر أخرى لديها نفس النوع</h2>
          <div className="flex gap-4 overflow-x-auto">
            {competing.map((f) => (
              <Link key={f.id} href={`/farm/${f.id}`} className="w-48 shrink-0 rounded-xl border border-brand-border bg-white p-4 transition hover:shadow-md">
                <div className="mb-2 flex h-20 items-center justify-center rounded-lg bg-brand-off text-2xl">{TYPE_LABELS[getFarmAnimals(f.id)[0]?.type ?? "sheep"].emoji}</div>
                <h4 className="font-bold">{f.name}</h4>
                <p className="text-xs text-brand-gray">تقييم {f.avg_rating} · {f.region}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Sticky footer */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-brand-border bg-white p-4">
        <div className="mx-auto max-w-4xl">
          <Link
            href={orderHref(highlightedAnimalId ?? animals[0]?.id ?? "")}
            className="block w-full rounded-xl bg-brand-red py-3.5 text-center text-lg font-bold text-white"
          >
            اطلب الآن
          </Link>
        </div>
      </div>
    </main>
  );
}
