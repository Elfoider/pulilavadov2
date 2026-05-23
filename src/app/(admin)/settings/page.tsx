"use client";

import { useEffect, useState } from "react";
import { loadSettings, saveSettings } from "@/lib/settings/settingsRepository";
import { PageHeader } from "@/components/ui/page-header";

type Tab = "negocio" | "servicios" | "pagos" | "categorias" | "caja" | "apariencia";

interface ServiceTypeSetting {
  id: string;
  name: string;
  basePrice: number;
  estimatedDuration: number;
  defaultCommission: number;
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("negocio");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLegacySettings, setIsLegacySettings] = useState(false);

  const [business, setBusiness] = useState({
    name: "Pulilavado Express",
    document: "J-12345678-9",
    phone: "0212-555-9988",
    address: "Av. Principal, Local 3",
    logo: "",
    currency: "USD",
  });

  const [serviceTypes, setServiceTypes] = useState<ServiceTypeSetting[]>([
    { id: "s1", name: "Lavado express", basePrice: 10, estimatedDuration: 30, defaultCommission: 2 },
    { id: "s2", name: "Lavado premium", basePrice: 18, estimatedDuration: 50, defaultCommission: 4 },
  ]);
  const [serviceDraft, setServiceDraft] = useState<ServiceTypeSetting>({ id: "", name: "", basePrice: 0, estimatedDuration: 0, defaultCommission: 0 });

  const [paymentMethods, setPaymentMethods] = useState([
    { key: "efectivo", enabled: true },
    { key: "pago móvil", enabled: true },
    { key: "transferencia", enabled: true },
    { key: "punto de venta", enabled: true },
    { key: "zelle", enabled: false },
    { key: "otro", enabled: true },
  ]);

  const [categories, setCategories] = useState([{ id: "c1", name: "Químicos" }, { id: "c2", name: "Accesorios" }]);
  const [categoryDraft, setCategoryDraft] = useState("");

  const [cashSettings, setCashSettings] = useState({
    defaultResponsible: "Supervisor",
    allowDifferenceClose: true,
    showNetProfit: true,
    includeTips: true,
    includeQuickSales: true,
  });

  const [appearance, setAppearance] = useState({ systemName: "Pulilavado Admin", primaryColor: "#0f172a", mode: "claro" as "claro" | "oscuro" });


  useEffect(() => {
    let mounted = true;
    loadSettings<any>()
      .then((data) => {
        if (!mounted) return;
        if ((data as any).legacy) setIsLegacySettings(true);
        if (data.business) setBusiness((p) => ({ ...p, ...(data.business as any) }));
        if (data.serviceTypes) setServiceTypes(data.serviceTypes as any);
        if (data.paymentMethods) setPaymentMethods(data.paymentMethods as any);
        if (data.categories) setCategories(data.categories as any);
        if (data.cashSettings) setCashSettings((p) => ({ ...p, ...(data.cashSettings as any) }));
        if (data.appearance) setAppearance((p) => ({ ...p, ...(data.appearance as any) }));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  const handleSaveAll = async () => {
    setError(null);
    setSuccess(null);
    try {
      await saveSettings({ business, serviceTypes, paymentMethods, categories, cashSettings, appearance });
      setSuccess("Configuración guardada correctamente.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar.");
    }
  };

  const tabs: Array<{ key: Tab; label: string }> = [
    { key: "negocio", label: "Datos del negocio" },
    { key: "servicios", label: "Servicios y precios" },
    { key: "pagos", label: "Métodos de pago" },
    { key: "categorias", label: "Categorías de inventario" },
    { key: "caja", label: "Configuración de caja" },
    { key: "apariencia", label: "Apariencia" },
  ];

  if (loading) return <div className="rounded-xl border bg-white p-4 text-sm">Cargando configuración...</div>;

  return <div className="space-y-6">
    <PageHeader title="Configuración" subtitle="Configura parámetros generales del sistema (mock/local)." />
    <div className="text-sm">Origen: {isLegacySettings ? "Viejo" : "Nuevo"}{isLegacySettings ? <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">Dato antiguo</span> : null}</div>

    {error ? <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}
    {success ? <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</div> : null}

    <div className="flex flex-wrap gap-2">{tabs.map(t => <button key={t.key} onClick={()=>setTab(t.key)} className={`rounded-lg px-3 py-2 text-sm ${tab===t.key?"bg-slate-900 text-white":"bg-white border text-slate-700"}`}>{t.label}</button>)}</div>

    {tab === "negocio" && <section className="rounded-xl border bg-white p-4 grid gap-3 sm:grid-cols-2">
      <input className="rounded border px-3 py-2" placeholder="Nombre del pulilavado" value={business.name} onChange={e=>setBusiness({...business,name:e.target.value})} />
      <input className="rounded border px-3 py-2" placeholder="RIF/Cédula" value={business.document} onChange={e=>setBusiness({...business,document:e.target.value})} />
      <input className="rounded border px-3 py-2" placeholder="Teléfono" value={business.phone} onChange={e=>setBusiness({...business,phone:e.target.value})} />
      <input className="rounded border px-3 py-2" placeholder="Dirección" value={business.address} onChange={e=>setBusiness({...business,address:e.target.value})} />
      <input className="rounded border px-3 py-2" placeholder="Logo opcional (URL/base64)" value={business.logo} onChange={e=>setBusiness({...business,logo:e.target.value})} />
      <select className="rounded border px-3 py-2" value={business.currency} onChange={e=>setBusiness({...business,currency:e.target.value})}><option>USD</option><option>VES</option><option>EUR</option></select>
    </section>}

    {tab === "servicios" && <section className="rounded-xl border bg-white p-4 space-y-4">
      <div className="grid gap-3 sm:grid-cols-4"><input className="rounded border px-3 py-2" placeholder="Tipo de servicio" value={serviceDraft.name} onChange={e=>setServiceDraft({...serviceDraft,name:e.target.value})} /><input type="number" className="rounded border px-3 py-2" placeholder="Precio base" value={serviceDraft.basePrice} onChange={e=>setServiceDraft({...serviceDraft,basePrice:Number(e.target.value)})} /><input type="number" className="rounded border px-3 py-2" placeholder="Duración (min)" value={serviceDraft.estimatedDuration} onChange={e=>setServiceDraft({...serviceDraft,estimatedDuration:Number(e.target.value)})} /><input type="number" className="rounded border px-3 py-2" placeholder="Comisión" value={serviceDraft.defaultCommission} onChange={e=>setServiceDraft({...serviceDraft,defaultCommission:Number(e.target.value)})} /></div>
      <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white" onClick={()=>{if(!serviceDraft.name)return; setServiceTypes(prev=>[{...serviceDraft,id:crypto.randomUUID()},...prev]); setServiceDraft({ id:"", name:"", basePrice:0, estimatedDuration:0, defaultCommission:0 });}}>Crear tipo de servicio</button>
      <div className="overflow-x-auto"><table className="min-w-full text-sm"><thead><tr className="text-left"><th className="py-2">Servicio</th><th>Precio</th><th>Duración</th><th>Comisión</th><th>Acciones</th></tr></thead><tbody>{serviceTypes.map(s=><tr key={s.id} className="border-t"><td className="py-2">{s.name}</td><td>${s.basePrice}</td><td>{s.estimatedDuration} min</td><td>${s.defaultCommission}</td><td className="flex gap-2 py-2"><button className="rounded bg-slate-200 px-2 py-1" onClick={()=>setServiceDraft(s)}>Editar</button><button className="rounded bg-rose-100 px-2 py-1 text-rose-700" onClick={()=>setServiceTypes(prev=>prev.filter(x=>x.id!==s.id))}>Eliminar</button></td></tr>)}</tbody></table></div>
    </section>}

    {tab === "pagos" && <section className="rounded-xl border bg-white p-4 space-y-2">{paymentMethods.map(m=><label key={m.key} className="flex items-center justify-between rounded border p-3"><span className="capitalize">{m.key}</span><input type="checkbox" checked={m.enabled} onChange={()=>setPaymentMethods(prev=>prev.map(x=>x.key===m.key?{...x,enabled:!x.enabled}:x))} /></label>)}</section>}

    {tab === "categorias" && <section className="rounded-xl border bg-white p-4 space-y-3"><div className="flex gap-2"><input className="rounded border px-3 py-2 flex-1" placeholder="Nueva categoría" value={categoryDraft} onChange={e=>setCategoryDraft(e.target.value)} /><button className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white" onClick={()=>{if(!categoryDraft)return; setCategories(prev=>[{id:crypto.randomUUID(),name:categoryDraft},...prev]); setCategoryDraft("");}}>Crear categoría</button></div>{categories.map(c=><div key={c.id} className="flex items-center justify-between rounded border p-3"><input className="rounded border px-2 py-1" value={c.name} onChange={e=>setCategories(prev=>prev.map(x=>x.id===c.id?{...x,name:e.target.value}:x))} /><button className="rounded bg-rose-100 px-2 py-1 text-rose-700" onClick={()=>setCategories(prev=>prev.filter(x=>x.id!==c.id))}>Eliminar</button></div>)}</section>}

    {tab === "caja" && <section className="rounded-xl border bg-white p-4 grid gap-3 sm:grid-cols-2"><input className="rounded border px-3 py-2" placeholder="Responsable por defecto" value={cashSettings.defaultResponsible} onChange={e=>setCashSettings({...cashSettings,defaultResponsible:e.target.value})} />
      <label className="flex items-center gap-2"><input type="checkbox" checked={cashSettings.allowDifferenceClose} onChange={()=>setCashSettings({...cashSettings,allowDifferenceClose:!cashSettings.allowDifferenceClose})} />Permitir cierre con diferencia</label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={cashSettings.showNetProfit} onChange={()=>setCashSettings({...cashSettings,showNetProfit:!cashSettings.showNetProfit})} />Mostrar ganancia neta</label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={cashSettings.includeTips} onChange={()=>setCashSettings({...cashSettings,includeTips:!cashSettings.includeTips})} />Incluir propinas en caja</label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={cashSettings.includeQuickSales} onChange={()=>setCashSettings({...cashSettings,includeQuickSales:!cashSettings.includeQuickSales})} />Incluir ventas rápidas en caja</label>
    </section>}

    {tab === "apariencia" && <section className="rounded-xl border bg-white p-4 grid gap-3 sm:grid-cols-2"><input className="rounded border px-3 py-2" placeholder="Nombre visible del sistema" value={appearance.systemName} onChange={e=>setAppearance({...appearance,systemName:e.target.value})} /><input type="color" className="h-10 w-full rounded border px-2 py-1" value={appearance.primaryColor} onChange={e=>setAppearance({...appearance,primaryColor:e.target.value})} /><select className="rounded border px-3 py-2" value={appearance.mode} onChange={e=>setAppearance({...appearance,mode:e.target.value as "claro"|"oscuro"})}><option value="claro">Modo claro</option><option value="oscuro">Modo oscuro</option></select><div className="rounded border p-3" style={{ borderColor: appearance.primaryColor }}><p className="font-medium">Vista previa</p><p className="text-sm">{appearance.systemName} · {appearance.mode}</p></div></section>}
    <div className="flex justify-end"><button className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white" onClick={handleSaveAll}>Guardar configuración</button></div>
  </div>;
}
