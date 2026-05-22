import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { assertDb } from "@/lib/firebase/config";
import { CashMovement } from "@/types";

export interface CashSession { id: string; initialAmount: number; responsible: string; observations?: string; isOpen: boolean; openedAt?: unknown; closedAt?: unknown }
const SESSIONS = "cashSessions";
const MOVEMENTS = "cashMovements";

export async function openCashSession(input: Omit<CashSession, "id" | "isOpen">) { await addDoc(collection(assertDb(), SESSIONS), { ...input, isOpen: true, openedAt: serverTimestamp() }); }
export async function closeCashSession(id: string, payload: { observations?: string }) { await updateDoc(doc(assertDb(), SESSIONS, id), { isOpen: false, closedAt: serverTimestamp(), ...payload }); }
export function watchCashSessions(cb: (rows: CashSession[]) => void) { return onSnapshot(query(collection(assertDb(), SESSIONS), orderBy("openedAt", "desc")), (s) => cb(s.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<CashSession, "id">) })))); }

export async function createCashMovement(input: Omit<CashMovement, "id" | "createdAt" | "updatedAt">) { await addDoc(collection(assertDb(), MOVEMENTS), { ...input, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }); }
export function watchCashMovements(cb: (rows: CashMovement[]) => void) { return onSnapshot(query(collection(assertDb(), MOVEMENTS), orderBy("createdAt", "desc")), (s) => cb(s.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<CashMovement, "id">) } as CashMovement)))); }
