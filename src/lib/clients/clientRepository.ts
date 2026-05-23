import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { assertDb } from "@/lib/firebase/config";
import { Client } from "@/types";
import { adaptClientDoc } from "@/lib/adapters/clientAdapter";
const COLLECTION = "clients";
export async function createClient(input: Omit<Client, "id" | "createdAt" | "updatedAt">) { await addDoc(collection(assertDb(), COLLECTION), { ...input, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }); }
export function watchClients(cb: (rows: Client[]) => void) {
  return onSnapshot(query(collection(assertDb(), COLLECTION), orderBy("fullName", "asc")), (s) =>
    cb(
      s.docs.map((doc) => {
        const adaptedClient = adaptClientDoc(doc.id, doc.data() as Record<string, unknown>);
        return adaptedClient;
      }),
    ),
  );
}
export async function updateClient(id: string, patch: Partial<Client>) { await updateDoc(doc(assertDb(), COLLECTION, id), { ...patch, updatedAt: serverTimestamp() }); }
export async function deleteClient(id: string) { await deleteDoc(doc(assertDb(), COLLECTION, id)); }
