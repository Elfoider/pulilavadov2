import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { assertDb } from "@/lib/firebase/config";
import { Washer } from "@/types";
import { adaptWasherDoc } from "@/lib/adapters/washerAdapter";

const COLLECTION = "washers";

export async function createWasher(input: Omit<Washer, "id" | "createdAt" | "updatedAt">) { await addDoc(collection(assertDb(), COLLECTION), { ...input, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }); }
export function watchWashers(cb: (rows: Washer[]) => void) { return onSnapshot(query(collection(assertDb(), COLLECTION), orderBy("name", "asc")), (s) => cb(s.docs.map((d) => adaptWasherDoc(d.id, d.data() as Record<string, unknown>)))); }
export async function updateWasher(id: string, patch: Partial<Washer>) { await updateDoc(doc(assertDb(), COLLECTION, id), { ...patch, updatedAt: serverTimestamp() }); }
export async function deleteWasher(id: string) { await deleteDoc(doc(assertDb(), COLLECTION, id)); }
