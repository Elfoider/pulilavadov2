import { Client } from "@/types";

export type ClientFormValues = Omit<Client, "id" | "createdAt" | "updatedAt">;

export function ClientForm({ values, onChange, onSubmit, submitLabel, onCancel }: { values: ClientFormValues; onChange: (v: ClientFormValues) => void; onSubmit: () => void; submitLabel: string; onCancel?: () => void; }) {
  const set = <K extends keyof ClientFormValues>(k: K, v: ClientFormValues[K]) => onChange({ ...values, [k]: v });
  return <form className="grid gap-3" onSubmit={(e)=>{e.preventDefault();onSubmit();}}>
    <div className="grid gap-3 sm:grid-cols-2">
      <input className="rounded-lg border px-3 py-2" placeholder="Nombre" value={values.fullName} onChange={(e)=>set("fullName", e.target.value)} />
      <input className="rounded-lg border px-3 py-2" placeholder="Teléfono" value={values.phone} onChange={(e)=>set("phone", e.target.value)} required/>
      <input className="rounded-lg border px-3 py-2" placeholder="Cédula / RIF" value={values.documentId} onChange={(e)=>set("documentId", e.target.value)} required/>
      <input className="rounded-lg border px-3 py-2" placeholder="Dirección (opcional)" value={values.address ?? ""} onChange={(e)=>set("address", e.target.value)}/>
    </div>
    <textarea className="rounded-lg border px-3 py-2" placeholder="Observaciones" value={values.observations ?? ""} onChange={(e)=>set("observations", e.target.value)}/>
    <div className="flex gap-2"><button className="rounded-lg bg-slate-900 px-4 py-2 text-white text-sm">{submitLabel}</button>{onCancel && <button type="button" onClick={onCancel} className="rounded-lg bg-slate-200 px-4 py-2 text-sm">Cancelar</button>}</div>
  </form>;
}
