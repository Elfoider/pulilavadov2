"use client";

import { useEffect, useMemo, useState } from "react";
import { ServiceFilters } from "@/components/services/service-filters";
import { ServiceForm, ServiceFormValues } from "@/components/services/service-form";
import { ServicesTable } from "@/components/services/services-table";
import { PageHeader } from "@/components/ui/page-header";
import { mockClients } from "@/lib/mock/clients";
import { mockVehicles } from "@/lib/mock/vehicles";
import { Client, Service, ServiceStatus, Vehicle } from "@/types";
import { createService, deleteService, updateService, watchServices } from "@/lib/services/serviceRepository";

export default function ServicesPage() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<ServiceStatus | "all">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<ServiceFormValues>({
    clientId: clients[0]?.id ?? "",
    vehicleId: vehicles[0]?.id ?? "",
    client: clients[0]?.fullName ?? "",
    phone: clients[0]?.phone ?? "",
    plate: vehicles[0]?.plate ?? "",
    brandModel: vehicles[0] ? `${vehicles[0].brand} ${vehicles[0].model}` : "",
    vehicleType: vehicles[0]?.vehicleType ?? "sedan",
    serviceType: "",
    price: 0,
    washer: "",
    paymentMethod: "efectivo",
    status: "pendiente",
    observations: "",
  });

  useEffect(() => {
    let unsub: (() => void) | undefined;
    try { unsub = watchServices(setServices); } catch { setServices([]); }
    return () => { if (unsub) unsub(); };
  }, []);

  const filteredServices = useMemo(() => services, [services]);

  const resetForm = () => setFormValues({ ...formValues, serviceType: "", price: 0, washer: "", status: "pendiente", observations: "" });

  return (<div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <PageHeader title="Servicios" subtitle="Registra y gestiona servicios de pulilavado." />
      <button onClick={() => { resetForm(); setEditingServiceId(null); setIsFormOpen(true); }} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">Nuevo servicio</button>
    </div>
    <ServiceFilters selectedStatus={selectedStatus} onChange={setSelectedStatus} />
    {isFormOpen ? <div className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="mb-4 text-lg font-semibold">{editingServiceId ? "Editar servicio" : "Nuevo servicio"}</h3><ServiceForm values={formValues} clients={clients} vehicles={vehicles} onChange={setFormValues} onSubmit={async () => {if (editingServiceId) {await updateService(editingServiceId, formValues);} else {await createService(formValues);} setIsFormOpen(false); setEditingServiceId(null);}} onCancel={() => setIsFormOpen(false)} onQuickCreateClient={(name) => {const now = new Date().toISOString(); const newClient: Client = {id: crypto.randomUUID(), createdAt: now, updatedAt: now, fullName: name, phone: formValues.phone || "", documentId: `TEMP-${Date.now()}`}; setClients((prev) => [newClient, ...prev]); setFormValues((prev) => ({ ...prev, clientId: newClient.id, client: newClient.fullName }));}} onQuickCreateVehicle={(plate) => {const now = new Date().toISOString(); const newVehicle: Vehicle = {id: crypto.randomUUID(), createdAt: now, updatedAt: now, plate, brand: "Marca", model: "Modelo", color: "N/A", vehicleType: formValues.vehicleType, clientId: formValues.clientId}; setVehicles((prev) => [newVehicle, ...prev]); setFormValues((prev) => ({ ...prev, vehicleId: newVehicle.id, plate: newVehicle.plate, brandModel: `${newVehicle.brand} ${newVehicle.model}` }));}} submitLabel={editingServiceId ? "Guardar cambios" : "Crear servicio"} /></div> : null}
    <ServicesTable services={filteredServices} onEdit={(service) => {const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = service; setFormValues(rest); setEditingServiceId(service.id); setIsFormOpen(true);}} onDelete={(id) => deleteService(id)} onStatusChange={(id, status) => updateService(id, { status })} onMarkPaid={(id) => updateService(id, { status: "cobrado" })} />
  </div>);
}
