import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 md:grid md:grid-cols-[260px_1fr]">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex min-h-screen flex-col">
        <div className="border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <Sidebar compact />
        </div>

        <Topbar />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
