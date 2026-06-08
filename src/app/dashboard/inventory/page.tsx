"use client";

import { useState } from "react";

const INITIAL = [
  { id: "1", name: "خروف نجدي #١", weight: "١٨ كجم", price: "١٤٥٠ ر.س", available: true },
  { id: "2", name: "خروف نجدي #٢", weight: "٢٠ كجم", price: "١٦٠٠ ر.س", available: true },
  { id: "3", name: "خروف نجدي #٣", weight: "١٧ كجم", price: "١٣٥٠ ر.س", available: false },
  { id: "4", name: "ناقة مهرية #١", weight: "٣٢٠ كجم", price: "١٢٠٠٠ ر.س", available: true },
];

export default function InventoryPage() {
  const [animals, setAnimals] = useState(INITIAL);

  function toggle(id: string) {
    setAnimals((prev) => prev.map((a) => (a.id === id ? { ...a, available: !a.available } : a)));
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">المخزون</h1>
      <p className="text-sm text-brand-gray">بدّل حالة كل رأس بين متاح ومباع بسرعة</p>

      <div className="overflow-hidden rounded-2xl border border-brand-border bg-white">
        {animals.map((a, i) => (
          <div key={a.id} className={`flex items-center justify-between p-4 ${i !== 0 ? "border-t border-brand-border" : ""}`}>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-brand-off" />
              <div>
                <p className="font-bold">{a.name}</p>
                <p className="text-sm text-brand-gray">{a.weight} · {a.price}</p>
              </div>
            </div>
            <button
              onClick={() => toggle(a.id)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                a.available ? "bg-brand-red text-white" : "bg-brand-off text-brand-gray"
              }`}
            >
              {a.available ? "متاح" : "مباع"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
