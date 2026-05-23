import { AppSettings, LegacySettings } from "@/types";

export function adaptSettingsDoc(id: string, data: Record<string, unknown>): AppSettings {
  if ("business" in data || "appearance" in data) return { ...(data as AppSettings), legacyId: id };
  const legacy = data as unknown as LegacySettings;
  const result: AppSettings = {
    defaultCommissionPercentage: legacy.defaultCommissionPercentage ?? 0,
    updatedAt: legacy.updatedAt ?? new Date().toISOString(),
    legacyId: id,
    legacy: true,
    rawData: data,
  };
  if (process.env.NODE_ENV === "development") console.log("Legacy settings adapted", result);
  return result;
}

export async function migrateLegacyData() {
  return { ok: true, executed: false };
}
