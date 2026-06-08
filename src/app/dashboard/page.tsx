export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">الرئيسية</h1>

      <div className="rounded-2xl border border-brand-red bg-white p-5">
        <p className="font-bold text-brand-red">⚠ لديك ٢ طلب عاجل بانتظار الرد — تبقّى أقل من ٣٠ دقيقة</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "طلبات اليوم", value: "٧" },
          { label: "إجمالي المبيعات", value: "١٢٬٤٠٠ ر.س" },
          { label: "متوسط التقييم", value: "٤.٨" },
          { label: "المخزون المتاح", value: "١٤ رأس" },
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
