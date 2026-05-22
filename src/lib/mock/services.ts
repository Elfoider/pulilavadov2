import { Service } from "@/types";

export const mockServices: Service[] = [
  { id: "srv-001", createdAt: "2026-05-22T08:30:00.000Z", updatedAt: "2026-05-22T09:10:00.000Z", clientId: "cli-001", vehicleId: "veh-001", client: "Carlos Méndez", phone: "555-120-3344", plate: "ABC-123", brandModel: "Nissan Versa 2022", vehicleType: "sedan", serviceType: "Lavado premium", price: 250, washer: "Luis", paymentMethod: "efectivo", status: "en proceso", observations: "Agregar aromatizante cítrico" },
  { id: "srv-002", createdAt: "2026-05-22T10:00:00.000Z", updatedAt: "2026-05-22T11:00:00.000Z", clientId: "cli-002", vehicleId: "veh-002", client: "María López", phone: "555-893-0021", plate: "XTY-990", brandModel: "Kia Sportage 2021", vehicleType: "suv", serviceType: "Lavado express", price: 180, washer: "Pedro", paymentMethod: "tarjeta", status: "pendiente", observations: "Cliente espera en sala" },
];
