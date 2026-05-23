import { Client, PaymentMethod, Service, ServiceStatus, Vehicle, VehicleType } from "@/types";

export type ServiceFormValues = Omit<Service, "id" | "createdAt" | "updatedAt">;

interface ServiceFormProps {
  values: ServiceFormValues;
  clients: Client[];
  vehicles: Vehicle[];
  onChange: (values: ServiceFormValues) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  onQuickCreateClient: (name: string) => void;
  onQuickCreateVehicle: (plate: string) => void;
  submitLabel: string;
}

const vehicleTypes: VehicleType[] = ["sedan", "suv", "pickup", "moto", "van"];
const paymentMethods: PaymentMethod[] = ["efectivo", "tarjeta", "transferencia", "mixto"];
const statuses: ServiceStatus[] = ["pendiente", "en proceso", "terminado", "cobrado"];

export function ServiceForm({ values, clients, vehicles, onChange, onSubmit, onCancel, onQuickCreateClient, onQuickCreateVehicle, submitLabel }: ServiceFormProps) {
  const setField = <K extends keyof ServiceFormValues>(field: K, value: ServiceFormValues[K]) => onChange({ ...values, [field]: value });

  return (
    <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1"><label className="text-xs text-slate-500">Cliente</label><select className="w-full rounded-lg border border-slate-300 px-3 py-2" value={values.clientId} onChange={(e) => {const client=clients.find(c=>c.id===e.target.value); setField("clientId", e.target.value); if(client){setField("client", client.fullName); setField("phone", client.phone);} }}>{clients.map((c)=><option key={c.id} value={c.id}>{c.fullName}</option>)}</select><button type="button" className="text-xs text-blue-600" onClick={()=>onQuickCreateClient(values.client || "Cliente rápido")}>+ Crear cliente rápido</button></div>
        <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Teléfono" value={values.phone} onChange={(e) => setField("phone", e.target.value)} required />
        <div className="space-y-1"><label className="text-xs text-slate-500">Vehículo</label><select className="w-full rounded-lg border border-slate-300 px-3 py-2" value={values.vehicleId} onChange={(e) => {const v=vehicles.find(x=>x.id===e.target.value); setField("vehicleId", e.target.value); if(v){setField("plate", v.plate); setField("brandModel", `${v.brand} ${v.model}`); setField("vehicleType", v.vehicleType);} }}>{vehicles.map((v)=><option key={v.id} value={v.id}>{v.plate} - {v.brand} {v.model}</option>)}</select><button type="button" className="text-xs text-blue-600" onClick={()=>onQuickCreateVehicle(values.plate || "RAP-000")}>+ Crear vehículo rápido</button></div>
        <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Placa" value={values.plate} onChange={(e) => setField("plate", e.target.value)} required />
        <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Marca / Modelo" value={values.brandModel} onChange={(e) => setField("brandModel", e.target.value)} required />
        <select className="rounded-lg border border-slate-300 px-3 py-2" value={values.vehicleType} onChange={(e) => setField("vehicleType", e.target.value as VehicleType)}>{vehicleTypes.map((v)=><option key={v} value={v}>{v}</option>)}</select>
        <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Tipo de servicio" value={values.serviceType} onChange={(e) => setField("serviceType", e.target.value)} required />
        <input className="rounded-lg border border-slate-300 px-3 py-2" type="number" min={0} placeholder="Precio" value={values.price} onChange={(e) => setField("price", Number(e.target.value))} required />
        <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Lavador asignado" value={values.washer} onChange={(e) => setField("washer", e.target.value)} required />
        <select className="rounded-lg border border-slate-300 px-3 py-2" value={values.paymentMethod} onChange={(e) => setField("paymentMethod", e.target.value as PaymentMethod)}>{paymentMethods.map((m)=><option key={m} value={m}>{m}</option>)}</select>
        <select className="rounded-lg border border-slate-300 px-3 py-2" value={values.status} onChange={(e) => setField("status", e.target.value as ServiceStatus)}>{statuses.map((s)=><option key={s} value={s}>{s}</option>)}</select>
      </div>
      <textarea className="min-h-24 rounded-lg border border-slate-300 px-3 py-2" placeholder="Observaciones" value={values.observations ?? ""} onChange={(e) => setField("observations", e.target.value)} />
      <div className="flex flex-wrap gap-2"><button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">{submitLabel}</button>{onCancel ? <button type="button" onClick={onCancel} className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700">Cancelar</button> : null}</div>
    </form>
  );
}
