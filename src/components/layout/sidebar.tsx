"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavItems } from "@/lib/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-full w-full border-r border-slate-200 bg-white p-4">
      <div className="mb-6 px-2">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Pulilavado</p>
        <h2 className="text-lg font-semibold text-slate-900">Admin Panel</h2>
      </div>

      <nav className="space-y-1">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
