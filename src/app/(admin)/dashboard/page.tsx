import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";

const dashboardStats = [
  { label: "Caja del día", value: "$12,450", trend: "+8% vs ayer" },
  { label: "Servicios activos", value: "14", trend: "4 en proceso" },
  { label: "Pendientes por cobrar", value: "6", trend: "$2,180 pendientes" },
  { label: "Inventario bajo", value: "3", trend: "Requiere reposición" },
  { label: "Autos atendidos", value: "39", trend: "+5 hoy" },
  { label: "Ganancia neta", value: "$8,920", trend: "Margen estimado 28%" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Resumen operativo del sistema administrativo de pulilavado."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} trend={stat.trend} />
        ))}
      </section>
    </div>
  );
}
