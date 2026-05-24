import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { assertDb } from "@/lib/firebase/config";
import { Washer } from "@/types";
import { adaptWasherDoc } from "@/lib/adapters/washerAdapter";

const COLLECTION_V2 = "washers_v2";
const COLLECTION_LEGACY = "washers";

export async function createWasher(input: Omit<Washer, "id" | "createdAt" | "updatedAt">) { await addDoc(collection(assertDb(), COLLECTION_V2), { ...input, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }); }
export function watchWashers(cb: (rows: Washer[]) => void) {
  const db = assertDb();
  return onSnapshot(query(collection(db, COLLECTION_V2), orderBy("name", "asc")), async (v2) => {
    if (!v2.empty) {
      cb(v2.docs.map((d) => adaptWasherDoc(d.id, d.data() as Record<string, unknown>)));
      return;
    }
    const legacy = await getDocs(query(collection(db, COLLECTION_LEGACY), orderBy("name", "asc")));
    cb(legacy.docs.map((d) => adaptWasherDoc(d.id, d.data() as Record<string, unknown>)));
  });
}
export async function updateWasher(id: string, patch: Partial<Washer>) { await updateDoc(doc(assertDb(), COLLECTION_V2, id), { ...patch, updatedAt: serverTimestamp() }); }
export async function deleteWasher(id: string) { await deleteDoc(doc(assertDb(), COLLECTION_V2, id)); }
