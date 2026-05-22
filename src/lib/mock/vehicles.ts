import { Vehicle } from "@/types";

export const mockVehicles: Vehicle[] = [
  { id: "veh-001", createdAt: "2026-05-20", updatedAt: "2026-05-22", plate: "ABC-123", brand: "Nissan", model: "Versa 2022", color: "Blanco", vehicleType: "sedan", clientId: "cli-001" },
  { id: "veh-002", createdAt: "2026-05-20", updatedAt: "2026-05-22", plate: "XTY-990", brand: "Kia", model: "Sportage 2021", color: "Gris", vehicleType: "suv", clientId: "cli-002" },
  { id: "veh-003", createdAt: "2026-05-21", updatedAt: "2026-05-22", plate: "MNO-456", brand: "Toyota", model: "Hilux 2020", color: "Negro", vehicleType: "pickup", clientId: "cli-003" },
];
