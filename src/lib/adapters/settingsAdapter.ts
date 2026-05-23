import { AppSettings, LegacySettings } from "@/types";

export function adaptSettingsDoc(id: string, data: Record<string, unknown>): AppSettings {
  if ("business" in data || "appearance" in data) return { ...(data as AppSettings), legacyId: id };
  const legacy = data as unknown as LegacySettings;
  return {
    defaultCommissionPercentage: legacy.defaultCommissionPercentage ?? 0,
    updatedAt: legacy.updatedAt ?? new Date().toISOString(),
    legacyId: id,
    legacy: true,
    rawData: data,
  };
}

export async function migrateLegacyData() {
  // Función futura: migrar datos legacy -> nuevo esquema Firestore.
  // Intencionalmente NO se ejecuta automáticamente.
  return { ok: true, executed: false };
}
