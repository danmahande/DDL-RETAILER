'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Radio,
  Clock,
  User,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Upload,
  Wifi,
  WifiOff,
  ChevronRight,
  X,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  RefreshCw,
  TrendingUp,
  Search,
  Server,
  Link2,
  Settings,
  Shield,
  Crosshair,
  Eye,
  EyeOff,
  Save,
  Zap,
} from 'lucide-react';
import {
  seedLocalData,
  getLocalProducts,
  getLocalSignals,
  createLocalSignal,
  syncLocalSignals,
  syncToSupplierApi,
  getLocalProfile,
  getConnectionSettings,
  updateConnectionSettings,
  isSupplierConnected,
  isNativeApp,
  getCurrentPosition,
  testSupplierConnection,
  type LocalProduct as Product,
  type LocalDemandSignal as DemandSignal,
  type LocalRetailerProfile as RetailerProfile,
  type ConnectionSettings,
} from '@/lib/local-db';

// ─── Types ──────────────────────────────────────────────────────────────────

type TabId = 'inventory' | 'signals' | 'history' | 'profile';

// ─── Category config ────────────────────────────────────────────────────────

const CATEGORIES = [
  { key: 'ALL', label: 'ALL' },
  { key: 'Beverages', label: 'BEVERAGES' },
  { key: 'Groceries', label: 'GROCERIES' },
  { key: 'Dairy', label: 'DAIRY' },
  { key: 'Bakery', label: 'BAKERY' },
  { key: 'Snacks', label: 'SNACKS' },
  { key: 'Cleaning', label: 'CLEANING' },
  { key: 'Personal Care', label: 'CARE' },
];

const CATEGORY_ICONS: Record<string, string> = {
  'Beverages': '🥤',
  'Groceries': '🛒',
  'Dairy': '🥛',
  'Bakery': '🍞',
  'Snacks': '🍪',
  'Cleaning': '🧹',
  'Personal Care': '🧴',
};

// ─── Urgency / Status colors ────────────────────────────────────────────────

const URGENCY_COLORS: Record<string, string> = {
  urgent: 'bg-red-100 text-red-700 border-red-200',
  normal: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-blue-100 text-blue-700 border-blue-200',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  synced: 'bg-sky-100 text-sky-700',
  assigned: 'bg-blue-100 text-blue-700',
  in_transit: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  synced: 'Synced',
  assigned: 'Assigned',
  in_transit: 'In Transit',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

// ─── Product placeholder image ──────────────────────────────────────────────

function ProductImage({ product, className = '' }: { product: Product; className?: string }) {
  const icon = CATEGORY_ICONS[product.category] || '📦';
  const isLow = product.currentStock <= product.minStock;
  const isCritical = product.currentStock <= product.minStock * 0.3;

  return (
    <div className={`relative bg-gray-50 flex items-center justify-center overflow-hidden ${className}`}>
      <span className="text-3xl select-none">{icon}</span>
      {isCritical && (
        <div className="absolute top-1.5 right-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
        </div>
      )}
      {isLow && !isCritical && (
        <div className="absolute top-1.5 right-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
        </div>
      )}
    </div>
  );
}

// ─── Inventory Screen ────────────────────────────────────────────────────────

function InventoryScreen({
  products,
  onSelectProduct,
}: {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === 'ALL' || p.category === activeCategory;
    const matchSearch =
      searchQuery === '' ||
      p.productLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.productId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Inventory</h1>
            <p className="text-xs text-gray-400 mt-0.5">{filtered.length} products</p>
          </div>
          <button onClick={() => setSearchQuery(searchQuery === '' ? ' ' : '')} className="relative p-2">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {searchQuery !== '' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-3"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery.trimStart()}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </motion.div>
        )}

        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`shrink-0 px-3 py-1.5 text-[11px] font-semibold tracking-wider rounded-full transition-all duration-200 ${
                activeCategory === cat.key ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-3 gap-2.5">
          {filtered.map((product) => (
            <motion.button
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden active:scale-95 transition-transform duration-100"
              whileTap={{ scale: 0.95 }}
              layout
            >
              <ProductImage product={product} className="aspect-square w-full" />
              <div className="p-2 text-left">
                <p className="font-mono text-[10px] text-gray-400 leading-none mb-0.5">{product.productId}</p>
                <p className="text-[11px] font-medium text-gray-900 leading-tight line-clamp-2">{product.productLabel}</p>
              </div>
            </motion.button>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Package className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-sm text-gray-400">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Signal Creation Modal ──────────────────────────────────────────────────

function SignalModal({
  product,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  product: Product;
  onClose: () => void;
  onSubmit: (data: { quantity: number; urgency: string; notes: string }) => void;
  isSubmitting: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const [urgency, setUrgency] = useState('normal');
  const [notes, setNotes] = useState('');
  const [gpsStatus, setGpsStatus] = useState<'capturing' | 'captured' | 'unavailable'>('capturing');
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Capture GPS on modal open
  useEffect(() => {
    let cancelled = false;
    async function getGps() {
      try {
        const pos = await getCurrentPosition();
        if (cancelled) return;
        if (pos) {
          setGpsStatus('captured');
          setGpsCoords({ lat: pos.latitude, lng: pos.longitude });
        } else {
          setGpsStatus('unavailable');
        }
      } catch {
        if (!cancelled) setGpsStatus('unavailable');
      }
    }
    getGps();
    return () => { cancelled = true; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-lg bg-white rounded-t-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">{CATEGORY_ICONS[product.category] || '📦'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs text-gray-400">{product.productId}</p>
              <h3 className="text-lg font-bold text-gray-900 truncate">{product.productLabel}</h3>
              <p className="text-xs text-gray-400">{product.category} · {product.unit} · USh {product.unitPrice.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Quantity</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center active:bg-gray-100 transition-colors">
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <div className="flex-1 text-center">
                <span className="text-3xl font-bold text-gray-900">{quantity}</span>
              </div>
              <button onClick={() => setQuantity(quantity + 1)} className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center active:bg-gray-100 transition-colors">
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Urgency Level</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'urgent', label: 'Urgent', icon: AlertTriangle, color: 'border-red-200 bg-red-50 text-red-700' },
                { key: 'normal', label: 'Normal', icon: Clock, color: 'border-amber-200 bg-amber-50 text-amber-700' },
                { key: 'low', label: 'Low', icon: TrendingUp, color: 'border-blue-200 bg-blue-50 text-blue-700' },
              ].map((opt) => {
                const Icon = opt.icon;
                const isActive = urgency === opt.key;
                return (
                  <button key={opt.key} onClick={() => setUrgency(opt.key)} className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all duration-200 ${isActive ? opt.color : 'border-gray-100 bg-white text-gray-400'}`}>
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-semibold">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Notes (optional)</label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., Need before Friday" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
          </div>

          {/* GPS Status Indicator */}
          <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border ${
            gpsStatus === 'captured' ? 'bg-green-50 border-green-200' :
            gpsStatus === 'unavailable' ? 'bg-amber-50 border-amber-200' :
            'bg-gray-50 border-gray-200'
          }`}>
            {gpsStatus === 'capturing' && (
              <>
                <RefreshCw className="w-4 h-4 text-gray-500 animate-spin" />
                <div>
                  <p className="text-xs font-semibold text-gray-700">Getting your location...</p>
                  <p className="text-[10px] text-gray-400">GPS coordinates will be attached to this signal</p>
                </div>
              </>
            )}
            {gpsStatus === 'captured' && gpsCoords && (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-green-700">Location captured</p>
                  <p className="text-[10px] text-green-500 font-mono">{gpsCoords.lat.toFixed(4)}, {gpsCoords.lng.toFixed(4)}</p>
                </div>
              </>
            )}
            {gpsStatus === 'unavailable' && (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-amber-700">Location unavailable</p>
                  <p className="text-[10px] text-amber-500">Signal will be sent without GPS coordinates</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="px-6 pb-8 pt-2 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm active:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={() => onSubmit({ quantity, urgency, notes })} disabled={isSubmitting} className="flex-1 py-3.5 rounded-xl bg-gray-900 text-white font-semibold text-sm active:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Radio className="w-4 h-4" />}
            Send Signal
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Signals Screen ──────────────────────────────────────────────────────────

function SignalsScreen({
  signals,
  products,
  onCreateSignal,
  onSync,
  isSyncing,
  supplierConnected,
}: {
  signals: DemandSignal[];
  products: Product[];
  onCreateSignal: (product: Product) => void;
  onSync: () => void;
  isSyncing: boolean;
  supplierConnected: boolean;
}) {
  const unsynced = signals.filter((s) => !s.isSynced);
  const activeSignals = signals.filter((s) => s.status !== 'delivered' && s.status !== 'cancelled');

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Demand Signals</h1>
          <button onClick={onSync} disabled={isSyncing || unsynced.length === 0} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-full disabled:opacity-40 active:bg-gray-800 transition-colors">
            {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            {supplierConnected ? 'Sync' : 'Mark Synced'} {unsynced.length > 0 && `(${unsynced.length})`}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-400">Tap products below to create demand signals</p>
          {supplierConnected && (
            <span className="flex items-center gap-1 text-[10px] text-green-600 font-semibold">
              <Server className="w-3 h-3" /> Linked
            </span>
          )}
        </div>
      </div>

      <div className="px-4 pb-3">
        <div className="bg-gray-50 rounded-2xl p-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Quick Signal</p>
          <div className="grid grid-cols-4 gap-2">
            {products.slice(0, 8).map((product) => (
              <button key={product.id} onClick={() => onCreateSignal(product)} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-gray-100 active:scale-95 transition-transform">
                <span className="text-lg">{CATEGORY_ICONS[product.category] || '📦'}</span>
                <span className="text-[9px] font-medium text-gray-600 truncate w-full text-center">{product.productLabel.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {activeSignals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Radio className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-sm text-gray-400">No active signals</p>
            <p className="text-xs text-gray-300 mt-1">Tap a product to create one</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeSignals.map((signal) => (
              <div key={signal.id} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-2xl">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-lg">{CATEGORY_ICONS[signal.productCategory] || '📦'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-gray-900 truncate">{signal.productLabel}</p>
                    {!signal.isSynced && <WifiOff className="w-3 h-3 text-amber-500 shrink-0" />}
                    {signal.isSynced && <Wifi className="w-3 h-3 text-green-500 shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-gray-400">{signal.signalId}</span>
                    <span className="text-[10px] text-gray-300">·</span>
                    <span className="text-[10px] text-gray-400">Qty: {signal.quantity}</span>
                  </div>
                  {signal.latitude != null && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-2.5 h-2.5 text-green-500" />
                      <span className="text-[9px] text-green-600 font-mono">{signal.latitude.toFixed(4)}, {signal.longitude?.toFixed(4)}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${URGENCY_COLORS[signal.urgency]}`}>{signal.urgency}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_COLORS[signal.status]}`}>{STATUS_LABELS[signal.status]}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── History Screen ──────────────────────────────────────────────────────────

function HistoryScreen({ signals }: { signals: DemandSignal[] }) {
  const [filter, setFilter] = useState('all');

  const filtered = signals.filter((s) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return s.status === 'pending' || s.status === 'synced';
    if (filter === 'active') return s.status === 'assigned' || s.status === 'in_transit';
    if (filter === 'completed') return s.status === 'delivered';
    return true;
  });

  const totalSignals = signals.length;
  const pendingCount = signals.filter((s) => s.status === 'pending' || s.status === 'synced').length;
  const activeCount = signals.filter((s) => s.status === 'assigned' || s.status === 'in_transit').length;
  const deliveredCount = signals.filter((s) => s.status === 'delivered').length;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-3">Signal History</h1>
        <div className="grid grid-cols-4 gap-2 mb-3">
          <div className="bg-gray-50 rounded-xl p-2.5 text-center"><p className="text-lg font-bold text-gray-900">{totalSignals}</p><p className="text-[9px] text-gray-400 font-semibold uppercase">Total</p></div>
          <div className="bg-amber-50 rounded-xl p-2.5 text-center"><p className="text-lg font-bold text-amber-700">{pendingCount}</p><p className="text-[9px] text-amber-500 font-semibold uppercase">Pending</p></div>
          <div className="bg-blue-50 rounded-xl p-2.5 text-center"><p className="text-lg font-bold text-blue-700">{activeCount}</p><p className="text-[9px] text-blue-500 font-semibold uppercase">Active</p></div>
          <div className="bg-green-50 rounded-xl p-2.5 text-center"><p className="text-lg font-bold text-green-700">{deliveredCount}</p><p className="text-[9px] text-green-500 font-semibold uppercase">Done</p></div>
        </div>
        <div className="flex gap-1 mb-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'pending', label: 'Pending' },
            { key: 'active', label: 'Active' },
            { key: 'completed', label: 'Done' },
          ].map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} className={`px-3 py-1.5 text-[11px] font-semibold rounded-full transition-all ${filter === f.key ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Clock className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-sm text-gray-400">No signals in this category</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((signal) => {
              const date = new Date(signal.createdAt);
              const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
              return (
                <div key={signal.id} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-2xl">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-lg">{CATEGORY_ICONS[signal.productCategory] || '📦'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{signal.productLabel}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-[10px] text-gray-400">{signal.signalId}</span>
                      <span className="text-[10px] text-gray-300">·</span>
                      <span className="text-[10px] text-gray-400">Qty {signal.quantity} · {signal.urgency}</span>
                    </div>
                    {signal.latitude != null && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 text-green-500" />
                        <span className="text-[9px] text-green-600 font-mono">{signal.latitude.toFixed(4)}, {signal.longitude?.toFixed(4)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_COLORS[signal.status]}`}>{STATUS_LABELS[signal.status]}</span>
                    <span className="text-[9px] text-gray-300">{dateStr} {timeStr}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Connection Settings Modal ──────────────────────────────────────────────

function ConnectionModal({
  connection,
  onSave,
  onClose,
}: {
  connection: ConnectionSettings;
  onSave: (settings: ConnectionSettings) => void;
  onClose: () => void;
}) {
  const [url, setUrl] = useState(connection.supplierApiUrl);
  const [apiKey, setApiKey] = useState(connection.apiKey);
  const [autoSync, setAutoSync] = useState(connection.autoSync);
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleTest = async () => {
    if (!url.trim()) return;
    setTesting(true);
    setTestResult(null);
    const result = await testSupplierConnection(url.trim(), apiKey.trim() || undefined);
    setTestResult(result);
    setTesting(false);
  };

  const handleSave = () => {
    onSave({
      supplierApiUrl: url.trim(),
      apiKey: apiKey.trim(),
      autoSync,
      syncIntervalMinutes: connection.syncIntervalMinutes,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-lg bg-white rounded-t-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#FF6B35]/10 rounded-xl flex items-center justify-center">
              <Link2 className="w-5 h-5 text-[#FF6B35]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Supplier Connection</h3>
              <p className="text-xs text-gray-400">Link to the supplier dashboard</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Supplier Dashboard URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="http://192.168.1.100:3000 or https://your-dashboard.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent font-mono text-[13px]"
            />
            <p className="text-[10px] text-gray-400 mt-1.5 px-1">Enter the URL where the supplier dashboard is running. Use your computer&apos;s local IP for same-network access.</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">API Key (optional)</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter API key if required"
                className="w-full px-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent font-mono text-[13px]"
              />
              <button onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showKey ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5 px-1">If the supplier dashboard requires authentication, enter the API key here.</p>
          </div>

          <div className="flex items-center justify-between px-1">
            <div>
              <p className="text-sm font-medium text-gray-900">Auto Sync</p>
              <p className="text-[10px] text-gray-400">Automatically send signals when online</p>
            </div>
            <button
              onClick={() => setAutoSync(!autoSync)}
              className={`w-11 h-6 rounded-full transition-colors ${autoSync ? 'bg-[#FF6B35]' : 'bg-gray-200'} relative`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${autoSync ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {url.trim() && (
            <div>
              <button
                onClick={handleTest}
                disabled={testing}
                className="w-full py-3 rounded-xl border border-[#FF6B35] text-[#FF6B35] font-semibold text-sm active:bg-[#FF6B35]/5 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                Test Connection
              </button>
              {testResult && (
                <div className={`mt-2 p-3 rounded-xl text-xs font-medium ${testResult.ok ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                  {testResult.ok ? <CheckCircle2 className="w-3.5 h-3.5 inline mr-1.5" /> : <AlertTriangle className="w-3.5 h-3.5 inline mr-1.5" />}
                  {testResult.message}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 pb-8 pt-2 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm active:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={handleSave} className="flex-1 py-3.5 rounded-xl bg-[#FF6B35] text-white font-semibold text-sm active:bg-[#E55A2B] transition-colors flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Profile Screen ──────────────────────────────────────────────────────────

function ProfileScreen({
  profile,
  unsyncedCount,
  totalSignals,
  isOnline,
  onSync,
  isSyncing,
  nativeMode,
  connection,
  onOpenConnectionSettings,
  lastSyncResult,
}: {
  profile: RetailerProfile | null;
  unsyncedCount: number;
  totalSignals: number;
  isOnline: boolean;
  onSync: () => void;
  isSyncing: boolean;
  nativeMode: boolean;
  connection: ConnectionSettings;
  onOpenConnectionSettings: () => void;
  lastSyncResult: string | null;
}) {
  const connected = isSupplierConnected();

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] rounded-2xl flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{profile?.businessName?.charAt(0) || 'S'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 truncate">{profile?.businessName || 'Shop'}</h2>
            <p className="text-xs text-gray-400 font-mono">{profile?.shopkeeperId || 'SK-RETAIL-001'}</p>
            {nativeMode && (
              <span className="inline-block px-2 py-0.5 mt-1 text-[9px] bg-[#FF6B35]/10 text-[#FF6B35] rounded-full font-semibold">NATIVE APP</span>
            )}
          </div>
        </div>

        {/* Connection Status */}
        <button onClick={onOpenConnectionSettings} className="w-full text-left mb-4">
          <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-colors ${connected ? 'bg-[#FF6B35]/5 border-[#FF6B35]/20' : 'bg-gray-50 border-gray-200'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${connected ? 'bg-[#FF6B35]/10' : 'bg-gray-100'}`}>
              <Server className={`w-5 h-5 ${connected ? 'text-[#FF6B35]' : 'text-gray-400'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${connected ? 'text-[#FF6B35]' : 'text-gray-500'}`}>
                {connected ? 'Connected to Supplier' : 'Not Connected'}
              </p>
              <p className="text-[10px] text-gray-400 truncate">
                {connected ? connection.supplierApiUrl : 'Tap to configure supplier dashboard link'}
              </p>
              {lastSyncResult && (
                <p className="text-[10px] text-gray-400 mt-0.5">{lastSyncResult}</p>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>
        </button>

        <div className={`flex items-center gap-3 p-4 rounded-2xl mb-4 ${isOnline ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
          {isOnline ? <Wifi className="w-5 h-5 text-green-600" /> : <WifiOff className="w-5 h-5 text-red-600" />}
          <div className="flex-1">
            <p className={`text-sm font-semibold ${isOnline ? 'text-green-700' : 'text-red-700'}`}>{isOnline ? 'Online' : 'Offline'}</p>
            <p className="text-xs text-gray-500">{isOnline ? (connected ? 'Signals will be sent to supplier dashboard' : 'Signals saved locally — connect to supplier') : 'Signals saved locally until connection restored'}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">Sync Status</span>
            </div>
            <button onClick={onSync} disabled={isSyncing || unsyncedCount === 0} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-full disabled:opacity-40 active:bg-gray-800 transition-colors">
              {isSyncing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
              {connected ? 'Sync Now' : 'Mark Synced'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-amber-600">{unsyncedCount}</p>
              <p className="text-[10px] text-gray-400 font-semibold uppercase">Unsynced</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-green-600">{totalSignals - unsyncedCount}</p>
              <p className="text-[10px] text-gray-400 font-semibold uppercase">Synced</p>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Shop Details</p>
          {[
            { icon: MapPin, label: 'Neighborhood', value: profile?.neighborhood || 'Bugolobi Market' },
            { icon: Phone, label: 'Contact', value: profile?.contact || '+256 770 123456' },
            { icon: Mail, label: 'Email', value: profile?.email || 'N/A' },
            { icon: ShoppingBag, label: 'Total Signals', value: String(totalSignals) },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3 px-3 py-3 bg-white border border-gray-100 rounded-xl">
                <Icon className="w-4 h-4 text-gray-400" />
                <div className="flex-1">
                  <p className="text-[10px] text-gray-400 font-medium uppercase">{item.label}</p>
                  <p className="text-sm text-gray-900">{item.value}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-6 h-6 bg-[#FF6B35] rounded-lg flex items-center justify-center">
              <Radio className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-gray-900">DDL Platform</span>
          </div>
          <p className="text-[10px] text-gray-400">Direct Demand-to-Logistics v2.0</p>
          <p className="text-[10px] text-gray-300">Bugolobi, Kampala · {nativeMode ? 'Native App' : 'Retailer App'}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('inventory');
  const [products, setProducts] = useState<Product[]>([]);
  const [signals, setSignals] = useState<DemandSignal[]>([]);
  const [profile, setProfile] = useState<RetailerProfile | null>(null);
  const [connection, setConnection] = useState<ConnectionSettings>(getConnectionSettings());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [nativeMode, setNativeMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<string | null>(null);

  // Initialize data
  useEffect(() => {
    async function initData() {
      try {
        seedLocalData();
        const native = isNativeApp();
        setNativeMode(native);

        if (native) {
          setProducts(getLocalProducts());
          setSignals(getLocalSignals());
          setProfile(getLocalProfile());
        } else {
          try {
            await fetch('/api/seed', { method: 'POST' });
            const [productsRes, signalsRes, profileRes] = await Promise.all([
              fetch('/api/products'),
              fetch('/api/signals'),
              fetch('/api/profile'),
            ]);
            const productsData = await productsRes.json();
            const signalsData = await signalsRes.json();
            const profileData = await profileRes.json();

            if (productsData.success) setProducts(productsData.data);
            else setProducts(getLocalProducts());

            if (signalsData.success) setSignals(signalsData.data);
            else setSignals(getLocalSignals());

            if (profileData.success) setProfile(profileData.data);
            else setProfile(getLocalProfile());
          } catch {
            setProducts(getLocalProducts());
            setSignals(getLocalSignals());
            setProfile(getLocalProfile());
          }
        }
      } catch (err) {
        console.error('Init error:', err);
        setProducts(getLocalProducts());
        setSignals(getLocalSignals());
        setProfile(getLocalProfile());
      } finally {
        setIsLoading(false);
      }
    }
    initData();
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-sync when coming online and connected
  useEffect(() => {
    if (!isOnline || !connection.supplierApiUrl || !connection.autoSync) return;
    const unsynced = getLocalSignals().filter(s => !s.isSynced);
    if (unsynced.length === 0) return;
    // Auto-sync after a short delay
    const timer = setTimeout(() => {
      handleSync();
    }, 3000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline, connection.supplierApiUrl, connection.autoSync]);

  // Create demand signal with geolocation
  const handleCreateSignal = useCallback(
    async (data: { quantity: number; urgency: string; notes: string }) => {
      if (!selectedProduct) return;
      setIsSubmitting(true);
      try {
        // Capture GPS position
        const position = await getCurrentPosition();

        // Always save to localStorage first (instant, works offline)
        const newSignal = createLocalSignal({
          productLabel: selectedProduct.productLabel,
          productId: selectedProduct.productId,
          productCategory: selectedProduct.category,
          packageSize: selectedProduct.packageSize,
          priceTier: selectedProduct.priceTier,
          quantity: data.quantity,
          urgency: data.urgency,
          neighborhood: profile?.neighborhood || 'Bugolobi Market',
          notes: data.notes,
          latitude: position?.latitude ?? null,
          longitude: position?.longitude ?? null,
          locationAccuracy: position?.accuracy ?? null,
        });
        setSignals((prev) => [newSignal, ...prev]);

        // Also try API if in web mode
        if (!nativeMode) {
          try {
            await fetch('/api/signals', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                productLabel: selectedProduct.productLabel,
                productId: selectedProduct.productId,
                productCategory: selectedProduct.category,
                packageSize: selectedProduct.packageSize,
                priceTier: selectedProduct.priceTier,
                quantity: data.quantity,
                urgency: data.urgency,
                neighborhood: profile?.neighborhood || 'Bugolobi Market',
                notes: data.notes,
                latitude: position?.latitude ?? null,
                longitude: position?.longitude ?? null,
                locationAccuracy: position?.accuracy ?? null,
              }),
            });
          } catch {
            // API unavailable, localStorage already has it
          }
        }

        setSelectedProduct(null);
      } catch (err) {
        console.error('Signal create error:', err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedProduct, profile, nativeMode]
  );

  // Sync signals to supplier dashboard
  const handleSync = useCallback(async () => {
    setIsSyncing(true);
    setLastSyncResult(null);
    try {
      const currentProfile = profile || getLocalProfile();

      if (isSupplierConnected()) {
        // Real sync to supplier API
        const result = await syncToSupplierApi(connection, currentProfile);
        if (result.synced > 0) {
          setLastSyncResult(`Synced ${result.synced} signal${result.synced !== 1 ? 's' : ''} to supplier`);
        }
        if (result.failed > 0) {
          setLastSyncResult(`Synced ${result.synced}, failed ${result.failed}`);
        }
        if (result.synced === 0 && result.failed === 0) {
          setLastSyncResult('All signals already synced');
        }
      } else {
        // Local-only sync
        const result = syncLocalSignals();
        setLastSyncResult(`Marked ${result.synced} signal${result.synced !== 1 ? 's' : ''} as synced (local only)`);
      }

      setSignals(getLocalSignals());

      // Also try API sync in web mode
      if (!nativeMode) {
        try {
          await fetch('/api/sync', { method: 'POST' });
          const signalsRes = await fetch('/api/signals');
          const signalsData = await signalsRes.json();
          if (signalsData.success) setSignals(signalsData.data);
        } catch {
          // API unavailable, local sync already done
        }
      }
    } catch (err) {
      console.error('Sync error:', err);
      setLastSyncResult('Sync failed — try again');
    } finally {
      setIsSyncing(false);
    }
  }, [connection, profile, nativeMode]);

  const handleSaveConnection = useCallback((settings: ConnectionSettings) => {
    updateConnectionSettings(settings);
    setConnection(settings);
    setShowConnectionModal(false);
  }, []);

  const unsyncedCount = signals.filter((s) => !s.isSynced).length;
  const supplierConnected = isSupplierConnected();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-[#FF6B35] rounded-2xl flex items-center justify-center animate-pulse">
            <Radio className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm text-gray-400 font-medium">Loading DDL Retailer...</p>
        </div>
      </div>
    );
  }

  const tabs: { key: TabId; icon: typeof Package; label: string; badge?: number }[] = [
    { key: 'inventory', icon: Package, label: 'Inventory' },
    { key: 'signals', icon: Radio, label: 'Signals', badge: unsyncedCount || undefined },
    { key: 'history', icon: Clock, label: 'History' },
    { key: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white max-w-lg mx-auto">
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            {activeTab === 'inventory' && <InventoryScreen products={products} onSelectProduct={setSelectedProduct} />}
            {activeTab === 'signals' && <SignalsScreen signals={signals} products={products} onCreateSignal={setSelectedProduct} onSync={handleSync} isSyncing={isSyncing} supplierConnected={supplierConnected} />}
            {activeTab === 'history' && <HistoryScreen signals={signals} />}
            {activeTab === 'profile' && <ProfileScreen profile={profile} unsyncedCount={unsyncedCount} totalSignals={signals.length} isOnline={isOnline} onSync={handleSync} isSyncing={isSyncing} nativeMode={nativeMode} connection={connection} onOpenConnectionSettings={() => setShowConnectionModal(true)} lastSyncResult={lastSyncResult} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {!isOnline && (
        <div className="bg-amber-500 text-white text-center py-1.5 text-xs font-semibold flex items-center justify-center gap-1.5">
          <WifiOff className="w-3.5 h-3.5" />
          Offline — signals saved locally
        </div>
      )}

      {!supplierConnected && isOnline && (
        <div className="bg-gray-900 text-white text-center py-1.5 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer" onClick={() => setShowConnectionModal(true)}>
          <Link2 className="w-3.5 h-3.5" />
          Not connected to supplier — tap to configure
        </div>
      )}

      <nav className="bg-white border-t border-gray-100 pb-safe">
        <div className="flex items-center justify-around px-2 pt-1 pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`relative flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-200 ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-all duration-200 ${isActive ? 'text-gray-900' : 'text-gray-400'}`} strokeWidth={isActive ? 2.5 : 1.5} />
                  {tab.badge && tab.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#FF6B35] text-white text-[8px] font-bold rounded-full flex items-center justify-center">{tab.badge}</span>
                  )}
                </div>
                <span className={`text-[10px] font-semibold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{tab.label}</span>
                {isActive && <motion.div layoutId="activeTab" className="absolute -bottom-1 w-5 h-0.5 bg-gray-900 rounded-full" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
              </button>
            );
          })}
        </div>
      </nav>

      <AnimatePresence>
        {selectedProduct && <SignalModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onSubmit={handleCreateSignal} isSubmitting={isSubmitting} />}
      </AnimatePresence>

      <AnimatePresence>
        {showConnectionModal && <ConnectionModal connection={connection} onSave={handleSaveConnection} onClose={() => setShowConnectionModal(false)} />}
      </AnimatePresence>
    </div>
  );
}
