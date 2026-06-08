"use client";

import { useState } from "react";

const DISPUTES = [
  { id: "1", order: "HL-20260606-0007", reason: "الوزن أقل من المُعلن بأكثر من ١٠٪", buyer: "مشترٍ ٣", status: "open" },
  { id: "2", order: "HL-20260605-0002", reason: "تأخر التوصيل عن الموعد المحدد", buyer: "مشترٍ ٥", status: "open" },
];

export default function DisputesPage() {
  const [resolved, setResolved] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">الشكاوى</h1>
      <p className="text-sm text-brand-gray">راجع النزاعات واتخذ قرار الاسترداد المناسب</p>

      <div className="space-y-4">
        {DISPUTES.map((d) => {
          const isResolved = resolved.includes(d.id);
          return (
            <div key={d.id} className="rounded-2xl border border-brand-border bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-bold">{d.order}</p>
                  <p className="text-sm text-brand-gray">{d.buyer}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${isResolved ? "bg-brand-off text-brand-gray" : "bg-brand-red text-white"}`}>
                  {isResolved ? "تم الحل" : "مفتوح"}
                </span>
              </div>
              <p className="mb-4 text-sm text-brand-gray">{d.reason}</p>
              {!isResolved && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setResolved((prev) => [...prev, d.id])}
                    className="flex-1 rounded-xl bg-brand-red py-2.5 font-bold text-white"
                  >
                    استرداد جزئي
                  </button>
                  <button
                    onClick={() => setResolved((prev) => [...prev, d.id])}
                    className="flex-1 rounded-xl border border-brand-border py-2.5 font-bold text-brand-gray"
                  >
                    رفض الشكوى
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
