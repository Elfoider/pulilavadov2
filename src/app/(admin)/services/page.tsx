"use client";

import { useMemo, useState } from "react";
import { ServiceFilters } from "@/components/services/service-filters";
import { ServiceForm, ServiceFormValues } from "@/components/services/service-form";
import { ServicesTable } from "@/components/services/services-table";
import { PageHeader } from "@/components/ui/page-header";
import { mockServices } from "@/lib/mock/services";
import { Service, ServiceStatus } from "@/types";

const emptyForm: ServiceFormValues = {
  client: "",
  phone: "",
  plate: "",
  brandModel: "",
  vehicleType: "sedan",
  serviceType: "",
  price: 0,
  washer: "",
  paymentMethod: "efectivo",
  status: "pendiente",
  observations: "",
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [selectedStatus, setSelectedStatus] = useState<ServiceStatus | "all">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<ServiceFormValues>(emptyForm);

  const filteredServices = useMemo(
    () => services.filter((service) => (selectedStatus === "all" ? true : service.status === selectedStatus)),
    [selectedStatus, services],
  );

  const handleCreateOrUpdate = () => {
    const now = new Date().toISOString();
    if (editingServiceId) {
      setServices((prev) => prev.map((s) => (s.id === editingServiceId ? { ...s, ...formValues, updatedAt: now } : s)));
    } else {
      const newService: Service = { id: crypto.randomUUID(), createdAt: now, updatedAt: now, ...formValues };
      setServices((prev) => [newService, ...prev]);
    }
    setIsFormOpen(false);
    setEditingServiceId(null);
    setFormValues(emptyForm);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title="Servicios" subtitle="Registra y gestiona servicios de pulilavado." />
        <button onClick={() => {setFormValues(emptyForm); setEditingServiceId(null); setIsFormOpen(true);}} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">Nuevo servicio</button>
      </div>

      <ServiceFilters selectedStatus={selectedStatus} onChange={setSelectedStatus} />

      {isFormOpen ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="mb-4 text-lg font-semibold">{editingServiceId ? "Editar servicio" : "Nuevo servicio"}</h3>
          <ServiceForm values={formValues} onChange={setFormValues} onSubmit={handleCreateOrUpdate} onCancel={() => setIsFormOpen(false)} submitLabel={editingServiceId ? "Guardar cambios" : "Crear servicio"} />
        </div>
      ) : null}

      <ServicesTable
        services={filteredServices}
        onEdit={(service) => {
          const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = service;
          setFormValues(rest);
          setEditingServiceId(service.id);
          setIsFormOpen(true);
        }}
        onDelete={(id) => setServices((prev) => prev.filter((service) => service.id !== id))}
        onStatusChange={(id, status) =>
          setServices((prev) => prev.map((service) => (service.id === id ? { ...service, status, updatedAt: new Date().toISOString() } : service)))
        }
        onMarkPaid={(id) =>
          setServices((prev) => prev.map((service) => (service.id === id ? { ...service, status: "cobrado", updatedAt: new Date().toISOString() } : service)))
        }
      />
    </div>
  );
}
