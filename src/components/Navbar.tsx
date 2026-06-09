"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.phone) setUserPhone(data.user.phone);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserPhone(session?.user?.phone ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUserPhone(null);
    router.push("/");
    router.refresh();
  }

  // لا تُظهر الـ navbar في الصفحة الرئيسية (hero مباشر)
  if (pathname === "/") return null;

  return (
    <header className="sticky top-0 z-50 border-b border-brand-border bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        {/* الشعار */}
        <Link href="/" className="shrink-0">
          <Image src="/logo.svg" alt="الحلال" width={90} height={32} />
        </Link>

        {/* روابط رئيسية */}
        <nav className="hidden items-center gap-6 text-sm font-bold sm:flex">
          <Link
            href="/browse"
            className={`transition hover:text-brand-red ${
              pathname.startsWith("/browse") ? "text-brand-red" : "text-brand-dark"
            }`}
          >
            تصفح المواشي
          </Link>
          {userPhone && (
            <Link
              href="/dashboard"
              className={`transition hover:text-brand-red ${
                pathname.startsWith("/dashboard") ? "text-brand-red" : "text-brand-dark"
              }`}
            >
              لوحتي
            </Link>
          )}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {userPhone ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-brand-border px-3 py-2 text-sm font-bold transition hover:bg-brand-off"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-red text-xs text-white">
                  👤
                </span>
                <span className="hidden sm:block">
                  {userPhone.replace("+966", "0").slice(0, 8)}***
                </span>
              </button>
              {menuOpen && (
                <div className="absolute left-0 mt-1 w-40 overflow-hidden rounded-xl border border-brand-border bg-white shadow-lg">
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm font-bold hover:bg-brand-off"
                  >
                    لوحتي
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); handleSignOut(); }}
                    className="w-full px-4 py-2.5 text-right text-sm font-bold text-brand-red hover:bg-brand-off"
                  >
                    تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href={`/auth?next=${encodeURIComponent(pathname)}`}
              className="rounded-xl bg-brand-red px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
            >
              دخول
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
