import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { assertDb } from "@/lib/firebase/config";
import { Service } from "@/types";
import { adaptServiceDoc } from "@/lib/adapters/serviceAdapter";

const COLLECTION_V2 = "services_v2";
const COLLECTION_LEGACY = "services";

export async function createService(input: Omit<Service, "id" | "createdAt" | "updatedAt">) {
  await addDoc(collection(assertDb(), COLLECTION_V2), { ...input, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export function watchServices(cb: (rows: Service[]) => void) {
  const db = assertDb();
  return onSnapshot(query(collection(db, COLLECTION_V2), orderBy("createdAt", "desc")), async (snapshotV2) => {
    if (!snapshotV2.empty) {
      cb(snapshotV2.docs.map((d) => adaptServiceDoc(d.id, d.data() as Record<string, unknown>)));
      return;
    }

    const legacySnap = await getDocs(query(collection(db, COLLECTION_LEGACY), orderBy("createdAt", "desc")));
    cb(legacySnap.docs.map((d) => adaptServiceDoc(d.id, d.data() as Record<string, unknown>)));
  });
}

export async function updateService(id: string, patch: Partial<Service>) { await updateDoc(doc(assertDb(), COLLECTION_V2, id), { ...patch, updatedAt: serverTimestamp() }); }
export async function deleteService(id: string) { await deleteDoc(doc(assertDb(), COLLECTION_V2, id)); }
