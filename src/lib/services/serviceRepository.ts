import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { assertDb } from "@/lib/firebase/config";
import { Service } from "@/types";

const COLLECTION = "services";

export async function createService(input: Omit<Service, "id" | "createdAt" | "updatedAt">) {
  const db = assertDb();
  await addDoc(collection(db, COLLECTION), { ...input, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}
export function watchServices(cb: (rows: Service[]) => void) {
  const db = assertDb();
  return onSnapshot(query(collection(db, COLLECTION), orderBy("createdAt", "desc")), (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Service, "id">) } as Service))));
}
export async function updateService(id: string, patch: Partial<Service>) { await updateDoc(doc(assertDb(), COLLECTION, id), { ...patch, updatedAt: serverTimestamp() }); }
export async function deleteService(id: string) { await deleteDoc(doc(assertDb(), COLLECTION, id)); }
