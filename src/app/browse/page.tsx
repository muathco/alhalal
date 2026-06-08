"use client";

import { useState } from "react";
import Link from "next/link";
import type { AnimalType } from "@/types";

const TYPES: { id: AnimalType; label: string; emoji: string }[] = [
  { id: "sheep", label: "أغنام", emoji: "🐑" },
  { id: "camel", label: "إبل", emoji: "🐪" },
  { id: "cow", label: "بقر", emoji: "🐄" },
  { id: "goat", label: "ماعز", emoji: "🐐" },
];

const SIZES: { id: "small" | "mid" | "large"; label: string; weight: string; price: string }[] = [
  { id: "small", label: "صغير", weight: "١٠–١٥ كجم", price: "٨٠٠–١٢٠٠ ر.س" },
  { id: "mid", label: "وسط", weight: "١٥–٢٥ كجم", price: "١٢٠٠–٢٠٠٠ ر.س" },
  { id: "large", label: "كبير", weight: "+٢٥ كجم", price: "+٢٠٠٠ ر.س" },
];

const SORTS = [
  { id: "rating", label: "الأعلى تقييماً" },
  { id: "price", label: "الأقل سعراً" },
  { id: "delivery", label: "أسرع توصيل" },
] as const;

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

export default function BrowsePage() {
  const [type, setType] = useState<AnimalType | null>(null);
  const [size, setSize] = useState<"small" | "mid" | "large" | null>(null);
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("rating");
  const [editingType, setEditingType] = useState(false);
  const [editingSize, setEditingSize] = useState(false);

  const typeLabel = type ? TYPES.find((t) => t.id === type) : null;
  const sizeInfo = size ? SIZES.find((s) => s.id === size) : null;

  const showTypeStep = type === null || editingType;
  const showSizeStep = type !== null && (size === null || editingSize);
  const showResults = type !== null && size !== null && !editingType && !editingSize;

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      {/* الخطوة ١ — النوع */}
      <section className="rounded-2xl border border-brand-border bg-white p-6">
        <StepHeader
          number={1}
          title="ما النوع الذي تبحث عنه؟"
          summary={typeLabel ? `${typeLabel.emoji} ${typeLabel.label}` : undefined}
          onEdit={() => setEditingType(true)}
        />
        {showTypeStep && (
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setType(t.id);
                  setEditingType(false);
                  // اختيار نوع جديد يفتح خطوة الحجم من جديد
                  if (t.id !== type) {
                    setSize(null);
                    setEditingSize(false);
                  }
                }}
                className={`rounded-2xl border p-6 text-center transition hover:border-brand-red hover:shadow-md ${
                  type === t.id ? "border-brand-red bg-brand-off" : "border-brand-border"
                }`}
              >
                <div className="mb-2 text-4xl">{t.emoji}</div>
                <div className="font-bold">{t.label}</div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* الخطوة ٢ — الحجم */}
      {type !== null && (
        <section className="rounded-2xl border border-brand-border bg-white p-6">
          <StepHeader
            number={2}
            title="اختر الحجم المناسب"
            summary={sizeInfo ? `${sizeInfo.label} · ${sizeInfo.weight} · ${sizeInfo.price}` : undefined}
            onEdit={() => setEditingSize(true)}
          />
          {showSizeStep && (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {SIZES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSize(s.id);
                    setEditingSize(false);
                  }}
                  className={`rounded-2xl border p-6 text-center transition hover:border-brand-red hover:shadow-md ${
                    size === s.id ? "border-brand-red bg-brand-off" : "border-brand-border"
                  }`}
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
          <StepHeader number={3} title="النتائج" />

          <div className="mb-6 mt-5 flex flex-wrap gap-2">
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

          {/* النتيجة الأولى — الأعلى تقييماً */}
          <Link
            href="/farm/1"
            className="mb-4 block rounded-2xl border border-brand-border bg-white p-5 transition hover:shadow-lg"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="h-24 w-24 shrink-0 rounded-xl bg-brand-off" />
              <div className="flex-1">
                <h3 className="font-bold">حضيرة الوادي الأخضر</h3>
                <p className="text-sm text-brand-gray">تقييم ٤.٩ · المنطقة الوسطى · {typeLabel?.label}</p>
                <p className="mt-1 font-bold text-brand-red">١٤٥٠ ر.س</p>
              </div>
              <span className="shrink-0 rounded-xl bg-brand-red px-5 py-2.5 text-sm font-bold text-white">
                اطلب الآن
              </span>
            </div>
          </Link>

          {/* صفوف مختصرة للباقين */}
          <div className="space-y-3">
            {[2, 3, 4].map((i) => (
              <Link
                key={i}
                href={`/farm/${i}`}
                className="flex items-center justify-between gap-4 rounded-xl border border-brand-border bg-white p-4 transition hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 shrink-0 rounded-lg bg-brand-off" />
                  <div>
                    <h4 className="font-bold">حضيرة رقم {i}</h4>
                    <p className="text-xs text-brand-gray">تقييم ٤.{9 - i} · المنطقة الشرقية</p>
                  </div>
                </div>
                <span className="font-bold text-brand-red">١٢٠٠ ر.س</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
