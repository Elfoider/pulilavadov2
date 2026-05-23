import { addDoc, collection, doc, getDocs, limit, query, serverTimestamp, where } from "firebase/firestore";
import { assertDb } from "@/lib/firebase/config";
import { adaptClientDoc } from "@/lib/adapters/clientAdapter";
import { adaptServiceDoc } from "@/lib/adapters/serviceAdapter";
import { adaptWasherDoc } from "@/lib/adapters/washerAdapter";
import { adaptSettingsDoc } from "@/lib/adapters/settingsAdapter";

type Bucket = "clients" | "services" | "washers" | "settings";

export async function loadLegacyCounts() {
  const db = assertDb();
  const [clients, services, washers, settings, c2, s2, w2, st2] = await Promise.all([
    getDocs(collection(db, "clients")),
    getDocs(collection(db, "services")),
    getDocs(collection(db, "washers")),
    getDocs(collection(db, "settings")),
    getDocs(collection(db, "clients_v2")),
    getDocs(collection(db, "services_v2")),
    getDocs(collection(db, "washers_v2")),
    getDocs(collection(db, "settings_v2")),
  ]);
  const legacyClients = clients.docs.filter(d => (adaptClientDoc(d.id, d.data() as Record<string, unknown>).legacy)).length;
  const legacyServices = services.docs.filter(d => (adaptServiceDoc(d.id, d.data() as Record<string, unknown>).legacy)).length;
  const legacyWashers = washers.docs.filter(d => (adaptWasherDoc(d.id, d.data() as Record<string, unknown>).legacy)).length;
  const legacySettings = settings.docs.filter(d => (adaptSettingsDoc(d.id, d.data() as Record<string, unknown>).legacy)).length;
  const migrated = c2.size + s2.size + w2.size + st2.size;
  return { legacyClients, legacyServices, legacyWashers, legacySettings, migrated, pending: legacyClients + legacyServices + legacyWashers + legacySettings - migrated };
}

export async function previewMigration() {
  const db = assertDb();
  const [clients, services, washers, settings] = await Promise.all([
    getDocs(query(collection(db, "clients"), limit(5))),
    getDocs(query(collection(db, "services"), limit(5))),
    getDocs(query(collection(db, "washers"), limit(5))),
    getDocs(query(collection(db, "settings"), limit(5))),
  ]);
  return {
    clients: clients.docs.map(d => adaptClientDoc(d.id, d.data() as Record<string, unknown>)),
    services: services.docs.map(d => adaptServiceDoc(d.id, d.data() as Record<string, unknown>)),
    washers: washers.docs.map(d => adaptWasherDoc(d.id, d.data() as Record<string, unknown>)),
    settings: settings.docs.map(d => adaptSettingsDoc(d.id, d.data() as Record<string, unknown>)),
  };
}

async function existsByLegacyId(col: string, legacyId: string) {
  const db = assertDb();
  const snap = await getDocs(query(collection(db, col), where("legacyId", "==", legacyId), limit(1)));
  return !snap.empty;
}

export async function migrateClients() {
  const db = assertDb();
  const source = await getDocs(collection(db, "clients"));
  let migrated = 0, skipped = 0, errors = 0;
  for (const d of source.docs) {
    try {
      const adapted = adaptClientDoc(d.id, d.data() as Record<string, unknown>);
      if (!adapted.legacy) continue;
      if (await existsByLegacyId("clients_v2", d.id)) { skipped++; continue; }
      await addDoc(collection(db, "clients_v2"), { ...adapted, legacyId: d.id, rawData: d.data(), migratedAt: serverTimestamp() });
      if (adapted.address) {
        await addDoc(collection(db, "vehicles_v2"), { plate: "N/A", brand: adapted.address, model: adapted.address, color: adapted.address, clientId: adapted.legacyId, legacyId: d.id, rawData: d.data(), migratedAt: serverTimestamp() });
      }
      migrated++;
    } catch { errors++; }
  }
  return { migrated, skipped, errors };
}

export async function migrateServices() {
  const db = assertDb();
  const source = await getDocs(collection(db, "services"));
  let migrated = 0, skipped = 0, errors = 0;
  for (const d of source.docs) {
    try {
      const adapted = adaptServiceDoc(d.id, d.data() as Record<string, unknown>);
      if (!adapted.legacy) continue;
      if (await existsByLegacyId("services_v2", d.id)) { skipped++; continue; }
      await addDoc(collection(db, "services_v2"), { ...adapted, financials: (d.data() as any).financials ?? null, legacyId: d.id, rawData: d.data(), migratedAt: serverTimestamp() });
      migrated++;
    } catch { errors++; }
  }
  return { migrated, skipped, errors };
}

export async function migrateWashers(defaultCommissionPercentage = 35) {
  const db = assertDb();
  const source = await getDocs(collection(db, "washers"));
  let migrated = 0, skipped = 0, errors = 0;
  for (const d of source.docs) {
    try {
      const adapted = adaptWasherDoc(d.id, d.data() as Record<string, unknown>);
      if (!adapted.legacy) continue;
      if (await existsByLegacyId("washers_v2", d.id)) { skipped++; continue; }
      await addDoc(collection(db, "washers_v2"), { ...adapted, commissionPercentage: defaultCommissionPercentage, legacyId: d.id, rawData: d.data(), migratedAt: serverTimestamp() });
      migrated++;
    } catch { errors++; }
  }
  return { migrated, skipped, errors };
}

export async function migrateSettings() {
  const db = assertDb();
  const source = await getDocs(collection(db, "settings"));
  let migrated = 0, skipped = 0, errors = 0;
  for (const d of source.docs) {
    try {
      const adapted = adaptSettingsDoc(d.id, d.data() as Record<string, unknown>);
      if (!adapted.legacy) continue;
      if (await existsByLegacyId("settings_v2", d.id)) { skipped++; continue; }
      await addDoc(collection(db, "settings_v2"), { defaultCommissionPercentage: adapted.defaultCommissionPercentage ?? 35, legacyId: d.id, rawData: d.data(), migratedAt: serverTimestamp() });
      migrated++;
    } catch { errors++; }
  }
  return { migrated, skipped, errors };
}

export async function migrateAll() {
  const s = await migrateSettings();
  const c = await migrateClients();
  const w = await migrateWashers((s.migrated ? 35 : 35));
  const v = await migrateServices();
  return { settings: s, clients: c, washers: w, services: v };
}
