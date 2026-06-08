"use client";

import { useState } from "react";

const CRITERIA = [
  { id: "weight_score", label: "مطابقة الوزن" },
  { id: "quality_score", label: "جودة اللحم" },
  { id: "cleanliness_score", label: "النظافة" },
  { id: "delivery_score", label: "التوصيل" },
] as const;

const QUICK_TAGS = ["توصيل سريع", "تغليف ممتاز", "وزن مطابق", "تواصل جيد", "جودة عالية"];

function Stars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)} className="text-2xl">
          <span className={n <= value ? "text-brand-red" : "text-brand-border"}>★</span>
        </button>
      ))}
    </div>
  );
}

export default function ReviewPage({ params }: { params: { orderId: string } }) {
  const [scores, setScores] = useState<Record<(typeof CRITERIA)[number]["id"], number>>({
    weight_score: 0,
    quality_score: 0,
    cleanliness_score: 0,
    delivery_score: 0,
  });
  const [comment, setComment] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [sent, setSent] = useState(false);

  const canSubmit = Object.values(scores).every((v) => v > 0);

  function toggleTag(tag: string) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  if (sent) {
    return (
      <main className="mx-auto max-w-lg px-6 py-20 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-red text-2xl text-white">✓</div>
        <h1 className="mb-2 text-2xl font-bold">شكراً لتقييمك</h1>
        <p className="mb-8 text-brand-gray">رأيك يساعدنا على تحسين الخدمة لجميع المشترين</p>
        <div className="flex justify-center gap-3">
          <button className="rounded-xl border border-brand-border px-6 py-3 font-bold text-brand-gray">مشاركة</button>
          <button className="rounded-xl bg-brand-red px-6 py-3 font-bold text-white">العودة للرئيسية</button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-1 text-2xl font-bold">قيّم تجربتك</h1>
      <p className="mb-6 text-sm text-brand-gray">رقم الطلب: {params.orderId}</p>

      <section className="mb-6 rounded-2xl border border-brand-border bg-white p-5">
        <h3 className="mb-3 font-bold">ملخص الطلب</h3>
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 shrink-0 rounded-lg bg-brand-off" />
          <div>
            <p className="font-bold">خروف نجدي — حضيرة الوادي الأخضر</p>
            <p className="text-sm text-brand-gray">تم التسليم بنجاح</p>
          </div>
        </div>
      </section>

      <section className="mb-6 space-y-4 rounded-2xl border border-brand-border bg-white p-5">
        <h3 className="font-bold">قيّم المعايير التالية</h3>
        {CRITERIA.map((c) => (
          <div key={c.id} className="flex items-center justify-between">
            <span className="text-sm text-brand-gray">{c.label}</span>
            <Stars value={scores[c.id]} onChange={(v) => setScores((s) => ({ ...s, [c.id]: v }))} />
          </div>
        ))}
      </section>

      <section className="mb-6 rounded-2xl border border-brand-border bg-white p-5">
        <h3 className="mb-3 font-bold">تعليق (اختياري)</h3>
        <div className="mb-3 flex flex-wrap gap-2">
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                tags.includes(tag) ? "border-brand-red bg-brand-red text-white" : "border-brand-border text-brand-gray"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="شاركنا رأيك بالتفصيل..."
          rows={3}
          className="w-full rounded-xl border border-brand-border bg-brand-off p-3 text-sm outline-none focus:border-brand-red"
        />
      </section>

      <button
        onClick={() => setSent(true)}
        disabled={!canSubmit}
        className="w-full rounded-xl bg-brand-red py-3.5 text-lg font-bold text-white disabled:opacity-40"
      >
        إرسال التقييم
      </button>
    </main>
  );
}
