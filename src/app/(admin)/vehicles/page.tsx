"use client";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { mockVehicles } from "@/lib/mock/vehicles";
import { mockClients } from "@/lib/mock/clients";
import { Client, Vehicle } from "@/types";
import { VehicleForm, VehicleFormValues } from "@/components/vehicles/vehicle-form";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [clients] = useState<Client[]>(mockClients);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [values, setValues] = useState<VehicleFormValues>({ plate: "", brand: "", model: "", color: "", vehicleType: "sedan", clientId: clients[0]?.id ?? "", observations: "" });

  const filtered = useMemo(() => vehicles.filter((v) => {
    const owner = clients.find((c) => c.id === v.clientId)?.fullName ?? "";
    return [v.plate, v.brand, v.model, owner].join(" ").toLowerCase().includes(query.toLowerCase());
  }), [vehicles, clients, query]);

  return <div className="space-y-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <PageHeader title="Vehículos" subtitle="Vehículos asociados a clientes." />
      <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white" onClick={()=>{setEditingId(null);setOpen(true);}}>Nuevo vehículo</button>
    </div>
    <input className="w-full rounded-lg border px-3 py-2" placeholder="Buscar por placa, marca, modelo o cliente" value={query} onChange={(e)=>setQuery(e.target.value)} />
    {open && <div className="rounded-xl border bg-white p-4"><VehicleForm values={values} clients={clients} onChange={setValues} submitLabel={editingId?"Guardar":"Crear"} onCancel={()=>setOpen(false)} onSubmit={()=>{const now=new Date().toISOString(); if(editingId){setVehicles(prev=>prev.map(v=>v.id===editingId?{...v,...values,updatedAt:now}:v));} else {setVehicles(prev=>[{id:crypto.randomUUID(),createdAt:now,updatedAt:now,...values},...prev]);} setOpen(false);}}/></div>}
    <div className="overflow-x-auto rounded-xl border bg-white"><table className="min-w-full text-sm"><thead className="bg-slate-50"><tr><th className="px-3 py-2 text-left">Placa</th><th className="px-3 py-2 text-left">Marca/Modelo</th><th className="px-3 py-2 text-left">Tipo</th><th className="px-3 py-2 text-left">Cliente</th><th className="px-3 py-2 text-left">Acciones</th></tr></thead><tbody>{filtered.map(v=>{const owner=clients.find(c=>c.id===v.clientId)?.fullName ?? "-"; return <tr key={v.id} className="border-t"><td className="px-3 py-2">{v.plate}</td><td className="px-3 py-2">{v.brand} {v.model}</td><td className="px-3 py-2">{v.vehicleType}</td><td className="px-3 py-2">{owner}</td><td className="px-3 py-2 flex gap-2"><button className="rounded bg-slate-200 px-2 py-1" onClick={()=>{setEditingId(v.id);setValues({plate:v.plate,brand:v.brand,model:v.model,color:v.color,vehicleType:v.vehicleType,clientId:v.clientId,observations:v.observations??""});setOpen(true);}}>Editar</button><button className="rounded bg-rose-100 px-2 py-1 text-rose-700" onClick={()=>setVehicles(prev=>prev.filter(x=>x.id!==v.id))}>Eliminar</button></td></tr>;})}</tbody></table></div>
  </div>;
}
