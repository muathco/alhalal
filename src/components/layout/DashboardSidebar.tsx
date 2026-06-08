"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/dashboard", label: "الرئيسية", emoji: "🏠" },
  { href: "/dashboard/orders", label: "الطلبات", emoji: "📋" },
  { href: "/dashboard/inventory", label: "مواشيّ", emoji: "🐑" },
  { href: "/dashboard/stats", label: "الإحصاءات", emoji: "📊" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 border-l border-brand-border bg-white p-4 md:w-56">
      <nav className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                active ? "bg-brand-red text-white" : "text-brand-gray hover:bg-brand-off"
              }`}
            >
              <span>{l.emoji}</span>
              {l.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
