import { LegacyService, Service } from "@/types";

export function adaptServiceDoc(id: string, data: Record<string, unknown>): Service {
  const isLegacy =
    "clientName" in data ||
    "clientPhone" in data ||
    "financials" in data ||
    "vehicle" in data ||
    "washerName" in data ||
    "washerId" in data;

  if (!isLegacy && typeof data.client === "string" && typeof data.serviceType === "string") return { id, ...(data as Omit<Service, "id">) };

  const legacy = data as unknown as LegacyService;
  const payment = (legacy.financials?.paymentMethod ?? "efectivo") as Service["paymentMethod"];
  const result: Service = {
    id,
    clientId: `legacy-${id}`,
    vehicleId: `legacy-${id}`,
    client: legacy.clientName ?? ".",
    phone: legacy.clientPhone ?? "N/A",
    plate: legacy.vehicle?.bay ?? "N/A",
    brandModel: `${legacy.vehicle?.model ?? "Modelo"} ${legacy.vehicle?.color ?? ""}`.trim(),
    vehicleType: "sedan",
    serviceType: "Servicio legado",
    price: Number(legacy.financials?.totalPrice ?? legacy.financials?.businessEarnings ?? 0),
    washer: legacy.washerName ?? "Lavador legado",
    paymentMethod: payment,
    status: (legacy.status as Service["status"]) ?? "pendiente",
    observations: `paymentStatus=${legacy.paymentStatus ?? "N/A"}; tip=${legacy.financials?.tipAmount ?? 0}; tipMethod=${legacy.financials?.tipMethod ?? "N/A"}`,
    createdAt: legacy.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    legacyId: id,
    legacy: true,
    rawData: data,
  };
  if (process.env.NODE_ENV === "development") console.log("Legacy service adapted", result);
  return result;
}
