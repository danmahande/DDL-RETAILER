// Client-side data layer for the DDL Retailer App
// Uses localStorage when running as a native app (Capacitor)
// Falls back to API routes when running as a web app

export interface LocalProduct {
  id: string;
  productId: string;
  productLabel: string;
  brand: string | null;
  category: string;
  unit: string;
  priceTier: string;
  packageSize: string;
  unitCost: number;
  unitPrice: number;
  currentStock: number;
  minStock: number;
  merchantName: string | null;
  isActive: boolean;
  imageUrl: string | null;
}

export interface LocalDemandSignal {
  id: string;
  signalId: string;
  shopkeeperId: string;
  neighborhood: string;
  productCategory: string;
  productLabel: string;
  productId: string;
  packageSize: string;
  priceTier: string;
  quantity: number;
  urgency: string;
  status: string;
  isSynced: boolean;
  syncedAt: string | null;
  privacyApplied: boolean;
  notes: string | null;
  createdAt: string;
  // Geolocation fields — captured via device GPS
  latitude: number | null;
  longitude: number | null;
  locationAccuracy: number | null;
}

export interface LocalRetailerProfile {
  id: string;
  shopkeeperId: string;
  businessName: string;
  contact: string;
  email: string | null;
  neighborhood: string;
}

export interface ConnectionSettings {
  supplierApiUrl: string;
  apiKey: string;
  autoSync: boolean;
  syncIntervalMinutes: number;
}

const PRODUCTS_KEY = 'ddl_products';
const SIGNALS_KEY = 'ddl_signals';
const PROFILE_KEY = 'ddl_profile';
const SEEDED_KEY = 'ddl_seeded_v3';
const CONNECTION_KEY = 'ddl_connection';
const LOGIN_KEY = 'ddl_login_pin';

const DEFAULT_CONNECTION: ConnectionSettings = {
  supplierApiUrl: '',
  apiKey: '',
  autoSync: true,
  syncIntervalMinutes: 5,
};

// ─── Demo Data ─────────────────────────────────────────────────────────────

// Local product images bundled with the app for offline support
const PRODUCT_IMAGES: Record<string, string> = {
  'BV-01': '/images/bv-01.png',
  'BV-02': '/images/bv-02.png',
  'BV-03': '/images/bv-03.png',
  'BV-04': '/images/bv-04.png',
  'GR-01': '/images/gr-01.png',
  'GR-02': '/images/gr-02.png',
  'GR-03': '/images/gr-03.png',
  'GR-04': '/images/gr-04.png',
  'GR-05': '/images/gr-05.png',
  'GR-06': '/images/gr-06.png',
  'DR-01': '/images/dr-01.png',
  'DR-02': '/images/dr-02.png',
  'DR-03': '/images/dr-03.png',
  'BK-01': '/images/bk-01.png',
  'BK-02': '/images/bk-02.png',
  'SN-01': '/images/sn-01.png',
  'SN-02': '/images/sn-02.png',
  'SN-03': '/images/sn-03.png',
  'CL-01': '/images/cl-01.png',
  'CL-02': '/images/cl-02.png',
  'CL-03': '/images/cl-03.png',
  'PC-01': '/images/pc-01.png',
  'PC-02': '/images/pc-02.png',
  'PC-03': '/images/pc-03.png',
};

const DEMO_PRODUCTS: LocalProduct[] = [
  { id: '1', productId: 'BV-01', productLabel: 'Soda 500ml', brand: 'Coca-Cola', category: 'Beverages', unit: '500ml', priceTier: 'budget', packageSize: 'small', unitCost: 800, unitPrice: 1200, currentStock: 245, minStock: 50, merchantName: "Mama Johnson's", isActive: true, imageUrl: PRODUCT_IMAGES['BV-01'] },
  { id: '2', productId: 'BV-02', productLabel: 'Mineral Water 1L', brand: 'Rwenzori', category: 'Beverages', unit: '1L', priceTier: 'budget', packageSize: 'medium', unitCost: 600, unitPrice: 1000, currentStock: 180, minStock: 40, merchantName: "Mama Johnson's", isActive: true, imageUrl: PRODUCT_IMAGES['BV-02'] },
  { id: '3', productId: 'BV-03', productLabel: 'Orange Juice 1L', brand: 'Minute Maid', category: 'Beverages', unit: '1L', priceTier: 'mid-range', packageSize: 'medium', unitCost: 2500, unitPrice: 3500, currentStock: 45, minStock: 20, merchantName: 'Kampala Corner', isActive: true, imageUrl: PRODUCT_IMAGES['BV-03'] },
  { id: '4', productId: 'BV-04', productLabel: 'Beer 500ml', brand: 'Nile Special', category: 'Beverages', unit: '500ml', priceTier: 'mid-range', packageSize: 'small', unitCost: 2000, unitPrice: 3000, currentStock: 96, minStock: 30, merchantName: 'Kampala Corner', isActive: true, imageUrl: PRODUCT_IMAGES['BV-04'] },
  { id: '5', productId: 'GR-01', productLabel: 'Sugar 1kg', brand: 'Kakira', category: 'Groceries', unit: '1kg', priceTier: 'budget', packageSize: 'medium', unitCost: 3200, unitPrice: 4000, currentStock: 89, minStock: 30, merchantName: "Mama Johnson's", isActive: true, imageUrl: PRODUCT_IMAGES['GR-01'] },
  { id: '6', productId: 'GR-02', productLabel: 'Rice 2kg', brand: 'Tilda', category: 'Groceries', unit: '2kg', priceTier: 'mid-range', packageSize: 'large', unitCost: 5500, unitPrice: 7000, currentStock: 67, minStock: 25, merchantName: "Mama Johnson's", isActive: true, imageUrl: PRODUCT_IMAGES['GR-02'] },
  { id: '7', productId: 'GR-03', productLabel: 'Posho 5kg', brand: 'Mukwano', category: 'Groceries', unit: '5kg', priceTier: 'budget', packageSize: 'bulk', unitCost: 8000, unitPrice: 10500, currentStock: 34, minStock: 15, merchantName: 'Kampala Corner', isActive: true, imageUrl: PRODUCT_IMAGES['GR-03'] },
  { id: '8', productId: 'GR-04', productLabel: 'Beans 1kg', brand: 'Nile', category: 'Groceries', unit: '1kg', priceTier: 'budget', packageSize: 'medium', unitCost: 2500, unitPrice: 3500, currentStock: 78, minStock: 25, merchantName: 'Kampala Corner', isActive: true, imageUrl: PRODUCT_IMAGES['GR-04'] },
  { id: '9', productId: 'GR-05', productLabel: 'Cooking Oil 2L', brand: 'Mukwano', category: 'Groceries', unit: '2L', priceTier: 'mid-range', packageSize: 'large', unitCost: 8500, unitPrice: 10500, currentStock: 3, minStock: 15, merchantName: "Mama Johnson's", isActive: true, imageUrl: PRODUCT_IMAGES['GR-05'] },
  { id: '10', productId: 'GR-06', productLabel: 'Salt 500g', brand: 'Kengrow', category: 'Groceries', unit: '500g', priceTier: 'budget', packageSize: 'small', unitCost: 400, unitPrice: 800, currentStock: 200, minStock: 50, merchantName: 'Kampala Corner', isActive: true, imageUrl: PRODUCT_IMAGES['GR-06'] },
  { id: '11', productId: 'DR-01', productLabel: 'Milk 1L', brand: 'Fresh Dairy', category: 'Dairy', unit: '1L', priceTier: 'budget', packageSize: 'medium', unitCost: 1800, unitPrice: 2400, currentStock: 42, minStock: 20, merchantName: "Mama Johnson's", isActive: true, imageUrl: PRODUCT_IMAGES['DR-01'] },
  { id: '12', productId: 'DR-02', productLabel: 'Butter 250g', brand: 'Brookside', category: 'Dairy', unit: '250g', priceTier: 'mid-range', packageSize: 'small', unitCost: 3000, unitPrice: 4000, currentStock: 28, minStock: 10, merchantName: "Mama Johnson's", isActive: true, imageUrl: PRODUCT_IMAGES['DR-02'] },
  { id: '13', productId: 'DR-03', productLabel: 'Yoghurt 500ml', brand: 'Brookside', category: 'Dairy', unit: '500ml', priceTier: 'mid-range', packageSize: 'small', unitCost: 2200, unitPrice: 3000, currentStock: 55, minStock: 15, merchantName: 'Kampala Corner', isActive: true, imageUrl: PRODUCT_IMAGES['DR-03'] },
  { id: '14', productId: 'BK-01', productLabel: 'Bread', brand: 'Hot Loaf', category: 'Bakery', unit: 'loaf', priceTier: 'budget', packageSize: 'medium', unitCost: 1500, unitPrice: 2000, currentStock: 12, minStock: 20, merchantName: 'Bugolobi Stall 12', isActive: true, imageUrl: PRODUCT_IMAGES['BK-01'] },
  { id: '15', productId: 'BK-02', productLabel: 'Rolls (6 pack)', brand: 'Hot Loaf', category: 'Bakery', unit: '6 pack', priceTier: 'budget', packageSize: 'medium', unitCost: 2000, unitPrice: 2800, currentStock: 30, minStock: 15, merchantName: 'Bugolobi Stall 12', isActive: true, imageUrl: PRODUCT_IMAGES['BK-02'] },
  { id: '16', productId: 'SN-01', productLabel: 'Biscuits 200g', brand: 'Britannia', category: 'Snacks', unit: '200g', priceTier: 'budget', packageSize: 'small', unitCost: 800, unitPrice: 1200, currentStock: 150, minStock: 40, merchantName: "Mama Johnson's", isActive: true, imageUrl: PRODUCT_IMAGES['SN-01'] },
  { id: '17', productId: 'SN-02', productLabel: 'Chips 150g', brand: 'Nkosi', category: 'Snacks', unit: '150g', priceTier: 'budget', packageSize: 'sachet', unitCost: 500, unitPrice: 800, currentStock: 220, minStock: 50, merchantName: 'Kampala Corner', isActive: true, imageUrl: PRODUCT_IMAGES['SN-02'] },
  { id: '18', productId: 'SN-03', productLabel: 'Peanuts 250g', brand: 'Local', category: 'Snacks', unit: '250g', priceTier: 'budget', packageSize: 'small', unitCost: 1200, unitPrice: 1800, currentStock: 95, minStock: 30, merchantName: 'Bugolobi Stall 12', isActive: true, imageUrl: PRODUCT_IMAGES['SN-03'] },
  { id: '19', productId: 'CL-01', productLabel: 'Soap Bar', brand: 'Movit', category: 'Cleaning', unit: 'bar', priceTier: 'budget', packageSize: 'sachet', unitCost: 600, unitPrice: 1000, currentStock: 300, minStock: 60, merchantName: "Mama Johnson's", isActive: true, imageUrl: PRODUCT_IMAGES['CL-01'] },
  { id: '20', productId: 'CL-02', productLabel: 'Detergent 1kg', brand: 'Ariel', category: 'Cleaning', unit: '1kg', priceTier: 'mid-range', packageSize: 'medium', unitCost: 4000, unitPrice: 5500, currentStock: 85, minStock: 25, merchantName: 'Kampala Corner', isActive: true, imageUrl: PRODUCT_IMAGES['CL-02'] },
  { id: '21', productId: 'CL-03', productLabel: 'Bleach 1L', brand: 'Jik', category: 'Cleaning', unit: '1L', priceTier: 'budget', packageSize: 'medium', unitCost: 1800, unitPrice: 2500, currentStock: 60, minStock: 20, merchantName: "Mama Johnson's", isActive: true, imageUrl: PRODUCT_IMAGES['CL-03'] },
  { id: '22', productId: 'PC-01', productLabel: 'Toothpaste 100g', brand: 'Colgate', category: 'Personal Care', unit: '100g', priceTier: 'budget', packageSize: 'small', unitCost: 1500, unitPrice: 2200, currentStock: 110, minStock: 30, merchantName: "Mama Johnson's", isActive: true, imageUrl: PRODUCT_IMAGES['PC-01'] },
  { id: '23', productId: 'PC-02', productLabel: 'Toilet Paper 4-roll', brand: 'Rose', category: 'Personal Care', unit: '4-roll', priceTier: 'budget', packageSize: 'medium', unitCost: 2000, unitPrice: 3000, currentStock: 75, minStock: 25, merchantName: 'Kampala Corner', isActive: true, imageUrl: PRODUCT_IMAGES['PC-02'] },
  { id: '24', productId: 'PC-03', productLabel: 'Petroleum Jelly 100g', brand: 'Vaseline', category: 'Personal Care', unit: '100g', priceTier: 'budget', packageSize: 'small', unitCost: 1200, unitPrice: 1800, currentStock: 88, minStock: 30, merchantName: "Mama Johnson's", isActive: true, imageUrl: PRODUCT_IMAGES['PC-03'] },
];

const DEMO_SIGNALS: LocalDemandSignal[] = [
  { id: 's1', signalId: 'SIG-0001', shopkeeperId: 'SK-RETAIL-001', neighborhood: 'Bugolobi Market', productCategory: 'Beverages', productLabel: 'Soda 500ml', productId: 'BV-01', packageSize: 'small', priceTier: 'budget', quantity: 5, urgency: 'urgent', status: 'pending', isSynced: false, syncedAt: null, privacyApplied: false, notes: null, createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), latitude: 0.3132, longitude: 32.6106, locationAccuracy: 15 },
  { id: 's2', signalId: 'SIG-0002', shopkeeperId: 'SK-RETAIL-001', neighborhood: 'Bugolobi Market', productCategory: 'Groceries', productLabel: 'Cooking Oil 2L', productId: 'GR-05', packageSize: 'large', priceTier: 'mid-range', quantity: 3, urgency: 'urgent', status: 'pending', isSynced: false, syncedAt: null, privacyApplied: false, notes: null, createdAt: new Date(Date.now() - 2.5 * 3600000).toISOString(), latitude: 0.3132, longitude: 32.6106, locationAccuracy: 20 },
  { id: 's3', signalId: 'SIG-0003', shopkeeperId: 'SK-RETAIL-001', neighborhood: 'Bugolobi Market', productCategory: 'Dairy', productLabel: 'Milk 1L', productId: 'DR-01', packageSize: 'medium', priceTier: 'budget', quantity: 10, urgency: 'normal', status: 'synced', isSynced: true, syncedAt: new Date(Date.now() - 3 * 3600000).toISOString(), privacyApplied: true, notes: null, createdAt: new Date(Date.now() - 4 * 3600000).toISOString(), latitude: 0.3132, longitude: 32.6106, locationAccuracy: 10 },
  { id: 's4', signalId: 'SIG-0004', shopkeeperId: 'SK-RETAIL-001', neighborhood: 'Bugolobi Market', productCategory: 'Bakery', productLabel: 'Bread', productId: 'BK-01', packageSize: 'medium', priceTier: 'budget', quantity: 20, urgency: 'normal', status: 'assigned', isSynced: true, syncedAt: new Date(Date.now() - 4 * 3600000).toISOString(), privacyApplied: true, notes: null, createdAt: new Date(Date.now() - 5 * 3600000).toISOString(), latitude: 0.3140, longitude: 32.6115, locationAccuracy: 12 },
  { id: 's5', signalId: 'SIG-0005', shopkeeperId: 'SK-RETAIL-001', neighborhood: 'Bugolobi Market', productCategory: 'Groceries', productLabel: 'Sugar 1kg', productId: 'GR-01', packageSize: 'medium', priceTier: 'budget', quantity: 8, urgency: 'low', status: 'in_transit', isSynced: true, syncedAt: new Date(Date.now() - 5 * 3600000).toISOString(), privacyApplied: true, notes: null, createdAt: new Date(Date.now() - 6 * 3600000).toISOString(), latitude: 0.3125, longitude: 32.6098, locationAccuracy: 18 },
  { id: 's6', signalId: 'SIG-0006', shopkeeperId: 'SK-RETAIL-001', neighborhood: 'Bugolobi Market', productCategory: 'Cleaning', productLabel: 'Detergent 1kg', productId: 'CL-02', packageSize: 'medium', priceTier: 'mid-range', quantity: 4, urgency: 'normal', status: 'delivered', isSynced: true, syncedAt: new Date(Date.now() - 6 * 3600000).toISOString(), privacyApplied: true, notes: null, createdAt: new Date(Date.now() - 8 * 3600000).toISOString(), latitude: 0.3135, longitude: 32.6100, locationAccuracy: 8 },
];

const DEMO_PROFILE: LocalRetailerProfile = {
  id: 'p1',
  shopkeeperId: 'SK-RETAIL-001',
  businessName: "Daniel's General Shop",
  contact: '+256 770 123456',
  email: 'daniel@bugolobi.shop',
  neighborhood: 'Bugolobi Market',
};

// ─── Storage helpers ────────────────────────────────────────────────────────

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('localStorage write error:', e);
  }
}

// ─── Seed ───────────────────────────────────────────────────────────────────

export function seedLocalData(): { products: number; signals: number } {
  const alreadySeeded = localStorage.getItem(SEEDED_KEY);
  if (alreadySeeded) {
    // Migrate old signals that don't have lat/lng fields
    const signals = getItem<LocalDemandSignal[]>(SIGNALS_KEY, []);
    const needsMigration = signals.some(s => s.latitude === undefined);
    if (needsMigration) {
      const migrated = signals.map(s => ({
        ...s,
        latitude: s.latitude ?? null,
        longitude: s.longitude ?? null,
        locationAccuracy: s.locationAccuracy ?? null,
      }));
      setItem(SIGNALS_KEY, migrated);
    }

    // Always refresh product image URLs from the latest demo data
    // This ensures local bundled images replace any stale external URLs
    const existingProducts = getItem<LocalProduct[]>(PRODUCTS_KEY, []);
    const refreshed = existingProducts.map(p => {
      const demo = DEMO_PRODUCTS.find(d => d.productId === p.productId);
      if (demo && demo.imageUrl) {
        return { ...p, imageUrl: demo.imageUrl };
      }
      return p;
    });
    setItem(PRODUCTS_KEY, refreshed);

    return { products: DEMO_PRODUCTS.length, signals: DEMO_SIGNALS.length };
  }
  setItem(PRODUCTS_KEY, DEMO_PRODUCTS);
  setItem(SIGNALS_KEY, DEMO_SIGNALS);
  setItem(PROFILE_KEY, DEMO_PROFILE);
  localStorage.setItem(SEEDED_KEY, 'true');
  return { products: DEMO_PRODUCTS.length, signals: DEMO_SIGNALS.length };
}

// ─── Products ───────────────────────────────────────────────────────────────

export function getLocalProducts(): LocalProduct[] {
  return getItem<LocalProduct[]>(PRODUCTS_KEY, DEMO_PRODUCTS)
    .filter(p => p.isActive)
    .sort((a, b) => a.category.localeCompare(b.category) || a.productLabel.localeCompare(b.productLabel));
}

// ─── Signals ────────────────────────────────────────────────────────────────

export function getLocalSignals(): LocalDemandSignal[] {
  return getItem<LocalDemandSignal[]>(SIGNALS_KEY, []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createLocalSignal(data: {
  productLabel: string;
  productId: string;
  productCategory: string;
  packageSize: string;
  priceTier: string;
  quantity: number;
  urgency: string;
  neighborhood: string;
  notes?: string;
  latitude?: number | null;
  longitude?: number | null;
  locationAccuracy?: number | null;
}): LocalDemandSignal {
  const signals = getLocalSignals();
  const newSignal: LocalDemandSignal = {
    id: `local-${Date.now()}`,
    signalId: `SIG-${String(Date.now()).slice(-6)}`,
    shopkeeperId: 'SK-RETAIL-001',
    neighborhood: data.neighborhood || 'Bugolobi Market',
    productCategory: data.productCategory,
    productLabel: data.productLabel,
    productId: data.productId,
    packageSize: data.packageSize,
    priceTier: data.priceTier,
    quantity: data.quantity,
    urgency: data.urgency,
    status: 'pending',
    isSynced: false,
    syncedAt: null,
    privacyApplied: false,
    notes: data.notes || null,
    createdAt: new Date().toISOString(),
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    locationAccuracy: data.locationAccuracy ?? null,
  };
  signals.unshift(newSignal);
  setItem(SIGNALS_KEY, signals);
  return newSignal;
}

export function markSignalSynced(signalId: string): void {
  const signals = getLocalSignals();
  const updated = signals.map(s => {
    if (s.signalId === signalId && !s.isSynced) {
      return {
        ...s,
        isSynced: true,
        syncedAt: new Date().toISOString(),
        privacyApplied: true,
        status: 'synced' as string,
      };
    }
    return s;
  });
  setItem(SIGNALS_KEY, updated);
}

// Fake local sync (for when no supplier API is configured)
export function syncLocalSignals(): { synced: number } {
  const signals = getLocalSignals();
  let count = 0;
  const updated = signals.map(s => {
    if (!s.isSynced) {
      count++;
      return {
        ...s,
        isSynced: true,
        syncedAt: new Date().toISOString(),
        privacyApplied: true,
        status: 'synced' as string,
      };
    }
    return s;
  });
  setItem(SIGNALS_KEY, updated);
  return { synced: count };
}

// Real sync — POST unsynced signals to the supplier dashboard API
export async function syncToSupplierApi(
  connection: ConnectionSettings,
  profile: LocalRetailerProfile
): Promise<{ synced: number; failed: number; errors: string[] }> {
  const signals = getLocalSignals();
  const unsynced = signals.filter(s => !s.isSynced);

  if (unsynced.length === 0) {
    return { synced: 0, failed: 0, errors: [] };
  }

  if (!connection.supplierApiUrl) {
    // No API configured — fall back to local-only sync
    const result = syncLocalSignals();
    return { synced: result.synced, failed: 0, errors: [] };
  }

  const baseUrl = connection.supplierApiUrl.replace(/\/+$/, '');
  let synced = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const signal of unsynced) {
    try {
      const payload = {
        signalId: signal.signalId,
        shopkeeperId: signal.shopkeeperId,
        businessName: profile.businessName,
        neighborhood: signal.neighborhood,
        productCategory: signal.productCategory,
        productLabel: signal.productLabel,
        productId: signal.productId,
        packageSize: signal.packageSize,
        priceTier: signal.priceTier,
        quantity: signal.quantity,
        urgency: signal.urgency,
        notes: signal.notes,
        latitude: signal.latitude,
        longitude: signal.longitude,
        locationAccuracy: signal.locationAccuracy,
        createdAt: signal.createdAt,
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (connection.apiKey) {
        headers['Authorization'] = `Bearer ${connection.apiKey}`;
      }

      const response = await fetch(`${baseUrl}/api/retailer-signals`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        markSignalSynced(signal.signalId);
        synced++;
      } else {
        failed++;
        const body = await response.text().catch(() => '');
        errors.push(`Signal ${signal.signalId}: ${response.status} ${body}`);
      }
    } catch (err) {
      failed++;
      errors.push(`Signal ${signal.signalId}: ${err instanceof Error ? err.message : 'Network error'}`);
    }
  }

  return { synced, failed, errors };
}

// ─── Profile ────────────────────────────────────────────────────────────────

export function getLocalProfile(): LocalRetailerProfile {
  return getItem<LocalRetailerProfile>(PROFILE_KEY, DEMO_PROFILE);
}

export function updateLocalProfile(data: Partial<LocalRetailerProfile>): LocalRetailerProfile {
  const current = getLocalProfile();
  const updated = { ...current, ...data };
  setItem(PROFILE_KEY, updated);
  return updated;
}

// ─── Connection Settings ────────────────────────────────────────────────────

export function getConnectionSettings(): ConnectionSettings {
  return getItem<ConnectionSettings>(CONNECTION_KEY, DEFAULT_CONNECTION);
}

export function updateConnectionSettings(data: Partial<ConnectionSettings>): ConnectionSettings {
  const current = getConnectionSettings();
  const updated = { ...current, ...data };
  setItem(CONNECTION_KEY, updated);
  return updated;
}

export function isSupplierConnected(): boolean {
  const conn = getConnectionSettings();
  return conn.supplierApiUrl.trim().length > 0;
}

// Test connection to the supplier dashboard
export async function testSupplierConnection(url: string, apiKey?: string): Promise<{ ok: boolean; message: string }> {
  try {
    const baseUrl = url.replace(/\/+$/, '');
    const headers: Record<string, string> = {};
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(`${baseUrl}/api/retailer-signals`, {
      method: 'OPTIONS',
      headers,
      signal: AbortSignal.timeout(8000),
    });

    if (response.ok || response.status === 204) {
      return { ok: true, message: 'Connected to supplier dashboard!' };
    }
    return { ok: false, message: `Server responded with ${response.status}` };
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
      return { ok: false, message: 'Cannot reach server. Check the URL and network.' };
    }
    return { ok: false, message: err instanceof Error ? err.message : 'Connection failed' };
  }
}

// ─── Delete / Cancel Signals ────────────────────────────────────────────────

export function deleteLocalSignal(signalId: string): void {
  const signals = getLocalSignals();
  const updated = signals.filter(s => s.signalId !== signalId);
  setItem(SIGNALS_KEY, updated);
}

export function cancelLocalSignal(signalId: string): void {
  const signals = getLocalSignals();
  const updated = signals.map(s => {
    if (s.signalId === signalId) {
      return { ...s, status: 'cancelled' as string };
    }
    return s;
  });
  setItem(SIGNALS_KEY, updated);
}

// ─── Login PIN ──────────────────────────────────────────────────────────────

export function getLoginPin(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LOGIN_KEY);
}

export function setLoginPin(pin: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOGIN_KEY, pin);
}

export function verifyLoginPin(pin: string): boolean {
  const stored = getLoginPin();
  if (!stored) return false;
  return stored === pin;
}

export function hasLoginPin(): boolean {
  return getLoginPin() !== null;
}

// ─── Native detection ───────────────────────────────────────────────────────

export function isNativeApp(): boolean {
  if (typeof window === 'undefined') return false;
  // Capacitor sets this on native platforms
  return !!(window as unknown as { Capacitor?: unknown }).Capacitor;
}

// ─── Geolocation ────────────────────────────────────────────────────────────

export async function getCurrentPosition(): Promise<{
  latitude: number;
  longitude: number;
  accuracy: number;
} | null> {
  try {
    // Try Capacitor Geolocation first (native app)
    if (isNativeApp()) {
      try {
        const { Geolocation } = await import('@capacitor/geolocation');

        // Request permission — handle all states
        try {
          const permStatus = await Geolocation.checkPermissions();
          if (permStatus.location === 'prompt' || permStatus.coarseLocation === 'prompt') {
            const reqResult = await Geolocation.requestPermissions();
            if (reqResult.location === 'denied' && reqResult.coarseLocation === 'denied') {
              console.warn('Location permission denied by user');
              return null;
            }
          } else if (permStatus.location === 'denied' && permStatus.coarseLocation === 'denied') {
            console.warn('Location permission denied — enable in phone Settings > Apps > DDL Retailer > Permissions');
            return null;
          }
        } catch (permErr) {
          console.warn('Permission check failed, trying position anyway:', permErr);
        }

        // Get position with extended timeout for first-time GPS lock
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        });
        return {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
      } catch (capErr) {
        console.warn('Capacitor Geolocation failed, falling back to browser API:', capErr);
        // Don't return null — fall through to browser API
      }
    }

    // Fallback: browser Geolocation API (works in both native WebView and browser)
    if (!navigator.geolocation) {
      console.warn('Geolocation not available in this browser/WebView');
      return null;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          console.warn('Geolocation error:', error.code, error.message);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
      );
    });
  } catch (err) {
    console.warn('Geolocation unexpected error:', err);
    return null;
  }
}
