import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { assertDb } from "@/lib/firebase/config";

export interface InventoryProduct { id: string; name: string; category: string; stock: number; minStock: number; purchasePrice: number; salePrice: number; active: boolean; sku?: string; supplier?: string; observations?: string }
export interface InventoryMovement { id: string; productId: string; type: "entrada" | "salida" | "venta"; quantity: number; responsible: string; observations?: string; createdAt?: unknown }

const PRODUCTS = "inventoryProducts";
const MOVEMENTS = "inventoryMovements";

export async function createInventoryProduct(input: Omit<InventoryProduct, "id">) { await addDoc(collection(assertDb(), PRODUCTS), { ...input, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }); }
export function watchInventoryProducts(cb: (rows: InventoryProduct[]) => void) { return onSnapshot(query(collection(assertDb(), PRODUCTS), orderBy("name", "asc")), (s) => cb(s.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<InventoryProduct, "id">) })))); }
export async function updateInventoryProduct(id: string, patch: Partial<InventoryProduct>) { await updateDoc(doc(assertDb(), PRODUCTS, id), { ...patch, updatedAt: serverTimestamp() }); }
export async function deleteInventoryProduct(id: string) { await deleteDoc(doc(assertDb(), PRODUCTS, id)); }

export async function createInventoryMovement(input: Omit<InventoryMovement, "id">) { await addDoc(collection(assertDb(), MOVEMENTS), { ...input, createdAt: serverTimestamp() }); }
export function watchInventoryMovements(cb: (rows: InventoryMovement[]) => void) { return onSnapshot(query(collection(assertDb(), MOVEMENTS), orderBy("createdAt", "desc")), (s) => cb(s.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<InventoryMovement, "id">) })))); }
