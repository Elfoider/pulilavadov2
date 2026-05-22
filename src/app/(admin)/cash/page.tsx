import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

export default function CashPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Cash"
        subtitle="Módulo base listo para implementar funcionalidades."
      />
      <Card
        title="En construcción"
        description="Aquí irá la lógica del módulo cash."
      />
    </div>
  );
}
