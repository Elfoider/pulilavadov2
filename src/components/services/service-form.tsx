import { PaymentMethod, Service, ServiceStatus, VehicleType } from "@/types";

export type ServiceFormValues = Omit<Service, "id" | "createdAt" | "updatedAt">;

interface ServiceFormProps {
  values: ServiceFormValues;
  onChange: (values: ServiceFormValues) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  submitLabel: string;
}

const vehicleTypes: VehicleType[] = ["sedan", "suv", "pickup", "moto", "van"];
const paymentMethods: PaymentMethod[] = ["efectivo", "tarjeta", "transferencia", "mixto"];
const statuses: ServiceStatus[] = ["pendiente", "en proceso", "terminado", "cobrado"];

export function ServiceForm({ values, onChange, onSubmit, onCancel, submitLabel }: ServiceFormProps) {
  const setField = <K extends keyof ServiceFormValues>(field: K, value: ServiceFormValues[K]) => {
    onChange({ ...values, [field]: value });
  };

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Cliente" value={values.client} onChange={(e) => setField("client", e.target.value)} required />
        <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Teléfono" value={values.phone} onChange={(e) => setField("phone", e.target.value)} required />
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

      <div className="flex flex-wrap gap-2">
        <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">{submitLabel}</button>
        {onCancel ? <button type="button" onClick={onCancel} className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700">Cancelar</button> : null}
      </div>
    </form>
  );
}
