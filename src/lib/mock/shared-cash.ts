import { CashMovement } from "@/types";

const KEY = "pulilavado_cash_movements";
const EVENT = "pulilavado-cash-updated";

export function getSharedCashMovements(): CashMovement[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as CashMovement[]) : [];
}

export function pushSharedCashMovement(movement: CashMovement) {
  if (typeof window === "undefined") return;
  const next = [movement, ...getSharedCashMovements()];
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function onSharedCashUpdate(cb: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
