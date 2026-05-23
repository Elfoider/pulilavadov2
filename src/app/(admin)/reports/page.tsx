"use client";

import { useEffect, useMemo, useState } from "react";
import { watchCashMovements } from "@/lib/cash/cashRepository";
import { CashMovement } from "@/types";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { mockCashForReports, mockDailyClosure, ReportFilters, reportTypes } from "@/lib/mock/reports";

const today = "2026-05-22";

export default function ReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: today,
    endDate: today,
    reportType: "cierre diario",
    paymentMethod: "all",
    washer: "all",
    serviceStatus: "all",
  });

  const [cashRows, setCashRows] = useState<CashMovement[]>(mockCashForReports);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = watchCashMovements((rows) => {
        setCashRows(rows.length ? rows : mockCashForReports);
        setLoading(false);
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cargar reportes");
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const rows = useMemo(() => {
    const filteredByPayment = cashRows.filter((row) =>
      filters.paymentMethod === "all" ? true : row.paymentMethod === filters.paymentMethod,
    );
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate + "T23:59:59");
    return filteredByPayment.filter((r) => {
      const t = new Date(r.happenedAt);
      return t >= start && t <= end;
    });
  }, [filters.paymentMethod, filters.startDate, filters.endDate, cashRows]);

  const summary = useMemo(() => {
    const ingresos = rows
      .filter((r) => ["ingreso", "pago servicio", "venta inventario"].includes(r.type))
      .reduce((a, b) => a + b.amount, 0);
    const gastos = rows.filter((r) => r.type === "gasto").reduce((a, b) => a + b.amount, 0);
    return {
      ingresos,
      gastos,
      neta: ingresos - gastos,
      servicios: 17,
      comisiones: 70,
      productos: 9,
    };
  }, [rows]);

  const exportPdf = async () => {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(mockDailyClosure.businessName, 14, 16);
    doc.setFontSize(11);
    doc.text("Reporte: Cierre diario", 14, 24);
    doc.text(`Fecha: ${mockDailyClosure.date}`, 14, 30);
    doc.text(`Responsable: ${mockDailyClosure.responsible}`, 14, 36);

    autoTable(doc, {
      startY: 42,
      head: [["Concepto", "Monto"]],
      body: [
        ["Ingresos", `$${mockDailyClosure.incomes}`],
        ["Gastos", `$${mockDailyClosure.expenses}`],
        ["Servicios", `$${mockDailyClosure.services}`],
        ["Inventario", `$${mockDailyClosure.inventory}`],
        ["Comisiones", `$${mockDailyClosure.commissions}`],
        ["Propinas", `$${mockDailyClosure.tips}`],
        ["Ganancia neta", `$${mockDailyClosure.netProfit}`],
        ["Diferencia de caja", `$${mockDailyClosure.cashDifference}`],
      ],
    });

    doc.text(`Observaciones: ${mockDailyClosure.observations}`, 14, (doc as any).lastAutoTable.finalY + 10);
    doc.save(`reporte-cierre-${mockDailyClosure.date}.pdf`);
  };

  const exportExcel = async () => {
    const XLSX = await import("xlsx");
    const data = rows.map((r) => ({
      fecha: new Date(r.happenedAt).toLocaleString("es-VE"),
      tipo: r.type,
      concepto: r.concept,
      metodo: r.paymentMethod,
      monto: r.amount,
      responsable: r.responsible,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    XLSX.writeFile(wb, `reporte-${filters.reportType}-${filters.startDate}.xlsx`);
  };

  if (loading) return <div className="rounded-xl border bg-white p-4 text-sm">Cargando reportes...</div>;

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
      ) : null}
      <PageHeader title="Reportes" subtitle="Panel administrativo de reportes con datos mock/locales." />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Total ingresos" value={`$${summary.ingresos.toFixed(2)}`} />
        <StatCard label="Total gastos" value={`$${summary.gastos.toFixed(2)}`} />
        <StatCard label="Ganancia neta" value={`$${summary.neta.toFixed(2)}`} />
        <StatCard label="Servicios realizados" value={`${summary.servicios}`} />
        <StatCard label="Comisiones pagadas" value={`$${summary.comisiones.toFixed(2)}`} />
        <StatCard label="Productos vendidos" value={`${summary.productos}`} />
      </section>

      <div className="rounded-xl border bg-white p-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <input
          type="date"
          className="rounded border px-3 py-2"
          value={filters.startDate}
          onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value }))}
        />
        <input
          type="date"
          className="rounded border px-3 py-2"
          value={filters.endDate}
          onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value }))}
        />
        <select
          className="rounded border px-3 py-2"
          value={filters.reportType}
          onChange={(e) =>
            setFilters((p) => ({ ...p, reportType: e.target.value as ReportFilters["reportType"] }))
          }
        >
          {reportTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
        <select
          className="rounded border px-3 py-2"
          value={filters.paymentMethod}
          onChange={(e) => setFilters((p) => ({ ...p, paymentMethod: e.target.value }))}
        >
          <option value="all">Método de pago</option>
          <option>efectivo</option>
          <option>pago móvil</option>
          <option>transferencia</option>
          <option>punto de venta</option>
          <option>zelle</option>
          <option>otro</option>
        </select>
        <select
          className="rounded border px-3 py-2"
          value={filters.washer}
          onChange={(e) => setFilters((p) => ({ ...p, washer: e.target.value }))}
        >
          <option value="all">Lavador</option>
          <option>Luis</option>
          <option>Pedro</option>
          <option>Jorge</option>
        </select>
        <select
          className="rounded border px-3 py-2"
          value={filters.serviceStatus}
          onChange={(e) =>
            setFilters((p) => ({ ...p, serviceStatus: e.target.value as ReportFilters["serviceStatus"] }))
          }
        >
          <option value="all">Estado del servicio</option>
          <option>pendiente</option>
          <option>en proceso</option>
          <option>terminado</option>
          <option>cobrado</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={exportPdf} className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">
          Exportar PDF
        </button>
        <button onClick={exportExcel} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white">
          Exportar Excel
        </button>
        <button onClick={() => window.print()} className="rounded-lg bg-slate-200 px-4 py-2 text-sm">
          Imprimir
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-left">Fecha/Hora</th>
              <th className="px-3 py-2 text-left">Tipo</th>
              <th className="px-3 py-2 text-left">Concepto</th>
              <th className="px-3 py-2 text-left">Método de pago</th>
              <th className="px-3 py-2 text-left">Monto</th>
              <th className="px-3 py-2 text-left">Responsable</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-slate-500">
                  Sin datos para los filtros seleccionados.
                </td>
              </tr>
            ) : null}
            {rows.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-3 py-2">{new Date(row.happenedAt).toLocaleString("es-VE")}</td>
                <td className="px-3 py-2">{row.type}</td>
                <td className="px-3 py-2">{row.concept}</td>
                <td className="px-3 py-2">{row.paymentMethod}</td>
                <td className="px-3 py-2">${row.amount.toFixed(2)}</td>
                <td className="px-3 py-2">{row.responsible}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
