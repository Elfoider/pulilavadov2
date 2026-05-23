import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { assertDb } from "@/lib/firebase/config";
import { Service } from "@/types";
import { adaptServiceDoc } from "@/lib/adapters/serviceAdapter";

const COLLECTION = "services";

export async function createService(input: Omit<Service, "id" | "createdAt" | "updatedAt">) {
  await addDoc(collection(assertDb(), COLLECTION), { ...input, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export function watchServices(cb: (rows: Service[]) => void) {
  return onSnapshot(query(collection(assertDb(), COLLECTION), orderBy("createdAt", "desc")), (snapshot) => {
    const adapted = snapshot.docs.map((doc) => {
      const adaptedService = adaptServiceDoc(doc.id, doc.data() as Record<string, unknown>);
      return adaptedService;
    });

    if (process.env.NODE_ENV === "development") {
      console.log("[services] collection:", COLLECTION);
      console.log("[services] docs count:", snapshot.docs.length);
      console.log("[services] first3 raw:", snapshot.docs.slice(0, 3).map((d) => ({ id: d.id, ...d.data() })));
      console.log("[services] first3 adapted:", adapted.slice(0, 3));
    }

    cb(adapted);
  });
}

export async function updateService(id: string, patch: Partial<Service>) { await updateDoc(doc(assertDb(), COLLECTION, id), { ...patch, updatedAt: serverTimestamp() }); }
export async function deleteService(id: string) { await deleteDoc(doc(assertDb(), COLLECTION, id)); }
