import { LegacyService, Service } from "@/types";

export function adaptServiceDoc(id: string, data: Record<string, unknown>): Service {
  if (typeof data.client === "string" && typeof data.serviceType === "string") return { id, ...(data as Omit<Service, "id">) };
  const legacy = data as unknown as LegacyService;
  return {
    id,
    clientId: `legacy-${id}`,
    vehicleId: `legacy-${id}`,
    client: legacy.clientName ?? "Cliente legado",
    phone: legacy.clientPhone ?? "",
    plate: legacy.vehicle?.bay ?? "N/A",
    brandModel: `${legacy.vehicle?.model ?? "Modelo"} ${legacy.vehicle?.color ?? ""}`.trim(),
    vehicleType: "sedan",
    serviceType: "Servicio legado",
    price: Number(legacy.financials?.totalPrice ?? legacy.financials?.businessEarnings ?? 0),
    washer: legacy.washerName ?? "Lavador legado",
    paymentMethod: (legacy.financials?.paymentMethod as Service["paymentMethod"]) ?? "efectivo",
    status: (legacy.status as Service["status"]) ?? "pendiente",
    observations: `Pago: ${legacy.paymentStatus ?? "N/A"}. Comisión: ${legacy.financials?.commissionRate ?? 0}%`,
    createdAt: legacy.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    legacyId: id,
    legacy: true,
    rawData: data,
  };
}
