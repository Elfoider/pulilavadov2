import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { assertDb } from "@/lib/firebase/config";
import { Client } from "@/types";
import { adaptClientDoc } from "@/lib/adapters/clientAdapter";

const COLLECTION_V2 = "clients_v2";
const COLLECTION_LEGACY = "clients";

export async function createClient(input: Omit<Client, "id" | "createdAt" | "updatedAt">) {
  await addDoc(collection(assertDb(), COLLECTION_V2), { ...input, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export function watchClients(cb: (rows: Client[]) => void) {
  const db = assertDb();
  return onSnapshot(query(collection(db, COLLECTION_V2), orderBy("fullName", "asc")), async (snapshotV2) => {
    if (!snapshotV2.empty) {
      cb(snapshotV2.docs.map((d) => adaptClientDoc(d.id, d.data() as Record<string, unknown>)));
      return;
    }

    const legacySnap = await getDocs(query(collection(db, COLLECTION_LEGACY), orderBy("name", "asc")));
    cb(legacySnap.docs.map((d) => adaptClientDoc(d.id, d.data() as Record<string, unknown>)));
  });
}

export async function updateClient(id: string, patch: Partial<Client>) { await updateDoc(doc(assertDb(), COLLECTION_V2, id), { ...patch, updatedAt: serverTimestamp() }); }
export async function deleteClient(id: string) { await deleteDoc(doc(assertDb(), COLLECTION_V2, id)); }
