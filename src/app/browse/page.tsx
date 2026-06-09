"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { AnimalType } from "@/types";
import {
  TYPE_LABELS,
  SIZE_RANGES,
  getFarm,
  searchAnimals,
  sizeTagForAnimal,
  type SizeTag,
} from "@/lib/data";

const TYPES = (Object.keys(TYPE_LABELS) as AnimalType[]).map((id) => ({ id, ...TYPE_LABELS[id] }));
const SIZES = (Object.keys(SIZE_RANGES) as SizeTag[]).map((id) => ({ id, ...SIZE_RANGES[id] }));

const SORTS = [
  { id: "rating", label: "الأعلى تقييماً" },
  { id: "price", label: "الأقل سعراً" },
  { id: "delivery", label: "أسرع توصيل" },
] as const;
type SortId = (typeof SORTS)[number]["id"];

function StepHeader({ number, title, summary, onEdit }: { number: number; title: string; summary?: string; onEdit?: () => void }) {
  const done = !!summary;
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${done ? "bg-brand-red text-white" : "bg-brand-off text-brand-gray"}`}>
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

function BrowseContent() {
  const router = useRouter();
  const params = useSearchParams();

  const type = params.get("type") as AnimalType | null;
  const size = params.get("size") as SizeTag | null;
  const sort = (params.get("sort") as SortId | null) ?? "rating";
  const editType = params.get("edit") === "type";
  const editSize = params.get("edit") === "size";

  function setParams(next: Record<string, string | null>) {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v === null) sp.delete(k);
      else sp.set(k, v);
    }
    router.push(`/browse?${sp.toString()}`);
  }

  const typeInfo = type ? TYPE_LABELS[type] : null;
  const sizeInfo = size ? SIZE_RANGES[size] : null;

  const showTypeStep = !type || editType;
  const showSizeStep = !!type && (!size || editSize);
  const showResults = !!type && !!size && !editType && !editSize;

  const results = useMemo(() => {
    if (!type || !size) return [];
    const list = searchAnimals(type, size).map((a) => ({ animal: a, farm: getFarm(a.farm_id)! }));
    const sorted = [...list];
    if (sort === "rating") sorted.sort((a, b) => b.farm.avg_rating - a.farm.avg_rating);
    if (sort === "price") sorted.sort((a, b) => a.animal.price_sar - b.animal.price_sar);
    if (sort === "delivery") sorted.sort((a, b) => b.farm.total_orders - a.farm.total_orders);
    return sorted;
  }, [type, size, sort]);

  const [first, ...rest] = results;

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      {/* الخطوة ١ — النوع */}
      <section className="rounded-2xl border border-brand-border bg-white p-6">
        <StepHeader
          number={1}
          title="ما النوع الذي تبحث عنه؟"
          summary={typeInfo ? `${typeInfo.emoji} ${typeInfo.label}` : undefined}
          onEdit={() => setParams({ edit: "type" })}
        />
        {showTypeStep && (
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setParams({ type: t.id, size: t.id !== type ? null : size, edit: null })}
                className={`rounded-2xl border p-6 text-center transition hover:border-brand-red hover:shadow-md ${type === t.id ? "border-brand-red bg-brand-off" : "border-brand-border"}`}
              >
                <div className="mb-2 text-4xl">{t.emoji}</div>
                <div className="font-bold">{t.label}</div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* الخطوة ٢ — الحجم */}
      {type && (
        <section className="rounded-2xl border border-brand-border bg-white p-6">
          <StepHeader
            number={2}
            title="اختر الحجم المناسب"
            summary={sizeInfo ? `${sizeInfo.label} · ${sizeInfo.weight} · ${sizeInfo.price}` : undefined}
            onEdit={() => setParams({ edit: "size" })}
          />
          {showSizeStep && (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {SIZES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setParams({ size: s.id, edit: null })}
                  className={`rounded-2xl border p-6 text-center transition hover:border-brand-red hover:shadow-md ${size === s.id ? "border-brand-red bg-brand-off" : "border-brand-border"}`}
                >
                  <div className="mb-1 font-bold">{s.label}</div>
                  <div className="text-sm text-brand-gray">{s.weight}</div>
                  <div className="text-sm text-brand-gray">{s.price}</div>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* الخطوة ٣ — النتائج */}
      {showResults && (
        <section className="rounded-2xl border border-brand-border bg-white p-6">
          <StepHeader number={3} title="النتائج" summary={`${results.length} نتيجة`} />

          <div className="mb-6 mt-5 flex flex-wrap gap-2">
            {SORTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setParams({ sort: s.id })}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${
                  sort === s.id ? "border-brand-red bg-brand-red text-white" : "border-brand-border bg-white text-brand-gray"
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

          {first && (
            <Link
              href={`/farm/${first.farm.id}?animal=${first.animal.id}`}
              className="mb-4 block rounded-2xl border border-brand-border bg-white p-5 transition hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-brand-off text-3xl">
                  {TYPE_LABELS[first.animal.type].emoji}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{first.farm.name}</h3>
                  <p className="text-sm text-brand-gray">
                    تقييم {first.farm.avg_rating} · {first.farm.region} · {first.animal.breed} ({sizeTagForAnimal(first.animal) === "small" ? "صغير" : sizeTagForAnimal(first.animal) === "mid" ? "وسط" : "كبير"})
                  </p>
                  <p className="mt-1 font-bold text-brand-red">{first.animal.price_sar.toLocaleString("ar-SA")} ر.س</p>
                </div>
                <span className="shrink-0 rounded-xl bg-brand-red px-5 py-2.5 text-sm font-bold text-white">اطلب الآن</span>
              </div>
            </Link>
          )}

          <div className="space-y-3">
            {rest.map(({ animal, farm }) => (
              <Link
                key={animal.id}
                href={`/farm/${farm.id}?animal=${animal.id}`}
                className="flex items-center justify-between gap-4 rounded-xl border border-brand-border bg-white p-4 transition hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-brand-off text-xl">
                    {TYPE_LABELS[animal.type].emoji}
                  </div>
                  <div>
                    <h4 className="font-bold">{farm.name}</h4>
                    <p className="text-xs text-brand-gray">تقييم {farm.avg_rating} · {farm.region} · {animal.breed}</p>
                  </div>
                </div>
                <span className="font-bold text-brand-red">{animal.price_sar.toLocaleString("ar-SA")} ر.س</span>
              </Link>
            ))}
          </div>
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
