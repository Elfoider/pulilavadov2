"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Washer } from "@/types";
import { watchWashers } from "@/lib/washers/washerRepository";

export default function WashersPage() {
  const [rows, setRows] = useState<Washer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    try {
      unsub = watchWashers((data) => {
        setRows(data);
        setLoading(false);
      });
    } catch {
      setLoading(false);
    }
    return () => {
      if (unsub) unsub();
    };
  }, []);

  if (loading) return <div className="rounded-xl border bg-white p-4 text-sm">Cargando lavadores...</div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Lavadores" subtitle="Compatibilidad visual con datos legacy y nuevos." />
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50"><tr><th className="px-3 py-2 text-left">Nombre</th><th className="px-3 py-2 text-left">Teléfono</th><th className="px-3 py-2 text-left">Activo</th><th className="px-3 py-2 text-left">Origen</th></tr></thead>
          <tbody>
            {rows.map((w) => <tr key={w.id} className="border-t"><td className="px-3 py-2">{w.name}</td><td className="px-3 py-2">{w.phone ?? "-"}</td><td className="px-3 py-2">{w.active ? "Sí" : "No"}</td><td className="px-3 py-2">{w.legacy ? "Viejo" : "Nuevo"}{w.legacy ? <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">Dato antiguo</span> : null}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
