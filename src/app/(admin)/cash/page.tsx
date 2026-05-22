"use client";

import { useEffect, useMemo, useState } from "react";
import { CashMovement, CashOpeningForm } from "@/types";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { mockCashMovements, mockCashOpening } from "@/lib/mock/cash";
import { getSharedCashMovements, onSharedCashUpdate } from "@/lib/mock/shared-cash";
import { CashOpeningFormComponent } from "@/components/cash/cash-opening-form";
import { CashMovementForm, CashMovementFormValues } from "@/components/cash/cash-movement-form";
import { CashMovementsTable } from "@/components/cash/cash-movements-table";

const movementInitial: CashMovementFormValues = {
  type: "ingreso",
  concept: "",
  amount: 0,
  paymentMethod: "efectivo",
  responsible: "",
  reference: "",
  observations: "",
};

export default function CashPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [opening, setOpening] = useState<CashOpeningForm>({
    initialAmount: mockCashOpening.initialAmount,
    responsible: mockCashOpening.responsible,
    observations: mockCashOpening.observations,
  });
  const [movements, setMovements] = useState<CashMovement[]>([...getSharedCashMovements(), ...mockCashMovements]);
  const [countedCash, setCountedCash] = useState<number>(0);
  const [inventorySales, setInventorySales] = useState<number>(0);
  const [movementForm, setMovementForm] = useState<CashMovementFormValues>(movementInitial);

  const totals = useMemo(() => {
    const ingresos = movements.filter((m) => m.type === "ingreso").reduce((a, b) => a + b.amount, 0);
    const gastos = movements.filter((m) => m.type === "gasto").reduce((a, b) => a + b.amount, 0);
    const servicios = movements.filter((m) => m.type === "pago servicio").reduce((a, b) => a + b.amount, 0);
    const inventario = movements.filter((m) => m.type === "venta inventario").reduce((a, b) => a + b.amount, 0);
    const propinas = movements.filter((m) => m.type === "propina").reduce((a, b) => a + b.amount, 0);
    const expectedCash = opening.initialAmount + ingresos + servicios + inventario + propinas - gastos;
    const netProfit = ingresos + servicios + inventario + inventorySales - gastos;
    return { ingresos, gastos, servicios, inventario, propinas, expectedCash, netProfit };
  }, [movements, opening.initialAmount, inventorySales]);

  useEffect(() => {
    const sync = () => setMovements([...getSharedCashMovements(), ...mockCashMovements]);
    sync();
    return onSharedCashUpdate(sync);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Caja" subtitle="Control diario de caja del pulilavado" />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Caja" value={isOpen ? "Abierta" : "Cerrada"} />
        <StatCard label="Total ingresos" value={`$${totals.ingresos.toFixed(2)}`} />
        <StatCard label="Total gastos" value={`$${totals.gastos.toFixed(2)}`} />
        <StatCard label="Total servicios cobrados" value={`$${totals.servicios.toFixed(2)}`} />
        <StatCard label="Propinas" value={`$${totals.propinas.toFixed(2)}`} />
        <StatCard label="Ganancia neta" value={`$${totals.netProfit.toFixed(2)}`} />
      </section>

      {!isOpen ? (
        <div className="rounded-xl border bg-white p-4">
          <h3 className="mb-3 font-semibold">Apertura de caja</h3>
          <CashOpeningFormComponent values={opening} onChange={setOpening} onSubmit={() => setIsOpen(true)} />
        </div>
      ) : null}

      {isOpen ? (
        <div className="rounded-xl border bg-white p-4">
          <h3 className="mb-3 font-semibold">Registrar movimiento</h3>
          <CashMovementForm
            values={movementForm}
            onChange={setMovementForm}
            onSubmit={() => {
              const now = new Date().toISOString();
              setMovements((prev) => [
                { id: crypto.randomUUID(), createdAt: now, updatedAt: now, happenedAt: now, ...movementForm },
                ...prev,
              ]);
              setMovementForm(movementInitial);
            }}
          />
        </div>
      ) : null}

      <div className="rounded-xl border bg-white p-4 space-y-3">
        <h3 className="font-semibold">Cierre de caja</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          <p>Monto inicial: <strong>${opening.initialAmount.toFixed(2)}</strong></p>
          <p>Ingresos: <strong>${totals.ingresos.toFixed(2)}</strong></p>
          <p>Gastos: <strong>${totals.gastos.toFixed(2)}</strong></p>
          <p>Ventas de servicios: <strong>${totals.servicios.toFixed(2)}</strong></p>
          <p>Ventas de inventario: <strong>${totals.inventario.toFixed(2)}</strong> <input type="number" min={0} className="ml-2 w-28 rounded border px-2 py-1" value={inventorySales} onChange={(e) => setInventorySales(Number(e.target.value))} /></p>
          <p>Propinas: <strong>${totals.propinas.toFixed(2)}</strong></p>
          <p>Efectivo esperado: <strong>${totals.expectedCash.toFixed(2)}</strong></p>
          <p>Efectivo contado: <input type="number" min={0} className="ml-2 w-28 rounded border px-2 py-1" value={countedCash} onChange={(e) => setCountedCash(Number(e.target.value))} /></p>
          <p>Diferencia: <strong>${(countedCash - totals.expectedCash).toFixed(2)}</strong></p>
          <p>Ganancia neta: <strong>${totals.netProfit.toFixed(2)}</strong></p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-lg bg-rose-600 px-4 py-2 text-sm text-white" onClick={() => setIsOpen(false)}>Cerrar caja</button>
          <button className="rounded-lg bg-slate-200 px-4 py-2 text-sm" onClick={() => setIsOpen(true)}>Abrir caja</button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Historial del día</h3>
        <CashMovementsTable movements={movements} />
      </div>
    </div>
  );
}
