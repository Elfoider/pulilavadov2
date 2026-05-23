import { ServiceStatus } from "@/types";

interface ServiceFiltersProps {
  selectedStatus: ServiceStatus | "all";
  onChange: (status: ServiceStatus | "all") => void;
}

const options: Array<{ label: string; value: ServiceStatus | "all" }> = [
  { label: "Todos", value: "all" },
  { label: "Pendiente", value: "pendiente" },
  { label: "En proceso", value: "en proceso" },
  { label: "Terminado", value: "terminado" },
  { label: "Cobrado", value: "cobrado" },
];

export function ServiceFilters({ selectedStatus, onChange }: ServiceFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            selectedStatus === option.value ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
