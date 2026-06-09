"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function normalizePhone(input: string): string {
  const digits = input.replace(/[^\d]/g, "");
  if (digits.startsWith("966")) return `+${digits}`;
  if (digits.startsWith("0")) return `+966${digits.slice(1)}`;
  return `+966${digits}`;
}

function AuthContent() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";

  const [stage, setStage] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ phone: normalizePhone(phone) });
    setLoading(false);
    if (error) {
      setError("تعذّر إرسال رمز التحقق. تأكد من رقم الجوال وحاول مجدداً");
      return;
    }
    setStage("otp");
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.verifyOtp({
      phone: normalizePhone(phone),
      token: otp,
      type: "sms",
    });
    setLoading(false);
    if (error) {
      setError("رمز التحقق غير صحيح أو منتهي الصلاحية");
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6 py-10">
      <h1 className="mb-2 text-center text-2xl font-bold">تسجيل الدخول</h1>
      <p className="mb-8 text-center text-sm text-brand-gray">
        {stage === "phone" ? "أدخل رقم جوالك لإرسال رمز التحقق" : `أدخل الرمز المرسل إلى ${normalizePhone(phone)}`}
      </p>

      {stage === "phone" ? (
        <form onSubmit={sendOtp} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold">رقم الجوال</label>
            <input
              type="tel"
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="05xxxxxxxx"
              required
              className="w-full rounded-xl border border-brand-border bg-white p-3 text-left text-sm outline-none focus:border-brand-red"
            />
          </div>
          {error && <p className="text-sm text-brand-red">{error}</p>}
          <button
            type="submit"
            disabled={loading || !phone.trim()}
            className="w-full rounded-xl bg-brand-red py-3.5 text-lg font-bold text-white disabled:opacity-40"
          >
            {loading ? "جارٍ الإرسال..." : "إرسال رمز التحقق"}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold">رمز التحقق (OTP)</label>
            <input
              type="text"
              inputMode="numeric"
              dir="ltr"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="••••••"
              required
              className="w-full rounded-xl border border-brand-border bg-white p-3 text-center text-lg tracking-widest outline-none focus:border-brand-red"
            />
          </div>
          {error && <p className="text-sm text-brand-red">{error}</p>}
          <button
            type="submit"
            disabled={loading || otp.length < 4}
            className="w-full rounded-xl bg-brand-red py-3.5 text-lg font-bold text-white disabled:opacity-40"
          >
            {loading ? "جارٍ التحقق..." : "تأكيد"}
          </button>
          <button type="button" onClick={() => setStage("phone")} className="w-full text-sm font-bold text-brand-gray">
            تغيير رقم الجوال
          </button>
        </form>
      )}
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
