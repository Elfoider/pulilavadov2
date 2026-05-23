import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { assertDb } from "@/lib/firebase/config";
import { Service } from "@/types";
import { adaptServiceDoc } from "@/lib/adapters/serviceAdapter";

const COLLECTION = "services";

export async function createService(input: Omit<Service, "id" | "createdAt" | "updatedAt">) {
  await addDoc(collection(assertDb(), COLLECTION), { ...input, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export function watchServices(cb: (rows: Service[]) => void) {
  return onSnapshot(query(collection(assertDb(), COLLECTION), orderBy("createdAt", "desc")), (snap) =>
    cb(snap.docs.map((d) => adaptServiceDoc(d.id, d.data() as Record<string, unknown>))),
  );
}

export async function updateService(id: string, patch: Partial<Service>) { await updateDoc(doc(assertDb(), COLLECTION, id), { ...patch, updatedAt: serverTimestamp() }); }
export async function deleteService(id: string) { await deleteDoc(doc(assertDb(), COLLECTION, id)); }
