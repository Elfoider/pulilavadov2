import { CashOpeningForm } from "@/types";

export function CashOpeningFormComponent({
  values,
  onChange,
  onSubmit,
}: {
  values: CashOpeningForm;
  onChange: (values: CashOpeningForm) => void;
  onSubmit: () => void;
}) {
  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <input className="rounded-lg border px-3 py-2" type="number" min={0} placeholder="Monto inicial" value={values.initialAmount} onChange={(e) => onChange({ ...values, initialAmount: Number(e.target.value) })} required />
      <input className="rounded-lg border px-3 py-2" placeholder="Responsable" value={values.responsible} onChange={(e) => onChange({ ...values, responsible: e.target.value })} required />
      <textarea className="rounded-lg border px-3 py-2" placeholder="Observaciones" value={values.observations ?? ""} onChange={(e) => onChange({ ...values, observations: e.target.value })} />
      <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">Abrir caja</button>
    </form>
  );
}
