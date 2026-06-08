export default function AdminOverview() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">نظرة عامة</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "إجمالي الحضائر", value: "٢٤" },
          { label: "حضائر بانتظار التوثيق", value: "٣" },
          { label: "إجمالي الطلبات", value: "١٨٢" },
          { label: "نزاعات مفتوحة", value: "٢" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-brand-border bg-white p-5 text-center">
            <p className="text-xl font-bold text-brand-red">{s.value}</p>
            <p className="text-sm text-brand-gray">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-brand-border bg-white p-5">
        <h3 className="mb-4 font-bold">جميع الحضائر</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-brand-border p-3">
              <div>
                <p className="font-bold">حضيرة الوادي {i}</p>
                <p className="text-sm text-brand-gray">المنطقة الوسطى · تقييم ٤.٨</p>
              </div>
              <div className="flex gap-2">
                <button className="rounded-lg border border-brand-border px-3 py-1.5 text-sm text-brand-gray">تعليق</button>
                <button className="rounded-lg bg-brand-red px-3 py-1.5 text-sm font-bold text-white">تفعيل</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
