"use client";

import { useState } from "react";

const PENDING = [
  { id: "HL-20260608-0001", animal: "خروف نجدي #١", buyer: "مشترٍ ١", minutesLeft: 22 },
  { id: "HL-20260608-0002", animal: "خروف نجدي #٤", buyer: "مشترٍ ٢", minutesLeft: 8 },
];

const SEAL_STAGES = ["تخصيص الذبيحة", "قبيل الذبح", "بعد الذبح", "التغليف"];

const ACTIVE = [
  { id: "HL-20260607-0014", animal: "خروف نجدي #٢", currentStage: 2 },
  { id: "HL-20260607-0011", animal: "ناقة مهرية #١", currentStage: 3 },
];

const COMPLETED = [
  { id: "HL-20260605-0009", animal: "خروف نجدي #٧", total: "١٤٥٠ ر.س" },
  { id: "HL-20260604-0003", animal: "بقرة هولندية #١", total: "٤٢٠٠ ر.س" },
];

const TABS = ["pending", "active", "completed"] as const;
const TAB_LABELS: Record<(typeof TABS)[number], string> = {
  pending: "بانتظار الرد",
  active: "نشطة",
  completed: "مكتملة",
};

export default function DashboardOrders() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("pending");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">الطلبات</h1>

      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full border px-4 py-1.5 text-sm font-bold transition ${
              tab === t ? "border-brand-red bg-brand-red text-white" : "border-brand-border text-brand-gray"
            }`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {tab === "pending" && (
        <div className="space-y-3">
          {PENDING.map((o) => (
            <div key={o.id} className="rounded-2xl border border-brand-border bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-bold">{o.animal}</p>
                  <p className="text-sm text-brand-gray">{o.id} · {o.buyer}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-bold ${o.minutesLeft <= 10 ? "bg-brand-red text-white" : "bg-brand-off text-brand-red"}`}>
                  ⏱ {o.minutesLeft} دقيقة متبقية
                </span>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 rounded-xl bg-brand-red py-2.5 font-bold text-white">قبول</button>
                <button className="flex-1 rounded-xl border border-brand-border py-2.5 font-bold text-brand-gray">رفض</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "active" && (
        <div className="space-y-4">
          {ACTIVE.map((o) => (
            <div key={o.id} className="rounded-2xl border border-brand-border bg-white p-5">
              <p className="mb-1 font-bold">{o.animal}</p>
              <p className="mb-4 text-sm text-brand-gray">{o.id}</p>
              <div className="flex items-center gap-2">
                {SEAL_STAGES.map((s, i) => {
                  const stageNum = i + 1;
                  const done = stageNum <= o.currentStage;
                  return (
                    <div key={s} className="flex flex-1 flex-col items-center gap-1">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${done ? "bg-brand-red text-white" : "bg-brand-off text-brand-gray"}`}>
                        {done ? "✓" : stageNum}
                      </div>
                      <span className="text-center text-[11px] text-brand-gray">{s}</span>
                    </div>
                  );
                })}
              </div>
              <button className="mt-4 w-full rounded-xl border border-brand-red py-2.5 text-sm font-bold text-brand-red">
                رفع صورة المرحلة الحالية
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "completed" && (
        <div className="space-y-3">
          {COMPLETED.map((o) => (
            <div key={o.id} className="flex items-center justify-between rounded-xl border border-brand-border bg-white p-4">
              <div>
                <p className="font-bold">{o.animal}</p>
                <p className="text-sm text-brand-gray">{o.id}</p>
              </div>
              <span className="font-bold text-brand-red">{o.total}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
