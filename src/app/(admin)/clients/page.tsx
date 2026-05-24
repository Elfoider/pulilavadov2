"use client";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { mockServices } from "@/lib/mock/services";
import { Client } from "@/types";
import { ClientForm, ClientFormValues } from "@/components/clients/client-form";
import { createClient, deleteClient, updateClient, watchClients } from "@/lib/clients/clientRepository";

const empty: ClientFormValues = { fullName: "", phone: "", documentId: "N/A", address: "", observations: "" };

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [values, setValues] = useState<ClientFormValues>(empty);
  const [historyClientId, setHistoryClientId] = useState<string | null>(null);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    try { unsub = watchClients(setClients); } catch { setClients([]); }
    return () => { if (unsub) unsub(); };
  }, []);

  const filtered = useMemo(() => clients.filter((c) => [c.fullName, c.phone, c.documentId].join(" ").toLowerCase().includes(query.toLowerCase())), [clients, query]);
  const history = mockServices.filter((s) => s.clientId === historyClientId);

  return <div className="space-y-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <PageHeader title="Clientes" subtitle="Registro de clientes frecuentes." />
      <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white" onClick={()=>{setValues(empty);setEditingId(null);setOpen(true);}}>Nuevo cliente</button>
    </div>
    <input className="w-full rounded-lg border px-3 py-2" placeholder="Buscar por nombre, teléfono o cédula/RIF" value={query} onChange={(e)=>setQuery(e.target.value)} />
    {open && <div className="rounded-xl border bg-white p-4"><ClientForm values={values} onChange={setValues} submitLabel={editingId?"Guardar":"Crear"} onCancel={()=>setOpen(false)} onSubmit={async ()=>{if(editingId){await updateClient(editingId, values);} else {await createClient(values);} setOpen(false);}}/></div>}
    <div className="overflow-x-auto rounded-xl border bg-white"><table className="min-w-full text-sm"><thead className="bg-slate-50"><tr><th className="px-3 py-2 text-left">Nombre</th><th className="px-3 py-2 text-left">Teléfono</th><th className="px-3 py-2 text-left">Cédula/RIF</th><th className="px-3 py-2 text-left">Origen</th><th className="px-3 py-2 text-left">Acciones</th></tr></thead><tbody>{filtered.map(c=><tr key={c.id} className="border-t"><td className="px-3 py-2">{c.fullName}</td><td className="px-3 py-2">{c.phone}</td><td className="px-3 py-2">{c.documentId && c.documentId !== "LEGACY" ? c.documentId : "N/A"}</td><td className="px-3 py-2">{c.legacy ? "Viejo" : "Nuevo"}{c.legacy ? <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">Dato antiguo</span> : null}</td><td className="px-3 py-2 flex gap-2"><button className="rounded bg-slate-200 px-2 py-1" onClick={()=>{setValues({fullName:c.fullName,phone:c.phone,documentId:(c.documentId && c.documentId !== "LEGACY" ? c.documentId : "N/A"),address:c.address??"",observations:c.observations??""});setEditingId(c.id);setOpen(true);}}>Editar</button><button className="rounded bg-rose-100 px-2 py-1 text-rose-700" onClick={()=>deleteClient(c.id)}>Eliminar</button><button className="rounded bg-blue-100 px-2 py-1 text-blue-700" onClick={()=>setHistoryClientId(c.id)}>Historial</button></td></tr>)}</tbody></table></div>
    {historyClientId && <div className="rounded-xl border bg-white p-4"><h3 className="mb-2 font-semibold">Historial mock de servicios</h3><ul className="list-disc pl-6 text-sm">{history.map(s=><li key={s.id}>{s.serviceType} - {s.plate} - ${s.price}</li>)}{history.length===0 && <li>Sin servicios registrados</li>}</ul></div>}
  </div>;
}
