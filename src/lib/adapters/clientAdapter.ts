import { Client, LegacyClient } from "@/types";

export function adaptClientDoc(id: string, data: Record<string, unknown>): Client {
  if (typeof data.fullName === "string") return { id, ...(data as Omit<Client, "id">) };
  const legacy = data as unknown as LegacyClient;
  return {
    id,
    fullName: legacy.name ?? "Cliente legado",
    phone: legacy.phone ?? "",
    documentId: "LEGACY",
    address: [legacy.vehicleModel, legacy.vehicleColor].filter(Boolean).join(" - "),
    observations: legacy.lastVisit ? `Última visita: ${legacy.lastVisit}` : "Registro legado",
    createdAt: legacy.lastVisit ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    legacyId: id,
    legacy: true,
    rawData: data,
  };
}
