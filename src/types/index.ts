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

export interface Service extends BaseEntity {
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

export interface Client extends BaseEntity {
  fullName: string;
  phone?: string;
  email?: string;
}

export interface Vehicle extends BaseEntity {
  plate: string;
  brand: string;
  model: string;
  clientId: string;
}
