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
}

export interface LocalRetailerProfile {
  id: string;
  shopkeeperId: string;
  businessName: string;
  contact: string;
  email: string | null;
  neighborhood: string;
}

const PRODUCTS_KEY = 'ddl_products';
const SIGNALS_KEY = 'ddl_signals';
const PROFILE_KEY = 'ddl_profile';
const SEEDED_KEY = 'ddl_seeded';

// ─── Demo Data ─────────────────────────────────────────────────────────────

const DEMO_PRODUCTS: LocalProduct[] = [
  { id: '1', productId: 'BV-01', productLabel: 'Soda 500ml', brand: 'Coca-Cola', category: 'Beverages', unit: '500ml', priceTier: 'budget', packageSize: 'small', unitCost: 800, unitPrice: 1200, currentStock: 245, minStock: 50, merchantName: "Mama Johnson's", isActive: true },
  { id: '2', productId: 'BV-02', productLabel: 'Mineral Water 1L', brand: 'Rwenzori', category: 'Beverages', unit: '1L', priceTier: 'budget', packageSize: 'medium', unitCost: 600, unitPrice: 1000, currentStock: 180, minStock: 40, merchantName: "Mama Johnson's", isActive: true },
  { id: '3', productId: 'BV-03', productLabel: 'Orange Juice 1L', brand: 'Minute Maid', category: 'Beverages', unit: '1L', priceTier: 'mid-range', packageSize: 'medium', unitCost: 2500, unitPrice: 3500, currentStock: 45, minStock: 20, merchantName: 'Kampala Corner', isActive: true },
  { id: '4', productId: 'BV-04', productLabel: 'Beer 500ml', brand: 'Nile Special', category: 'Beverages', unit: '500ml', priceTier: 'mid-range', packageSize: 'small', unitCost: 2000, unitPrice: 3000, currentStock: 96, minStock: 30, merchantName: 'Kampala Corner', isActive: true },
  { id: '5', productId: 'GR-01', productLabel: 'Sugar 1kg', brand: 'Kakira', category: 'Groceries', unit: '1kg', priceTier: 'budget', packageSize: 'medium', unitCost: 3200, unitPrice: 4000, currentStock: 89, minStock: 30, merchantName: "Mama Johnson's", isActive: true },
  { id: '6', productId: 'GR-02', productLabel: 'Rice 2kg', brand: 'Tilda', category: 'Groceries', unit: '2kg', priceTier: 'mid-range', packageSize: 'large', unitCost: 5500, unitPrice: 7000, currentStock: 67, minStock: 25, merchantName: "Mama Johnson's", isActive: true },
  { id: '7', productId: 'GR-03', productLabel: 'Posho 5kg', brand: 'Mukwano', category: 'Groceries', unit: '5kg', priceTier: 'budget', packageSize: 'bulk', unitCost: 8000, unitPrice: 10500, currentStock: 34, minStock: 15, merchantName: 'Kampala Corner', isActive: true },
  { id: '8', productId: 'GR-04', productLabel: 'Beans 1kg', brand: 'Nile', category: 'Groceries', unit: '1kg', priceTier: 'budget', packageSize: 'medium', unitCost: 2500, unitPrice: 3500, currentStock: 78, minStock: 25, merchantName: 'Kampala Corner', isActive: true },
  { id: '9', productId: 'GR-05', productLabel: 'Cooking Oil 2L', brand: 'Mukwano', category: 'Groceries', unit: '2L', priceTier: 'mid-range', packageSize: 'large', unitCost: 8500, unitPrice: 10500, currentStock: 3, minStock: 15, merchantName: "Mama Johnson's", isActive: true },
  { id: '10', productId: 'GR-06', productLabel: 'Salt 500g', brand: 'Kengrow', category: 'Groceries', unit: '500g', priceTier: 'budget', packageSize: 'small', unitCost: 400, unitPrice: 800, currentStock: 200, minStock: 50, merchantName: 'Kampala Corner', isActive: true },
  { id: '11', productId: 'DR-01', productLabel: 'Milk 1L', brand: 'Fresh Dairy', category: 'Dairy', unit: '1L', priceTier: 'budget', packageSize: 'medium', unitCost: 1800, unitPrice: 2400, currentStock: 42, minStock: 20, merchantName: "Mama Johnson's", isActive: true },
  { id: '12', productId: 'DR-02', productLabel: 'Butter 250g', brand: 'Brookside', category: 'Dairy', unit: '250g', priceTier: 'mid-range', packageSize: 'small', unitCost: 3000, unitPrice: 4000, currentStock: 28, minStock: 10, merchantName: "Mama Johnson's", isActive: true },
  { id: '13', productId: 'DR-03', productLabel: 'Yoghurt 500ml', brand: 'Brookside', category: 'Dairy', unit: '500ml', priceTier: 'mid-range', packageSize: 'small', unitCost: 2200, unitPrice: 3000, currentStock: 55, minStock: 15, merchantName: 'Kampala Corner', isActive: true },
  { id: '14', productId: 'BK-01', productLabel: 'Bread', brand: 'Hot Loaf', category: 'Bakery', unit: 'loaf', priceTier: 'budget', packageSize: 'medium', unitCost: 1500, unitPrice: 2000, currentStock: 12, minStock: 20, merchantName: 'Bugolobi Stall 12', isActive: true },
  { id: '15', productId: 'BK-02', productLabel: 'Rolls (6 pack)', brand: 'Hot Loaf', category: 'Bakery', unit: '6 pack', priceTier: 'budget', packageSize: 'medium', unitCost: 2000, unitPrice: 2800, currentStock: 30, minStock: 15, merchantName: 'Bugolobi Stall 12', isActive: true },
  { id: '16', productId: 'SN-01', productLabel: 'Biscuits 200g', brand: 'Britannia', category: 'Snacks', unit: '200g', priceTier: 'budget', packageSize: 'small', unitCost: 800, unitPrice: 1200, currentStock: 150, minStock: 40, merchantName: "Mama Johnson's", isActive: true },
  { id: '17', productId: 'SN-02', productLabel: 'Chips 150g', brand: 'Nkosi', category: 'Snacks', unit: '150g', priceTier: 'budget', packageSize: 'sachet', unitCost: 500, unitPrice: 800, currentStock: 220, minStock: 50, merchantName: 'Kampala Corner', isActive: true },
  { id: '18', productId: 'SN-03', productLabel: 'Peanuts 250g', brand: 'Local', category: 'Snacks', unit: '250g', priceTier: 'budget', packageSize: 'small', unitCost: 1200, unitPrice: 1800, currentStock: 95, minStock: 30, merchantName: 'Bugolobi Stall 12', isActive: true },
  { id: '19', productId: 'CL-01', productLabel: 'Soap Bar', brand: 'Movit', category: 'Cleaning', unit: 'bar', priceTier: 'budget', packageSize: 'sachet', unitCost: 600, unitPrice: 1000, currentStock: 300, minStock: 60, merchantName: "Mama Johnson's", isActive: true },
  { id: '20', productId: 'CL-02', productLabel: 'Detergent 1kg', brand: 'Ariel', category: 'Cleaning', unit: '1kg', priceTier: 'mid-range', packageSize: 'medium', unitCost: 4000, unitPrice: 5500, currentStock: 85, minStock: 25, merchantName: 'Kampala Corner', isActive: true },
  { id: '21', productId: 'CL-03', productLabel: 'Bleach 1L', brand: 'Jik', category: 'Cleaning', unit: '1L', priceTier: 'budget', packageSize: 'medium', unitCost: 1800, unitPrice: 2500, currentStock: 60, minStock: 20, merchantName: "Mama Johnson's", isActive: true },
  { id: '22', productId: 'PC-01', productLabel: 'Toothpaste 100g', brand: 'Colgate', category: 'Personal Care', unit: '100g', priceTier: 'budget', packageSize: 'small', unitCost: 1500, unitPrice: 2200, currentStock: 110, minStock: 30, merchantName: "Mama Johnson's", isActive: true },
  { id: '23', productId: 'PC-02', productLabel: 'Toilet Paper 4-roll', brand: 'Rose', category: 'Personal Care', unit: '4-roll', priceTier: 'budget', packageSize: 'medium', unitCost: 2000, unitPrice: 3000, currentStock: 75, minStock: 25, merchantName: 'Kampala Corner', isActive: true },
  { id: '24', productId: 'PC-03', productLabel: 'Petroleum Jelly 100g', brand: 'Vaseline', category: 'Personal Care', unit: '100g', priceTier: 'budget', packageSize: 'small', unitCost: 1200, unitPrice: 1800, currentStock: 88, minStock: 30, merchantName: "Mama Johnson's", isActive: true },
];

const DEMO_SIGNALS: LocalDemandSignal[] = [
  { id: 's1', signalId: 'SIG-0001', shopkeeperId: 'SK-RETAIL-001', neighborhood: 'Bugolobi Market', productCategory: 'Beverages', productLabel: 'Soda 500ml', productId: 'BV-01', packageSize: 'small', priceTier: 'budget', quantity: 5, urgency: 'urgent', status: 'pending', isSynced: false, syncedAt: null, privacyApplied: false, notes: null, createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 's2', signalId: 'SIG-0002', shopkeeperId: 'SK-RETAIL-001', neighborhood: 'Bugolobi Market', productCategory: 'Groceries', productLabel: 'Cooking Oil 2L', productId: 'GR-05', packageSize: 'large', priceTier: 'mid-range', quantity: 3, urgency: 'urgent', status: 'pending', isSynced: false, syncedAt: null, privacyApplied: false, notes: null, createdAt: new Date(Date.now() - 2.5 * 3600000).toISOString() },
  { id: 's3', signalId: 'SIG-0003', shopkeeperId: 'SK-RETAIL-001', neighborhood: 'Bugolobi Market', productCategory: 'Dairy', productLabel: 'Milk 1L', productId: 'DR-01', packageSize: 'medium', priceTier: 'budget', quantity: 10, urgency: 'normal', status: 'synced', isSynced: true, syncedAt: new Date(Date.now() - 3 * 3600000).toISOString(), privacyApplied: true, notes: null, createdAt: new Date(Date.now() - 4 * 3600000).toISOString() },
  { id: 's4', signalId: 'SIG-0004', shopkeeperId: 'SK-RETAIL-001', neighborhood: 'Bugolobi Market', productCategory: 'Bakery', productLabel: 'Bread', productId: 'BK-01', packageSize: 'medium', priceTier: 'budget', quantity: 20, urgency: 'normal', status: 'assigned', isSynced: true, syncedAt: new Date(Date.now() - 4 * 3600000).toISOString(), privacyApplied: true, notes: null, createdAt: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: 's5', signalId: 'SIG-0005', shopkeeperId: 'SK-RETAIL-001', neighborhood: 'Bugolobi Market', productCategory: 'Groceries', productLabel: 'Sugar 1kg', productId: 'GR-01', packageSize: 'medium', priceTier: 'budget', quantity: 8, urgency: 'low', status: 'in_transit', isSynced: true, syncedAt: new Date(Date.now() - 5 * 3600000).toISOString(), privacyApplied: true, notes: null, createdAt: new Date(Date.now() - 6 * 3600000).toISOString() },
  { id: 's6', signalId: 'SIG-0006', shopkeeperId: 'SK-RETAIL-001', neighborhood: 'Bugolobi Market', productCategory: 'Cleaning', productLabel: 'Detergent 1kg', productId: 'CL-02', packageSize: 'medium', priceTier: 'mid-range', quantity: 4, urgency: 'normal', status: 'delivered', isSynced: true, syncedAt: new Date(Date.now() - 6 * 3600000).toISOString(), privacyApplied: true, notes: null, createdAt: new Date(Date.now() - 8 * 3600000).toISOString() },
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
  };
  signals.unshift(newSignal);
  setItem(SIGNALS_KEY, signals);
  return newSignal;
}

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

// ─── Native detection ───────────────────────────────────────────────────────

export function isNativeApp(): boolean {
  if (typeof window === 'undefined') return false;
  // Capacitor sets this on native platforms
  return !!(window as unknown as { Capacitor?: unknown }).Capacitor;
}
