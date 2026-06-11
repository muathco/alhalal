"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

function normalizePhone(raw: string): string {
  const d = raw.replace(/[^\d]/g, "");
  if (d.startsWith("966")) return `+${d}`;
  if (d.startsWith("0")) return `+966${d.slice(1)}`;
  return `+966${d}`;
}

function AuthContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/browse";

  const [stage, setStage] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setError("");
    const normalized = normalizePhone(phone);
    const { error: err } = await supabase.auth.signInWithOtp({ phone: normalized });
    setLoading(false);
    if (err) {
      setError(err.message.includes("rate")
        ? "تجاوزت الحد المسموح — انتظر دقيقة وحاول مجدداً"
        : "تعذّر إرسال رمز التحقق. تأكد من رقم الجوال وحاول مجدداً");
      return;
    }
    setStage("otp");
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length < 4) return;
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.verifyOtp({
      phone: normalizePhone(phone),
      token: otp,
      type: "sms",
    });
    setLoading(false);
    if (err) {
      setError("رمز التحقق غير صحيح أو منتهي الصلاحية");
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <main className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* شعار */}
        <div className="mb-8 flex justify-center">
          <Image src="/logo.svg" alt="الحلال" width={110} height={38} />
        </div>

        <div className="rounded-2xl border border-brand-border bg-white p-8 shadow-sm">
          {stage === "phone" ? (
            <>
              <h1 className="mb-1 text-center text-2xl font-bold">تسجيل الدخول</h1>
              <p className="mb-6 text-center text-sm text-brand-gray">
                أدخل رقم جوالك — سنرسل لك رمز التحقق
              </p>

              <form onSubmit={sendOtp} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold">رقم الجوال</label>
                  <div className="flex overflow-hidden rounded-xl border border-brand-border focus-within:border-brand-red">
                    <span className="flex items-center bg-brand-off px-3 text-sm font-bold text-brand-gray">
                      +966
                    </span>
                    <input
                      type="tel"
                      dir="ltr"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="5xxxxxxxx"
                      required
                      maxLength={10}
                      className="flex-1 bg-white px-3 py-3 text-sm outline-none"
                    />
                  </div>
                </div>

                {error && (
                  <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-brand-red">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || phone.replace(/\D/g, "").length < 9}
                  className="w-full rounded-xl bg-brand-red py-3.5 font-bold text-white transition hover:opacity-90 disabled:opacity-40"
                >
                  {loading ? "جارٍ الإرسال..." : "إرسال رمز التحقق"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="mb-1 text-center text-2xl font-bold">أدخل رمز التحقق</h1>
              <p className="mb-6 text-center text-sm text-brand-gray">
                أُرسل إلى{" "}
                <span className="font-bold" dir="ltr">
                  {normalizePhone(phone)}
                </span>
              </p>

              <form onSubmit={verifyOtp} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold">رمز OTP</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    dir="ltr"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="• • • • • •"
                    required
                    className="w-full rounded-xl border border-brand-border bg-white px-4 py-4 text-center text-2xl tracking-[0.5em] outline-none focus:border-brand-red"
                  />
                </div>

                {error && (
                  <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-brand-red">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.length < 4}
                  className="w-full rounded-xl bg-brand-red py-3.5 font-bold text-white transition hover:opacity-90 disabled:opacity-40"
                >
                  {loading ? "جارٍ التحقق..." : "تأكيد الدخول"}
                </button>

                <button
                  type="button"
                  onClick={() => { setStage("phone"); setOtp(""); setError(""); }}
                  className="w-full text-sm font-bold text-brand-gray hover:text-brand-dark"
                >
                  ← تغيير رقم الجوال
                </button>
              </form>
            </>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-brand-gray">
          بتسجيل دخولك تقبل{" "}
          <span className="font-bold text-brand-dark">شروط الاستخدام</span>
        </p>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthContent />
    </Suspense>
  );
}
