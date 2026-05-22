import { CashMovement } from "@/types";

export const mockCashOpening = {
  initialAmount: 120,
  responsible: "Encargado mañana",
  observations: "Caja abierta sin novedad",
  openedAt: "2026-05-22T08:00:00.000Z",
};

export const mockCashMovements: CashMovement[] = [
  {
    id: "mov-001",
    createdAt: "2026-05-22T08:30:00.000Z",
    updatedAt: "2026-05-22T08:30:00.000Z",
    happenedAt: "2026-05-22T08:30:00.000Z",
    type: "pago servicio",
    concept: "Lavado premium - ABC123",
    amount: 25,
    paymentMethod: "efectivo",
    responsible: "Luis",
  },
  {
    id: "mov-002",
    createdAt: "2026-05-22T09:10:00.000Z",
    updatedAt: "2026-05-22T09:10:00.000Z",
    happenedAt: "2026-05-22T09:10:00.000Z",
    type: "gasto",
    concept: "Compra de paños",
    amount: 8,
    paymentMethod: "transferencia",
    responsible: "Luis",
    reference: "TRX-0091",
  },
  {
    id: "mov-003",
    createdAt: "2026-05-22T10:15:00.000Z",
    updatedAt: "2026-05-22T10:15:00.000Z",
    happenedAt: "2026-05-22T10:15:00.000Z",
    type: "propina",
    concept: "Propina cliente Sportage",
    amount: 5,
    paymentMethod: "efectivo",
    responsible: "Pedro",
  },
];
