import { Client, LegacyClient } from "@/types";

function normalizeDocumentId(input: unknown): string {
  const raw = typeof input === "string" ? input.trim() : "";
  if (!raw) return "N/A";
  if (raw.toUpperCase().includes("LEGACY")) return "N/A";
  return raw;
}

export function adaptClientDoc(id: string, data: Record<string, unknown>): Client {
  const isLegacy = "vehicleColor" in data || "vehicleModel" in data || "lastVisit" in data || "name" in data || "phone" in data;

  if (!isLegacy && typeof data.fullName === "string") {
    const documentCandidate = (data.documentId ?? data.document ?? data.cedula ?? data.identification ?? data.rif) as unknown;
    return { id, ...(data as Omit<Client, "id">), documentId: normalizeDocumentId(documentCandidate) };
  }

  const legacy = data as unknown as LegacyClient;
  const result: Client = {
    id,
    fullName: legacy.name ?? "Cliente legado",
    phone: legacy.phone ?? "N/A",
    documentId: "N/A",
    address: [legacy.vehicleModel, legacy.vehicleColor].filter(Boolean).join(" "),
    observations: legacy.lastVisit ? `Última visita: ${legacy.lastVisit}` : "Registro legado",
    createdAt: legacy.lastVisit ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    legacyId: id,
    legacy: true,
    rawData: data,
  };
  if (process.env.NODE_ENV === "development") console.log("Legacy client adapted", result);
  return result;
}
