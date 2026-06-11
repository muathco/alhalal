"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import type { AnimalType } from "@/types";
import {
  TYPE_LABELS,
  SIZE_RANGES,
  getFarm,
  searchAnimals,
  sizeTagForAnimal,
  type SizeTag,
} from "@/lib/data";

/* ─── ثوابت ─── */
const TYPES = (Object.keys(TYPE_LABELS) as AnimalType[]).map((id) => ({
  id,
  ...TYPE_LABELS[id],
}));
const SIZES = (Object.keys(SIZE_RANGES) as SizeTag[]).map((id) => ({
  id,
  ...SIZE_RANGES[id],
}));
const SORTS = [
  { id: "rating" as const, label: "الأعلى تقييماً" },
  { id: "price" as const, label: "الأقل سعراً" },
  { id: "delivery" as const, label: "أسرع توصيل" },
];

/* ─── StepDone: رأس الخطوة المكتملة ─── */
function StepDone({
  number,
  label,
  onEdit,
}: {
  number: number;
  label: string;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-red text-sm font-bold text-white">
          ✓
        </span>
        <div>
          <p className="text-xs text-brand-gray">الخطوة {number}</p>
          <p className="font-bold">{label}</p>
        </div>
      </div>
      <button
        onClick={onEdit}
        className="text-sm font-bold text-brand-red"
      >
        تعديل
      </button>
    </div>
  );
}

/* ─── StepOpen: رأس الخطوة المفتوحة ─── */
function StepOpen({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-off text-sm font-bold text-brand-gray">
        {number}
      </span>
      <h2 className="font-bold">{title}</h2>
    </div>
  );
}

/* ─── المكوّن الرئيسي ─── */
function BrowseContent() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedType, setSelectedType] = useState<AnimalType | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeTag | null>(null);
  const [sort, setSort] = useState<"rating" | "price" | "delivery">("rating");

  /* ─── النتائج ─── */
  const results = useMemo(() => {
    if (!selectedType || !selectedSize) return [];
    const list = searchAnimals(selectedType, selectedSize).map((a) => ({
      animal: a,
      farm: getFarm(a.farm_id)!,
    }));
    if (sort === "rating") list.sort((a, b) => b.farm.avg_rating - a.farm.avg_rating);
    if (sort === "price") list.sort((a, b) => a.animal.price_sar - b.animal.price_sar);
    if (sort === "delivery") list.sort((a, b) => b.farm.total_orders - a.farm.total_orders);
    return list;
  }, [selectedType, selectedSize, sort]);

  const [featured, ...rest] = results;

  /* ─── اختيار النوع ─── */
  function pickType(t: AnimalType) {
    setSelectedType(t);
    setSelectedSize(null);
    setStep(2);
  }

  /* ─── اختيار الحجم ─── */
  function pickSize(s: SizeTag) {
    setSelectedSize(s);
    setStep(3);
  }

  /* ─── رابط الطلب ─── */
  function orderHref(animalId: string, farmId: string) {
    return `/order?animal=${animalId}&farm=${farmId}`;
  }

  const typeLabel = selectedType
    ? `${TYPE_LABELS[selectedType].emoji} ${TYPE_LABELS[selectedType].label}`
    : "";
  const sizeLabel = selectedSize
    ? `${SIZE_RANGES[selectedSize].label} · ${SIZE_RANGES[selectedSize].weight} · ${SIZE_RANGES[selectedSize].price}`
    : "";

  return (
    <main className="mx-auto max-w-4xl space-y-4 px-4 py-8">

      {/* ══ الخطوة ١ — النوع ══ */}
      <section className="rounded-2xl border border-brand-border bg-white p-6">
        {step > 1 && selectedType ? (
          <StepDone number={1} label={typeLabel} onEdit={() => setStep(1)} />
        ) : (
          <>
            <StepOpen number={1} title="ما النوع الذي تبحث عنه؟" />
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => pickType(t.id)}
                  className="rounded-2xl border border-brand-border p-5 text-center transition hover:border-brand-red hover:shadow-md active:scale-95"
                >
                  <div className="mb-2 text-4xl">{t.emoji}</div>
                  <div className="font-bold">{t.label}</div>
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ══ الخطوة ٢ — الحجم ══ */}
      {step >= 2 && (
        <section className="rounded-2xl border border-brand-border bg-white p-6">
          {step > 2 && selectedSize ? (
            <StepDone number={2} label={sizeLabel} onEdit={() => setStep(2)} />
          ) : (
            <>
              <StepOpen number={2} title="اختر الحجم المناسب" />
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {SIZES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => pickSize(s.id)}
                    className="rounded-2xl border border-brand-border p-6 text-center transition hover:border-brand-red hover:shadow-md active:scale-95"
                  >
                    <p className="mb-1 text-lg font-bold">{s.label}</p>
                    <p className="text-sm text-brand-gray">{s.weight}</p>
                    <p className="mt-0.5 text-xs text-brand-gray">{s.price}</p>
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* ══ الخطوة ٣ — النتائج ══ */}
      {step === 3 && (
        <section className="rounded-2xl border border-brand-border bg-white p-6">
          {/* رأس النتائج */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-off text-sm font-bold text-brand-gray">
                3
              </span>
              <h2 className="font-bold">{results.length} نتيجة متاحة</h2>
            </div>
          </div>

          {/* فلاتر الترتيب */}
          <div className="mb-5 flex flex-wrap gap-2">
            {SORTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                className={`rounded-full border px-4 py-1.5 text-sm font-bold transition ${
                  sort === s.id
                    ? "border-brand-red bg-brand-red text-white"
                    : "border-brand-border bg-white text-brand-gray hover:border-brand-gray"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {results.length === 0 && (
            <p className="rounded-xl bg-brand-off p-8 text-center text-sm text-brand-gray">
              لا توجد نتائج مطابقة — جرّب حجماً آخر
            </p>
          )}

          {/* البطاقة المميزة */}
          {featured && (
            <div className="mb-5 overflow-hidden rounded-2xl border-2 border-brand-red bg-white shadow-md">
              <div className="flex items-center justify-between border-b border-brand-border/60 bg-brand-red/5 px-5 py-2">
                <span className="text-xs font-bold text-brand-red">⭐ الأعلى تقييماً</span>
                {featured.farm.is_verified && (
                  <span className="rounded-full bg-white px-3 py-0.5 text-xs font-bold text-brand-dark">
                    ✓ موثّق
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-brand-off text-4xl">
                    {TYPE_LABELS[featured.animal.type].emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="truncate text-lg font-bold">{featured.farm.name}</h3>
                    <p className="text-sm text-brand-gray">
                      ★{featured.farm.avg_rating} · ({featured.farm.total_reviews} تقييم) · {featured.farm.region}
                    </p>
                    <p className="text-sm text-brand-gray">
                      {featured.animal.breed} ·{" "}
                      {sizeTagForAnimal(featured.animal) === "small" ? "صغير" : sizeTagForAnimal(featured.animal) === "mid" ? "وسط" : "كبير"}
                    </p>
                    <p className="mt-1 text-xl font-bold text-brand-red">
                      {featured.animal.price_sar.toLocaleString("ar-SA")} ر.س
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <Link
                    href={orderHref(featured.animal.id, featured.farm.id)}
                    className="flex-1 rounded-xl bg-brand-red py-3 text-center font-bold text-white transition hover:opacity-90"
                  >
                    اطلب الآن ←
                  </Link>
                  <Link
                    href={`/farm/${featured.farm.id}?animal=${featured.animal.id}`}
                    className="rounded-xl border border-brand-border px-4 py-3 text-sm font-bold text-brand-dark transition hover:bg-brand-off"
                  >
                    عرض الحضيرة ↗
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* الصفوف المختصرة */}
          {rest.length > 0 && (
            <>
              <p className="mb-3 text-center text-sm font-bold text-brand-gray">— خيارات أخرى —</p>
              <div className="space-y-2">
                {rest.map(({ animal, farm }) => (
                  <Link
                    key={animal.id}
                    href={orderHref(animal.id, farm.id)}
                    className="flex items-center justify-between gap-3 rounded-xl border border-brand-border bg-white p-4 transition hover:border-brand-red hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-off text-xl">
                        {TYPE_LABELS[animal.type].emoji}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-bold">{farm.name}</p>
                        <p className="text-xs text-brand-gray">
                          ★{farm.avg_rating} · {farm.region} · {animal.breed}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-left">
                      <p className="font-bold text-brand-red">
                        {animal.price_sar.toLocaleString("ar-SA")} ر.س
                      </p>
                      <p className="text-left text-xs text-brand-gray">اطلب ›</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>
      )}
    </main>
  );
}

export default function BrowsePage() {
  return (
    <Suspense>
      <BrowseContent />
    </Suspense>
  );
}
