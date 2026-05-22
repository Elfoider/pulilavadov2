import { CashMovement } from "@/types";

export function CashMovementsTable({ movements }: { movements: CashMovement[] }) {
  return <div className="overflow-x-auto rounded-xl border bg-white"><table className="min-w-full text-sm"><thead className="bg-slate-50"><tr><th className="px-3 py-2 text-left">Fecha/Hora</th><th className="px-3 py-2 text-left">Tipo</th><th className="px-3 py-2 text-left">Concepto</th><th className="px-3 py-2 text-left">Método</th><th className="px-3 py-2 text-left">Monto</th><th className="px-3 py-2 text-left">Responsable</th></tr></thead><tbody>{movements.map(m=><tr key={m.id} className="border-t"><td className="px-3 py-2">{new Date(m.happenedAt).toLocaleString("es-VE")}</td><td className="px-3 py-2">{m.type}</td><td className="px-3 py-2">{m.concept}</td><td className="px-3 py-2">{m.paymentMethod}</td><td className="px-3 py-2">${m.amount.toFixed(2)}</td><td className="px-3 py-2">{m.responsible}</td></tr>)}</tbody></table></div>;
}
