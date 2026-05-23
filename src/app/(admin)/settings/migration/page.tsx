"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { loadLegacyCounts, migrateAll, migrateClients, migrateServices, migrateSettings, migrateWashers, previewMigration } from "@/lib/migration/legacyMigration";

export default function MigrationPage() {
  const [counts, setCounts] = useState<any>(null);
  const [preview, setPreview] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const refresh = async () => setCounts(await loadLegacyCounts());
  useEffect(() => { refresh(); }, []);

  const run = async (fn: () => Promise<any>) => {
    setLoading(true);
    try { setResult(await fn()); await refresh(); } finally { setLoading(false); }
  };

  return <div className="space-y-6">
    <PageHeader title="Migración de datos" subtitle="Migración manual controlada de legacy a v2 (sin borrar legacy)." />
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 rounded-xl border bg-white p-4 text-sm">
      <p>Clientes legacy: <strong>{counts?.legacyClients ?? "-"}</strong></p>
      <p>Servicios legacy: <strong>{counts?.legacyServices ?? "-"}</strong></p>
      <p>Lavadores legacy: <strong>{counts?.legacyWashers ?? "-"}</strong></p>
      <p>Settings legacy: <strong>{counts?.legacySettings ?? "-"}</strong></p>
      <p>Ya migrados: <strong>{counts?.migrated ?? "-"}</strong></p>
      <p>Pendientes: <strong>{counts?.pending ?? "-"}</strong></p>
    </div>

    <div className="flex flex-wrap gap-2">
      <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white" onClick={() => run(async () => { const p = await previewMigration(); setPreview(p); return { preview: true }; })}>Simular migración</button>
      <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white" onClick={() => run(migrateClients)}>Migrar clientes</button>
      <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white" onClick={() => run(migrateServices)}>Migrar servicios</button>
      <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white" onClick={() => run(migrateWashers)}>Migrar lavadores</button>
      <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white" onClick={() => run(migrateSettings)}>Migrar settings</button>
      <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white" onClick={() => run(migrateAll)}>Migrar todo</button>
    </div>

    {loading ? <div className="rounded-xl border bg-white p-4 text-sm">Procesando...</div> : null}
    {result ? <pre className="overflow-x-auto rounded-xl border bg-white p-4 text-xs">{JSON.stringify(result, null, 2)}</pre> : null}
    {preview ? <pre className="overflow-x-auto rounded-xl border bg-white p-4 text-xs">{JSON.stringify({ clients: preview.clients?.slice(0,5), services: preview.services?.slice(0,5), washers: preview.washers?.slice(0,5), settings: preview.settings?.slice(0,5) }, null, 2)}</pre> : null}
  </div>;
}
