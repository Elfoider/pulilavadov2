import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { assertDb } from "@/lib/firebase/config";
import { Vehicle } from "@/types";

const COLLECTION_V2 = "vehicles_v2";
const COLLECTION_LEGACY = "vehicles";

export async function createVehicle(input: Omit<Vehicle, "id" | "createdAt" | "updatedAt">) { await addDoc(collection(assertDb(), COLLECTION_V2), { ...input, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }); }

export function watchVehicles(cb: (rows: Vehicle[]) => void) {
  const db = assertDb();
  return onSnapshot(query(collection(db, COLLECTION_V2), orderBy("plate", "asc")), async (v2) => {
    if (!v2.empty) {
      cb(v2.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Vehicle, "id">) } as Vehicle)));
      return;
    }
    const legacy = await getDocs(query(collection(db, COLLECTION_LEGACY), orderBy("plate", "asc")));
    cb(legacy.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Vehicle, "id">) } as Vehicle)));
  });
}

export async function updateVehicle(id: string, patch: Partial<Vehicle>) { await updateDoc(doc(assertDb(), COLLECTION_V2, id), { ...patch, updatedAt: serverTimestamp() }); }
export async function deleteVehicle(id: string) { await deleteDoc(doc(assertDb(), COLLECTION_V2, id)); }
