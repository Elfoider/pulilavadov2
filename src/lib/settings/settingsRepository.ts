import { doc, getDoc, setDoc } from "firebase/firestore";
import { assertDb } from "@/lib/firebase/config";

const COLLECTION = "settings";
const DOC_ID = "general";

export async function saveSettings(payload: Record<string, unknown>) {
  await setDoc(doc(assertDb(), COLLECTION, DOC_ID), { ...payload, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function loadSettings<T extends Record<string, unknown>>() {
  const snap = await getDoc(doc(assertDb(), COLLECTION, DOC_ID));
  return (snap.data() ?? {}) as T;
}
