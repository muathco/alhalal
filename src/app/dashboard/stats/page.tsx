const SALES = [
  { day: "السبت", value: 40 },
  { day: "الأحد", value: 65 },
  { day: "الاثنين", value: 50 },
  { day: "الثلاثاء", value: 80 },
  { day: "الأربعاء", value: 60 },
  { day: "الخميس", value: 95 },
  { day: "الجمعة", value: 70 },
];

export default function StatsPage() {
  const max = Math.max(...SALES.map((s) => s.value));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">الإحصاءات</h1>

      <div className="rounded-2xl border border-brand-border bg-white p-5">
        <h3 className="mb-6 font-bold">المبيعات خلال الأسبوع</h3>
        <div className="flex h-48 items-end gap-3">
          {SALES.map((s) => (
            <div key={s.day} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-lg bg-brand-red"
                style={{ height: `${(s.value / max) * 100}%` }}
              />
              <span className="text-xs text-brand-gray">{s.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {[
          { label: "إجمالي الطلبات", value: "٤٦" },
          { label: "معدل القبول", value: "٩٢٪" },
          { label: "متوسط زمن التجهيز", value: "٤ ساعات" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-brand-border bg-white p-5 text-center">
            <p className="text-xl font-bold text-brand-red">{s.value}</p>
            <p className="text-sm text-brand-gray">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
