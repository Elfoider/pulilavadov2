import { CashMovement, ServiceStatus } from "@/types";

export type ReportType =
  | "cierre diario"
  | "servicios realizados"
  | "caja"
  | "lavadores y comisiones"
  | "inventario"
  | "ventas rápidas"
  | "clientes frecuentes";

export interface ReportFilters {
  startDate: string;
  endDate: string;
  reportType: ReportType;
  paymentMethod: string;
  washer: string;
  serviceStatus: ServiceStatus | "all";
}

export const reportTypes: ReportType[] = [
  "cierre diario",
  "servicios realizados",
  "caja",
  "lavadores y comisiones",
  "inventario",
  "ventas rápidas",
  "clientes frecuentes",
];

export const mockDailyClosure = {
  businessName: "Pulilavado Express",
  logoText: "PE",
  date: "2026-05-22",
  responsible: "Supervisor turno mañana",
  incomes: 520,
  expenses: 130,
  services: 340,
  inventory: 110,
  commissions: 70,
  tips: 45,
  netProfit: 365,
  cashDifference: -8,
  observations: "Diferencia por redondeo en efectivo contado.",
};

export const mockCashForReports: CashMovement[] = [
  { id: "r-c1", createdAt: "2026-05-22T08:00:00.000Z", updatedAt: "2026-05-22T08:00:00.000Z", happenedAt: "2026-05-22T08:00:00.000Z", type: "ingreso", concept: "Apertura caja", amount: 120, paymentMethod: "efectivo", responsible: "Supervisor" },
  { id: "r-c2", createdAt: "2026-05-22T10:00:00.000Z", updatedAt: "2026-05-22T10:00:00.000Z", happenedAt: "2026-05-22T10:00:00.000Z", type: "pago servicio", concept: "Lavado premium", amount: 28, paymentMethod: "punto de venta", responsible: "Luis" },
  { id: "r-c3", createdAt: "2026-05-22T11:20:00.000Z", updatedAt: "2026-05-22T11:20:00.000Z", happenedAt: "2026-05-22T11:20:00.000Z", type: "gasto", concept: "Reposición guantes", amount: 12, paymentMethod: "transferencia", responsible: "Supervisor" },
  { id: "r-c4", createdAt: "2026-05-22T12:10:00.000Z", updatedAt: "2026-05-22T12:10:00.000Z", happenedAt: "2026-05-22T12:10:00.000Z", type: "venta inventario", concept: "Microfibra x2", amount: 10, paymentMethod: "pago móvil", responsible: "Pedro" },
];
