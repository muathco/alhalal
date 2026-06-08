const PENDING = [
  { id: "1", name: "حضيرة بيت الشمال", region: "المنطقة الشمالية", submitted: "منذ يومين" },
  { id: "2", name: "حضيرة نخيل القصيم", region: "القصيم", submitted: "منذ ٤ أيام" },
];

export default function VerifyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">توثيق الحضائر</h1>
      <p className="text-sm text-brand-gray">راجع وثائق الحضائر الجديدة قبل ظهورها للمشترين</p>

      <div className="space-y-4">
        {PENDING.map((f) => (
          <div key={f.id} className="rounded-2xl border border-brand-border bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="font-bold">{f.name}</p>
                <p className="text-sm text-brand-gray">{f.region} · قُدّم {f.submitted}</p>
              </div>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-dashed border-brand-border bg-brand-off p-4 text-center text-sm text-brand-gray">
                الشهادة البيطرية
              </div>
              <div className="rounded-xl border border-dashed border-brand-border bg-brand-off p-4 text-center text-sm text-brand-gray">
                الهوية / السجل التجاري
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 rounded-xl bg-brand-red py-2.5 font-bold text-white">توثيق</button>
              <button className="flex-1 rounded-xl border border-brand-border py-2.5 font-bold text-brand-gray">رفض</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
