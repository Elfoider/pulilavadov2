import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        subtitle="Módulo base listo para implementar funcionalidades."
      />
      <Card
        title="En construcción"
        description="Aquí irá la lógica del módulo services."
      />
    </div>
  );
}
