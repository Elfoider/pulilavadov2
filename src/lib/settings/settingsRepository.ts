import { collection, doc, getDocs, limit, query, setDoc } from "firebase/firestore";
import { assertDb } from "@/lib/firebase/config";
import { adaptSettingsDoc } from "@/lib/adapters/settingsAdapter";

const COLLECTION_V2 = "settings_v2";
const COLLECTION_LEGACY = "settings";
const DOC_ID = "general";

export async function saveSettings(payload: Record<string, unknown>) {
  await setDoc(doc(assertDb(), COLLECTION_V2, DOC_ID), { ...payload, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function loadSettings<T extends Record<string, unknown>>() {
  const db = assertDb();
  const v2Snap = await getDocs(query(collection(db, COLLECTION_V2), limit(1)));
  if (!v2Snap.empty) {
    const d = v2Snap.docs[0];
    return adaptSettingsDoc(d.id, (d.data() ?? {}) as Record<string, unknown>) as T;
  }
  const legacySnap = await getDocs(query(collection(db, COLLECTION_LEGACY), limit(1)));
  if (legacySnap.empty) return {} as T;
  const d = legacySnap.docs[0];
  return adaptSettingsDoc(d.id, (d.data() ?? {}) as Record<string, unknown>) as T;
}
