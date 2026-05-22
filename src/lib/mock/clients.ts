import { Client } from "@/types";

export const mockClients: Client[] = [
  { id: "cli-001", createdAt: "2026-05-20", updatedAt: "2026-05-22", fullName: "Carlos Méndez", phone: "555-120-3344", documentId: "V-12345678", address: "Av. Bolívar", observations: "Cliente frecuente" },
  { id: "cli-002", createdAt: "2026-05-20", updatedAt: "2026-05-22", fullName: "María López", phone: "555-893-0021", documentId: "J-30200111", address: "Urb. El Centro" },
  { id: "cli-003", createdAt: "2026-05-21", updatedAt: "2026-05-22", fullName: "Ana Ruiz", phone: "555-771-1209", documentId: "V-99887766", observations: "Prefiere atención rápida" },
];
