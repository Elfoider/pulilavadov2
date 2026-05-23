import { LegacyWasher, Washer } from "@/types";

export function adaptWasherDoc(id: string, data: Record<string, unknown>): Washer {
  if (typeof data.name === "string" && "createdAt" in data) return { id, ...(data as Omit<Washer, "id">) };
  const legacy = data as unknown as LegacyWasher;
  return {
    id,
    name: legacy.name ?? "Lavador legado",
    phone: legacy.phone ?? "",
    active: Boolean(legacy.active ?? true),
    commissionRate: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    legacyId: id,
    legacy: true,
    rawData: data,
  };
}
