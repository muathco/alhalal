import Image from "next/image";
import Link from "next/link";
import { FARMS } from "@/lib/data";

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="مواشي الحلال"
          fill
          priority
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(26,26,26,0.9) 0%, rgba(26,26,26,0.3) 60%, transparent 100%)",
          }}
        />

        <div className="relative z-10 flex h-full flex-col items-center justify-end gap-5 px-6 pb-16 text-center">
          <Image src="/logo.svg" alt="الحلال" width={140} height={48} className="brightness-0 invert" />

          <span className="rounded-full bg-brand-red px-4 py-1.5 text-sm font-bold text-white">
            سوق المواشي الموثوق
          </span>

          <h1 className="max-w-2xl text-4xl font-bold text-white md:text-5xl">
            اطلب ذبيحتك من حضيرة موثوقة
          </h1>

          <p className="max-w-xl text-lg text-white/70">
            تصفح الحضائر، قارن الأسعار، وتابع ذبيحتك خطوة بخطوة
          </p>

          <Link
            href="/browse"
            className="rounded-xl bg-brand-red px-8 py-4 text-lg font-bold text-white transition hover:opacity-90"
          >
            اطلب الآن ←
          </Link>

          <div className="mt-4 flex items-center gap-6 text-sm text-white/80">
            <span>٢٤ حضيرة موثقة</span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span>١٨٠+ صفقة مكتملة</span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span>تقييم ٤.٨</span>
          </div>
        </div>
      </section>

      {/* كيف يعمل */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-10 text-center text-3xl font-bold">كيف يعمل</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {[
            { step: "١", title: "اختر النوع", desc: "أغنام، إبل، بقر أو ماعز" },
            { step: "٢", title: "اختر الحضيرة", desc: "قارن الأسعار والتقييمات" },
            { step: "٣", title: "أكّد طلبك", desc: "حدد التسليم وادفع بأمان" },
            { step: "٤", title: "تابع ذبيحتك", desc: "خطوة بخطوة حتى وصولها" },
          ].map((item) => (
            <div key={item.step} className="rounded-2xl border border-brand-border bg-white p-6 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-red text-white font-bold">
                {item.step}
              </div>
              <h3 className="mb-1 font-bold">{item.title}</h3>
              <p className="text-sm text-brand-gray">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* لماذا الحلال */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-10 text-center text-3xl font-bold">لماذا الحلال</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { title: "حضائر موثقة", desc: "كل حضيرة تمر بمراجعة وثائق وشهادات بيطرية" },
              { title: "تتبّع الختم", desc: "تابع ذبيحتك بأربع مراحل مصورة حتى التسليم" },
              { title: "ضمان الجودة", desc: "تقييمات حقيقية واسترداد تلقائي عند أي خلل" },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-brand-border bg-brand-off p-6">
                <h3 className="mb-2 font-bold">{item.title}</h3>
                <p className="text-sm text-brand-gray">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* الحضائر المميزة */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-10 text-center text-3xl font-bold">الحضائر المميزة</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {FARMS.slice(0, 3).map((farm) => (
            <Link
              key={farm.id}
              href={`/farm/${farm.id}`}
              className="block rounded-2xl border border-brand-border bg-white p-5 transition hover:shadow-lg"
            >
              <div className="mb-3 flex h-32 items-center justify-center rounded-xl bg-brand-off text-5xl">
                🐑
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold">{farm.name}</h3>
                {farm.is_verified && (
                  <span className="rounded-full bg-brand-off px-2 py-0.5 text-xs font-bold text-brand-dark">
                    ✓ موثّق
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-brand-gray">
                ★{farm.avg_rating} · {farm.total_reviews} تقييم · {farm.region}
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/browse"
            className="inline-block rounded-xl border border-brand-border bg-white px-8 py-3 font-bold text-brand-dark transition hover:bg-brand-off"
          >
            تصفح كل الحضائر ←
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-brand-border bg-brand-dark py-10 text-center text-white/70">
        <Image src="/logo.svg" alt="الحلال" width={100} height={36} className="mx-auto mb-3 brightness-0 invert" />
        <p className="text-sm">© {new Date().getFullYear()} منصة الحلال — جميع الحقوق محفوظة</p>
      </footer>
    </main>
  );
}
