import { ServiceStatus } from "@/types";

const styles: Record<ServiceStatus, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  "en proceso": "bg-blue-100 text-blue-700",
  terminado: "bg-emerald-100 text-emerald-700",
  cobrado: "bg-violet-100 text-violet-700",
};

export function ServiceStatusBadge({ status }: { status: ServiceStatus }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>{status}</span>;
}
