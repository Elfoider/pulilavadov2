import { CashMovement, CashMovementType, CashPaymentMethod } from "@/types";

export type CashMovementFormValues = Omit<CashMovement, "id" | "createdAt" | "updatedAt" | "happenedAt">;

const types: CashMovementType[] = ["ingreso", "gasto", "pago servicio", "propina"];
const methods: CashPaymentMethod[] = ["efectivo", "pago móvil", "transferencia", "punto de venta", "zelle", "otro"];

export function CashMovementForm({ values, onChange, onSubmit }: { values: CashMovementFormValues; onChange: (v: CashMovementFormValues) => void; onSubmit: () => void; }) {
  const set = <K extends keyof CashMovementFormValues>(k: K, v: CashMovementFormValues[K]) => onChange({ ...values, [k]: v });
  return <form className="grid gap-3" onSubmit={(e)=>{e.preventDefault(); onSubmit();}}>
    <div className="grid gap-3 sm:grid-cols-2">
      <select className="rounded-lg border px-3 py-2" value={values.type} onChange={(e)=>set("type", e.target.value as CashMovementType)}>{types.map(t=><option key={t}>{t}</option>)}</select>
      <input className="rounded-lg border px-3 py-2" placeholder="Concepto" value={values.concept} onChange={(e)=>set("concept", e.target.value)} required />
      <input className="rounded-lg border px-3 py-2" type="number" min={0} placeholder="Monto" value={values.amount} onChange={(e)=>set("amount", Number(e.target.value))} required />
      <select className="rounded-lg border px-3 py-2" value={values.paymentMethod} onChange={(e)=>set("paymentMethod", e.target.value as CashPaymentMethod)}>{methods.map(m=><option key={m}>{m}</option>)}</select>
      <input className="rounded-lg border px-3 py-2" placeholder="Referencia (opcional)" value={values.reference ?? ""} onChange={(e)=>set("reference", e.target.value)} />
      <input className="rounded-lg border px-3 py-2" placeholder="Responsable" value={values.responsible} onChange={(e)=>set("responsible", e.target.value)} required />
    </div>
    <textarea className="rounded-lg border px-3 py-2" placeholder="Observaciones" value={values.observations ?? ""} onChange={(e)=>set("observations", e.target.value)} />
    <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">Registrar movimiento</button>
  </form>;
}
