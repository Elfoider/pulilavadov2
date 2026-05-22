import { Client, Vehicle, VehicleType } from "@/types";

export type VehicleFormValues = Omit<Vehicle, "id" | "createdAt" | "updatedAt">;
const types: VehicleType[] = ["sedan", "suv", "pickup", "moto", "van"];

export function VehicleForm({ values, clients, onChange, onSubmit, submitLabel, onCancel }: { values: VehicleFormValues; clients: Client[]; onChange: (v: VehicleFormValues)=>void; onSubmit: ()=>void; submitLabel: string; onCancel?: ()=>void; }) {
  const set = <K extends keyof VehicleFormValues>(k: K, v: VehicleFormValues[K]) => onChange({ ...values, [k]: v });
  return <form className="grid gap-3" onSubmit={(e)=>{e.preventDefault();onSubmit();}}>
    <div className="grid gap-3 sm:grid-cols-2">
      <input className="rounded-lg border px-3 py-2" placeholder="Placa" value={values.plate} onChange={(e)=>set("plate", e.target.value)} required/>
      <input className="rounded-lg border px-3 py-2" placeholder="Marca" value={values.brand} onChange={(e)=>set("brand", e.target.value)} required/>
      <input className="rounded-lg border px-3 py-2" placeholder="Modelo" value={values.model} onChange={(e)=>set("model", e.target.value)} required/>
      <input className="rounded-lg border px-3 py-2" placeholder="Color" value={values.color} onChange={(e)=>set("color", e.target.value)} required/>
      <select className="rounded-lg border px-3 py-2" value={values.vehicleType} onChange={(e)=>set("vehicleType", e.target.value as VehicleType)}>{types.map(t=><option key={t}>{t}</option>)}</select>
      <select className="rounded-lg border px-3 py-2" value={values.clientId} onChange={(e)=>set("clientId", e.target.value)}>{clients.map(c=><option key={c.id} value={c.id}>{c.fullName}</option>)}</select>
    </div>
    <textarea className="rounded-lg border px-3 py-2" placeholder="Observaciones" value={values.observations ?? ""} onChange={(e)=>set("observations", e.target.value)} />
    <div className="flex gap-2"><button className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">{submitLabel}</button>{onCancel && <button type="button" onClick={onCancel} className="rounded-lg bg-slate-200 px-4 py-2 text-sm">Cancelar</button>}</div>
  </form>;
}
