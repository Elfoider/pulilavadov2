"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { CashMovement, CashPaymentMethod } from "@/types";
import { pushSharedCashMovement } from "@/lib/mock/shared-cash";

type Category = "químicos" | "accesorios" | "repuestos" | "otros";
type Product = { id: string; name: string; category: Category; sku?: string; purchasePrice: number; salePrice: number; stock: number; minStock: number; supplier?: string; observations?: string; active: boolean };
type InvMove = { id: string; date: string; productId: string; type: "entrada" | "salida" | "venta"; quantity: number; responsible: string; observations?: string };

const productsSeed: Product[] = [
  { id: "p1", name: "Shampoo espuma", category: "químicos", sku: "SH-01", purchasePrice: 8, salePrice: 13, stock: 10, minStock: 6, supplier: "Quimicars", active: true },
  { id: "p2", name: "Paño microfibra", category: "accesorios", purchasePrice: 2, salePrice: 5, stock: 4, minStock: 5, active: true },
];

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(productsSeed);
  const [movements, setMovements] = useState<InvMove[]>([]);
  const [category, setCategory] = useState<Category | "all">("all");
  const [openProduct, setOpenProduct] = useState(false);
  const [quickSale, setQuickSale] = useState({ productId: productsSeed[0].id, quantity: 1, paymentMethod: "efectivo" as CashPaymentMethod, reference: "" });
  const [draft, setDraft] = useState<Omit<Product, "id" | "active">>({ name: "", category: "químicos", sku: "", purchasePrice: 0, salePrice: 0, stock: 0, minStock: 0, supplier: "", observations: "" });

  const filtered = useMemo(() => products.filter((p) => (category === "all" ? true : p.category === category)), [products, category]);
  const lowStock = products.filter((p) => p.stock <= p.minStock);
  const totals = {
    totalProducts: products.length,
    stockLow: lowStock.length,
    inventoryValue: products.reduce((a, p) => a + p.stock * p.purchasePrice, 0),
    salesDay: movements.filter((m) => m.type === "venta").reduce((a, m) => {
      const p = products.find((x) => x.id === m.productId);
      return a + (p ? p.salePrice * m.quantity : 0);
    }, 0),
    estimatedProfit: products.reduce((a, p) => a + p.stock * (p.salePrice - p.purchasePrice), 0),
  };

  const addMovement = (productId: string, type: InvMove["type"], quantity: number, observations: string) => {
    const now = new Date().toISOString();
    setMovements((prev) => [{ id: crypto.randomUUID(), date: now, productId, type, quantity, responsible: "Admin", observations }, ...prev]);
    setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, stock: type === "entrada" ? p.stock + quantity : Math.max(0, p.stock - quantity) } : p));
  };

  const doQuickSale = () => {
    const product = products.find((p) => p.id === quickSale.productId);
    if (!product) return;
    const total = quickSale.quantity * product.salePrice;
    addMovement(product.id, "venta", quickSale.quantity, `Venta rápida (${quickSale.paymentMethod})`);
    const now = new Date().toISOString();
    const cashMove: CashMovement = { id: crypto.randomUUID(), createdAt: now, updatedAt: now, happenedAt: now, type: "venta inventario", concept: `Venta inventario: ${product.name}`, amount: total, paymentMethod: quickSale.paymentMethod, reference: quickSale.reference, responsible: "Admin" };
    pushSharedCashMovement(cashMove);
  };

  return <div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><PageHeader title="Inventario" subtitle="Control de productos y ventas rápidas." /><div className="flex gap-2"><button className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white" onClick={()=>setOpenProduct(true)}>Nuevo producto</button><button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white" onClick={doQuickSale}>Venta rápida</button></div></div>

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard label="Total productos" value={`${totals.totalProducts}`} />
      <StatCard label="Stock bajo" value={`${totals.stockLow}`} />
      <StatCard label="Valor inventario" value={`$${totals.inventoryValue.toFixed(2)}`} />
      <StatCard label="Ventas del día" value={`$${totals.salesDay.toFixed(2)}`} />
      <StatCard label="Ganancia estimada" value={`$${totals.estimatedProfit.toFixed(2)}`} />
    </section>

    <div className="rounded-xl border bg-white p-4 grid gap-3 sm:grid-cols-5">
      <select className="rounded border px-3 py-2" value={category} onChange={(e)=>setCategory(e.target.value as Category|"all")}><option value="all">Todas categorías</option><option value="químicos">Químicos</option><option value="accesorios">Accesorios</option><option value="repuestos">Repuestos</option><option value="otros">Otros</option></select>
      <select className="rounded border px-3 py-2" value={quickSale.productId} onChange={(e)=>setQuickSale(prev=>({...prev,productId:e.target.value}))}>{products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
      <input className="rounded border px-3 py-2" type="number" min={1} value={quickSale.quantity} onChange={(e)=>setQuickSale(prev=>({...prev,quantity:Number(e.target.value)}))} placeholder="Cantidad"/>
      <select className="rounded border px-3 py-2" value={quickSale.paymentMethod} onChange={(e)=>setQuickSale(prev=>({...prev,paymentMethod:e.target.value as CashPaymentMethod}))}><option>efectivo</option><option>pago móvil</option><option>transferencia</option><option>punto de venta</option><option>zelle</option><option>otro</option></select>
      <input className="rounded border px-3 py-2" placeholder="Referencia" value={quickSale.reference} onChange={(e)=>setQuickSale(prev=>({...prev,reference:e.target.value}))}/>
      <p className="sm:col-span-5 text-sm text-slate-600">Total venta rápida: <strong>${(((products.find(p=>p.id===quickSale.productId)?.salePrice)||0)*quickSale.quantity).toFixed(2)}</strong></p>
    </div>

    {lowStock.length>0 && <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-700">Alerta: {lowStock.map(p=>`${p.name} (${p.stock})`).join(", ")} con stock bajo.</div>}

    {openProduct && <div className="rounded-xl border bg-white p-4 grid gap-3 sm:grid-cols-2"><input className="rounded border px-3 py-2" placeholder="Nombre" value={draft.name} onChange={(e)=>setDraft({...draft,name:e.target.value})}/><select className="rounded border px-3 py-2" value={draft.category} onChange={(e)=>setDraft({...draft,category:e.target.value as Category})}><option>químicos</option><option>accesorios</option><option>repuestos</option><option>otros</option></select><input className="rounded border px-3 py-2" placeholder="SKU" value={draft.sku} onChange={(e)=>setDraft({...draft,sku:e.target.value})}/><input className="rounded border px-3 py-2" type="number" placeholder="Precio compra" value={draft.purchasePrice} onChange={(e)=>setDraft({...draft,purchasePrice:Number(e.target.value)})}/><input className="rounded border px-3 py-2" type="number" placeholder="Precio venta" value={draft.salePrice} onChange={(e)=>setDraft({...draft,salePrice:Number(e.target.value)})}/><input className="rounded border px-3 py-2" type="number" placeholder="Stock actual" value={draft.stock} onChange={(e)=>setDraft({...draft,stock:Number(e.target.value)})}/><input className="rounded border px-3 py-2" type="number" placeholder="Stock mínimo" value={draft.minStock} onChange={(e)=>setDraft({...draft,minStock:Number(e.target.value)})}/><input className="rounded border px-3 py-2" placeholder="Proveedor" value={draft.supplier} onChange={(e)=>setDraft({...draft,supplier:e.target.value})}/><textarea className="rounded border px-3 py-2 sm:col-span-2" placeholder="Observaciones" value={draft.observations} onChange={(e)=>setDraft({...draft,observations:e.target.value})}/><div className="sm:col-span-2 flex gap-2"><button className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white" onClick={()=>{setProducts(prev=>[{id:crypto.randomUUID(),active:true,...draft},...prev]);setOpenProduct(false);}}>Crear producto</button><button className="rounded-lg bg-slate-200 px-4 py-2 text-sm" onClick={()=>setOpenProduct(false)}>Cancelar</button></div></div>}

    <div className="overflow-x-auto rounded-xl border bg-white"><table className="min-w-full text-sm"><thead className="bg-slate-50"><tr><th className="px-3 py-2 text-left">Producto</th><th className="px-3 py-2 text-left">Categoría</th><th className="px-3 py-2 text-left">Stock</th><th className="px-3 py-2 text-left">Precios</th><th className="px-3 py-2 text-left">Estado</th><th className="px-3 py-2 text-left">Acciones</th></tr></thead><tbody>{filtered.map(p=><tr key={p.id} className="border-t"><td className="px-3 py-2">{p.name}<p className="text-xs text-slate-500">{p.sku || "Sin SKU"}</p></td><td className="px-3 py-2">{p.category}</td><td className="px-3 py-2">{p.stock} / min {p.minStock}</td><td className="px-3 py-2">C: ${p.purchasePrice} · V: ${p.salePrice}</td><td className="px-3 py-2">{p.active ? "Activo" : "Inactivo"}</td><td className="px-3 py-2 flex gap-2"><button className="rounded bg-slate-200 px-2 py-1" onClick={()=>setProducts(prev=>prev.map(x=>x.id===p.id?{...x,active:!x.active}:x))}>{p.active?"Inactivar":"Activar"}</button><button className="rounded bg-blue-100 px-2 py-1" onClick={()=>addMovement(p.id,"entrada",1,"Entrada manual")}>+Stock</button><button className="rounded bg-amber-100 px-2 py-1" onClick={()=>addMovement(p.id,"salida",1,"Salida manual")}>-Stock</button><button className="rounded bg-rose-100 px-2 py-1 text-rose-700" onClick={()=>setProducts(prev=>prev.filter(x=>x.id!==p.id))}>Eliminar</button></td></tr>)}</tbody></table></div>

    <div className="space-y-2"><h3 className="font-semibold">Movimientos de inventario</h3><div className="overflow-x-auto rounded-xl border bg-white"><table className="min-w-full text-sm"><thead className="bg-slate-50"><tr><th className="px-3 py-2 text-left">Fecha</th><th className="px-3 py-2 text-left">Producto</th><th className="px-3 py-2 text-left">Tipo</th><th className="px-3 py-2 text-left">Cantidad</th><th className="px-3 py-2 text-left">Responsable</th><th className="px-3 py-2 text-left">Observaciones</th></tr></thead><tbody>{movements.map(m=>{const p=products.find(x=>x.id===m.productId); return <tr key={m.id} className="border-t"><td className="px-3 py-2">{new Date(m.date).toLocaleString("es-VE")}</td><td className="px-3 py-2">{p?.name ?? "-"}</td><td className="px-3 py-2">{m.type}</td><td className="px-3 py-2">{m.quantity}</td><td className="px-3 py-2">{m.responsible}</td><td className="px-3 py-2">{m.observations ?? "-"}</td></tr>;})}</tbody></table></div></div>
  </div>;
}
