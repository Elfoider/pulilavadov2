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

export interface Service extends BaseEntity {
  name: string;
  price: number;
  durationMinutes?: number;
}
