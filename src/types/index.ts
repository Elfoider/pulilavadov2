export type ModuleKey =
  | "dashboard"
  | "services"
  | "clients"
  | "vehicles"
  | "washers"
  | "inventory"
  | "cash"
  | "reports"
  | "settings";

export interface NavItem {
  label: string;
  href: `/${ModuleKey}`;
  key: ModuleKey;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type ServiceStatus = "pendiente" | "en proceso" | "terminado" | "cobrado";
export type PaymentMethod = "efectivo" | "tarjeta" | "transferencia" | "mixto";
export type VehicleType = "sedan" | "suv" | "pickup" | "moto" | "van";

export interface Client extends BaseEntity {
  fullName: string;
  phone: string;
  documentId: string;
  address?: string;
  observations?: string;
}

export interface Vehicle extends BaseEntity {
  plate: string;
  brand: string;
  model: string;
  color: string;
  vehicleType: VehicleType;
  clientId: string;
  observations?: string;
}

export interface Service extends BaseEntity {
  clientId: string;
  vehicleId: string;
  client: string;
  phone: string;
  plate: string;
  brandModel: string;
  vehicleType: VehicleType;
  serviceType: string;
  price: number;
  washer: string;
  paymentMethod: PaymentMethod;
  status: ServiceStatus;
  observations?: string;
}

export type CashMovementType = "ingreso" | "gasto" | "pago servicio" | "propina" | "venta inventario";
export type CashPaymentMethod = "efectivo" | "pago móvil" | "transferencia" | "punto de venta" | "zelle" | "otro";

export interface CashOpeningForm {
  initialAmount: number;
  responsible: string;
  observations?: string;
}

export interface CashMovement extends BaseEntity {
  type: CashMovementType;
  concept: string;
  amount: number;
  paymentMethod: CashPaymentMethod;
  reference?: string;
  observations?: string;
  responsible: string;
  happenedAt: string;
}
