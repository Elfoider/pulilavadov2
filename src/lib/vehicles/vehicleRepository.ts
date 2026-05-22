import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { assertDb } from "@/lib/firebase/config";
import { Vehicle } from "@/types";
const COLLECTION = "vehicles";
export async function createVehicle(input: Omit<Vehicle, "id" | "createdAt" | "updatedAt">) { await addDoc(collection(assertDb(), COLLECTION), { ...input, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }); }
export function watchVehicles(cb: (rows: Vehicle[]) => void) { return onSnapshot(query(collection(assertDb(), COLLECTION), orderBy("plate", "asc")), (s) => cb(s.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Vehicle, "id">) } as Vehicle)))); }
export async function updateVehicle(id: string, patch: Partial<Vehicle>) { await updateDoc(doc(assertDb(), COLLECTION, id), { ...patch, updatedAt: serverTimestamp() }); }
export async function deleteVehicle(id: string) { await deleteDoc(doc(assertDb(), COLLECTION, id)); }
