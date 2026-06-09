"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AnimalType } from "@/types";
import {
  TYPE_LABELS,
  SIZE_RANGES,
  getFarm,
  searchAnimals,
  sizeTagForAnimal,
  type SizeTag,
} from "@/lib/data";

const TYPES = (Object.keys(TYPE_LABELS) as AnimalType[]).map((id) => ({
  id,
  ...TYPE_LABELS[id],
}));
const SIZES = (Object.keys(SIZE_RANGES) as SizeTag[]).map((id) => ({
  id,
  ...SIZE_RANGES[id],
}));

const SORTS = [
  { id: "rating", label: "الأعلى تقييماً" },
  { id: "price", label: "الأقل سعراً" },
  { id: "delivery", label: "أسرع توصيل" },
] as const;
type SortId = (typeof SORTS)[number]["id"];

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
        <button
          onClick={onEdit}
          className="text-sm font-bold text-brand-red"
        >
          تعديل
        </button>
      )}
    </div>
  );
}

function BrowseContent() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedType, setSelectedType] = useState<AnimalType | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeTag | null>(null);
  const [sort, setSort] = useState<SortId>("rating");

  const typeInfo = selectedType ? TYPE_LABELS[selectedType] : null;
  const sizeInfo = selectedSize ? SIZE_RANGES[selectedSize] : null;

  const results = useMemo(() => {
    if (!selectedType || !selectedSize) return [];
    const list = searchAnimals(selectedType, selectedSize).map((a) => ({
      animal: a,
      farm: getFarm(a.farm_id)!,
    }));
    const sorted = [...list];
    if (sort === "rating")
      sorted.sort((a, b) => b.farm.avg_rating - a.farm.avg_rating);
    if (sort === "price")
      sorted.sort((a, b) => a.animal.price_sar - b.animal.price_sar);
    if (sort === "delivery")
      sorted.sort((a, b) => b.farm.total_orders - a.farm.total_orders);
    return sorted;
  }, [selectedType, selectedSize, sort]);

  const [featured, ...rest] = results;

  function pickType(type: AnimalType) {
    setSelectedType(type);
    setSelectedSize(null);
    setStep(2);
  }

  function pickSize(size: SizeTag) {
    setSelectedSize(size);
    setStep(3);
  }

  function orderHref(animalId: string, farmId: string) {
    return `/order?animal=${animalId}&farm=${farmId}`;
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      {/* ── الخطوة ١ — النوع ── */}
      <section className="rounded-2xl border border-brand-border bg-white p-6">
        <StepHeader
          number={1}
          title="ما النوع الذي تبحث عنه؟"
          summary={typeInfo ? `${typeInfo.emoji} ${typeInfo.label}` : undefined}
          onEdit={() => setStep(1)}
        />

        {step === 1 && (
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => pickType(t.id)}
                className={`rounded-2xl border p-6 text-center transition hover:border-brand-red hover:shadow-md ${
                  selectedType === t.id
                    ? "border-brand-red bg-brand-off"
                    : "border-brand-border"
                }`}
              >
                <div className="mb-2 text-4xl">{t.emoji}</div>
                <div className="font-bold">{t.label}</div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ── الخطوة ٢ — الحجم ── */}
      {step >= 2 && (
        <section className="rounded-2xl border border-brand-border bg-white p-6">
          <StepHeader
            number={2}
            title="اختر الحجم المناسب"
            summary={
              sizeInfo && step > 2
                ? `${sizeInfo.label} · ${sizeInfo.weight} · ${sizeInfo.price}`
                : undefined
            }
            onEdit={() => setStep(2)}
          />

          {step === 2 && (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {SIZES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => pickSize(s.id)}
                  className={`rounded-2xl border p-6 text-center transition hover:border-brand-red hover:shadow-md ${
                    selectedSize === s.id
                      ? "border-brand-red bg-brand-off"
                      : "border-brand-border"
                  }`}
                >
                  <div className="mb-1 font-bold">{s.label}</div>
                  <div className="text-sm text-brand-gray">{s.weight}</div>
                  <div className="mt-0.5 text-xs text-brand-gray">{s.price}</div>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── الخطوة ٣ — النتائج ── */}
      {step === 3 && (
        <section className="rounded-2xl border border-brand-border bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <StepHeader number={3} title={`${results.length} نتيجة متاحة`} />
          </div>

          {/* فلاتر الترتيب */}
          <div className="mb-6 flex flex-wrap gap-2">
            {SORTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${
                  sort === s.id
                    ? "border-brand-red bg-brand-red text-white"
                    : "border-brand-border bg-white text-brand-gray"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {results.length === 0 && (
            <p className="rounded-xl bg-brand-off p-6 text-center text-sm text-brand-gray">
              لا توجد نتائج مطابقة لهذا النوع والحجم حالياً
            </p>
          )}

          {/* البطاقة المميزة */}
          {featured && (
            <div className="mb-6 overflow-hidden rounded-2xl border border-brand-border bg-white shadow-md">
              {/* شارة */}
              <div className="flex items-center justify-between border-b border-brand-border px-5 py-2.5">
                <span className="text-xs font-bold text-brand-red">
                  ⭐ الأعلى تقييماً
                </span>
                <span className="rounded-full bg-brand-off px-3 py-0.5 text-xs font-bold text-brand-dark">
                  ✓ موثّق
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-brand-off text-3xl">
                    {TYPE_LABELS[featured.animal.type].emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{featured.farm.name}</h3>
                    <p className="text-sm text-brand-gray">
                      ★{featured.farm.avg_rating} · ({featured.farm.total_reviews} تقييم) · {featured.farm.region}
                    </p>
                    <p className="text-sm text-brand-gray">
                      {featured.animal.breed} ·{" "}
                      {sizeTagForAnimal(featured.animal) === "small"
                        ? "صغير"
                        : sizeTagForAnimal(featured.animal) === "mid"
                        ? "وسط"
                        : "كبير"}
                    </p>
                    <p className="mt-1 text-xl font-bold text-brand-red">
                      {featured.animal.price_sar.toLocaleString("ar-SA")} ر.س
                    </p>
                  </div>
                </div>

                {/* أزرار الإجراء */}
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() =>
                      router.push(orderHref(featured.animal.id, featured.farm.id))
                    }
                    className="flex-1 rounded-xl bg-brand-red py-3 text-center font-bold text-white transition hover:opacity-90"
                  >
                    اطلب الآن ←
                  </button>
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

          {/* خيارات أخرى */}
          {rest.length > 0 && (
            <>
              <p className="mb-3 text-sm font-bold text-brand-gray">
                — خيارات أخرى —
              </p>
              <div className="space-y-3">
                {rest.map(({ animal, farm }) => (
                  <button
                    key={animal.id}
                    onClick={() => router.push(orderHref(animal.id, farm.id))}
                    className="flex w-full items-center justify-between gap-4 rounded-xl border border-brand-border bg-white p-4 text-right transition hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-brand-off text-xl">
                        {TYPE_LABELS[animal.type].emoji}
                      </div>
                      <div>
                        <h4 className="font-bold">{farm.name}</h4>
                        <p className="text-xs text-brand-gray">
                          ★{farm.avg_rating} · {farm.region} · {animal.breed}
                        </p>
                        <p className="mt-0.5 text-xs text-brand-gray">
                          توصيل سريع
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-left">
                      <p className="font-bold text-brand-red">
                        {animal.price_sar.toLocaleString("ar-SA")} ر.س
                      </p>
                      <p className="text-xs text-brand-gray">›</p>
                    </div>
                  </button>
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
