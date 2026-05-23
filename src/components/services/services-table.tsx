import { Service, ServiceStatus } from "@/types";
import { ServiceStatusBadge } from "@/components/services/service-status-badge";

interface ServicesTableProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ServiceStatus) => void;
  onMarkPaid: (id: string) => void;
}

const statuses: ServiceStatus[] = ["pendiente", "en proceso", "terminado", "cobrado"];

export function ServicesTable({ services, onEdit, onDelete, onStatusChange, onMarkPaid }: ServicesTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            <th className="px-4 py-3">Cliente</th><th className="px-4 py-3">Vehículo</th><th className="px-4 py-3">Servicio</th><th className="px-4 py-3">Precio</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3">Origen</th><th className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id} className="border-t border-slate-100">
              <td className="px-4 py-3"><p className="font-medium">{service.client}</p><p className="text-xs text-slate-500">{service.phone}</p></td>
              <td className="px-4 py-3"><p>{service.brandModel}</p><p className="text-xs text-slate-500">{service.plate}</p></td>
              <td className="px-4 py-3">{service.serviceType}</td>
              <td className="px-4 py-3">${service.price.toFixed(2)}</td>
              <td className="px-4 py-3"><ServiceStatusBadge status={service.status} /></td>
              <td className="px-4 py-3">{service.legacy ? "Viejo" : "Nuevo"}{service.legacy ? <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">Dato antiguo</span> : null}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <select value={service.status} onChange={(e) => onStatusChange(service.id, e.target.value as ServiceStatus)} className="rounded border border-slate-300 px-2 py-1 text-xs">{statuses.map((status)=><option key={status} value={status}>{status}</option>)}</select>
                  <button type="button" className="rounded bg-slate-200 px-2 py-1 text-xs" onClick={() => onEdit(service)}>Editar</button>
                  <button type="button" className="rounded bg-emerald-100 px-2 py-1 text-xs text-emerald-700" onClick={() => onMarkPaid(service.id)}>Cobrado</button>
                  <button type="button" className="rounded bg-rose-100 px-2 py-1 text-xs text-rose-700" onClick={() => onDelete(service.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
