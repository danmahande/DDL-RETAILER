import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const PRODUCTS = [
  // Beverages
  { productId: 'BV-01', productLabel: 'Soda 500ml', brand: 'Coca-Cola', category: 'Beverages', unit: '500ml', priceTier: 'budget', packageSize: 'small', unitCost: 800, unitPrice: 1200, currentStock: 245, minStock: 50, merchantId: 'MCH-001', merchantName: "Mama Johnson's" },
  { productId: 'BV-02', productLabel: 'Mineral Water 1L', brand: 'Rwenzori', category: 'Beverages', unit: '1L', priceTier: 'budget', packageSize: 'medium', unitCost: 600, unitPrice: 1000, currentStock: 180, minStock: 40, merchantId: 'MCH-001', merchantName: "Mama Johnson's" },
  { productId: 'BV-03', productLabel: 'Orange Juice 1L', brand: 'Minute Maid', category: 'Beverages', unit: '1L', priceTier: 'mid-range', packageSize: 'medium', unitCost: 2500, unitPrice: 3500, currentStock: 45, minStock: 20, merchantId: 'MCH-002', merchantName: 'Kampala Corner' },
  { productId: 'BV-04', productLabel: 'Beer 500ml', brand: 'Nile Special', category: 'Beverages', unit: '500ml', priceTier: 'mid-range', packageSize: 'small', unitCost: 2000, unitPrice: 3000, currentStock: 96, minStock: 30, merchantId: 'MCH-002', merchantName: 'Kampala Corner' },
  // Groceries
  { productId: 'GR-01', productLabel: 'Sugar 1kg', brand: 'Kakira', category: 'Groceries', unit: '1kg', priceTier: 'budget', packageSize: 'medium', unitCost: 3200, unitPrice: 4000, currentStock: 89, minStock: 30, merchantId: 'MCH-001', merchantName: "Mama Johnson's" },
  { productId: 'GR-02', productLabel: 'Rice 2kg', brand: 'Tilda', category: 'Groceries', unit: '2kg', priceTier: 'mid-range', packageSize: 'large', unitCost: 5500, unitPrice: 7000, currentStock: 67, minStock: 25, merchantId: 'MCH-001', merchantName: "Mama Johnson's" },
  { productId: 'GR-03', productLabel: 'Posho 5kg', brand: 'Mukwano', category: 'Groceries', unit: '5kg', priceTier: 'budget', packageSize: 'bulk', unitCost: 8000, unitPrice: 10500, currentStock: 34, minStock: 15, merchantId: 'MCH-002', merchantName: 'Kampala Corner' },
  { productId: 'GR-04', productLabel: 'Beans 1kg', brand: 'Nile', category: 'Groceries', unit: '1kg', priceTier: 'budget', packageSize: 'medium', unitCost: 2500, unitPrice: 3500, currentStock: 78, minStock: 25, merchantId: 'MCH-002', merchantName: 'Kampala Corner' },
  { productId: 'GR-05', productLabel: 'Cooking Oil 2L', brand: 'Mukwano', category: 'Groceries', unit: '2L', priceTier: 'mid-range', packageSize: 'large', unitCost: 8500, unitPrice: 10500, currentStock: 3, minStock: 15, merchantId: 'MCH-001', merchantName: "Mama Johnson's" },
  { productId: 'GR-06', productLabel: 'Salt 500g', brand: 'Kengrow', category: 'Groceries', unit: '500g', priceTier: 'budget', packageSize: 'small', unitCost: 400, unitPrice: 800, currentStock: 200, minStock: 50, merchantId: 'MCH-002', merchantName: 'Kampala Corner' },
  // Dairy
  { productId: 'DR-01', productLabel: 'Milk 1L', brand: 'Fresh Dairy', category: 'Dairy', unit: '1L', priceTier: 'budget', packageSize: 'medium', unitCost: 1800, unitPrice: 2400, currentStock: 42, minStock: 20, merchantId: 'MCH-001', merchantName: "Mama Johnson's" },
  { productId: 'DR-02', productLabel: 'Butter 250g', brand: 'Brookside', category: 'Dairy', unit: '250g', priceTier: 'mid-range', packageSize: 'small', unitCost: 3000, unitPrice: 4000, currentStock: 28, minStock: 10, merchantId: 'MCH-001', merchantName: "Mama Johnson's" },
  { productId: 'DR-03', productLabel: 'Yoghurt 500ml', brand: 'Brookside', category: 'Dairy', unit: '500ml', priceTier: 'mid-range', packageSize: 'small', unitCost: 2200, unitPrice: 3000, currentStock: 55, minStock: 15, merchantId: 'MCH-002', merchantName: 'Kampala Corner' },
  // Bakery
  { productId: 'BK-01', productLabel: 'Bread', brand: 'Hot Loaf', category: 'Bakery', unit: 'loaf', priceTier: 'budget', packageSize: 'medium', unitCost: 1500, unitPrice: 2000, currentStock: 12, minStock: 20, merchantId: 'MCH-003', merchantName: 'Bugolobi Stall 12' },
  { productId: 'BK-02', productLabel: 'Rolls (6 pack)', brand: 'Hot Loaf', category: 'Bakery', unit: '6 pack', priceTier: 'budget', packageSize: 'medium', unitCost: 2000, unitPrice: 2800, currentStock: 30, minStock: 15, merchantId: 'MCH-003', merchantName: 'Bugolobi Stall 12' },
  // Snacks
  { productId: 'SN-01', productLabel: 'Biscuits 200g', brand: 'Britannia', category: 'Snacks', unit: '200g', priceTier: 'budget', packageSize: 'small', unitCost: 800, unitPrice: 1200, currentStock: 150, minStock: 40, merchantId: 'MCH-001', merchantName: "Mama Johnson's" },
  { productId: 'SN-02', productLabel: 'Chips 150g', brand: 'Nkosi', category: 'Snacks', unit: '150g', priceTier: 'budget', packageSize: 'sachet', unitCost: 500, unitPrice: 800, currentStock: 220, minStock: 50, merchantId: 'MCH-002', merchantName: 'Kampala Corner' },
  { productId: 'SN-03', productLabel: 'Peanuts 250g', brand: 'Local', category: 'Snacks', unit: '250g', priceTier: 'budget', packageSize: 'small', unitCost: 1200, unitPrice: 1800, currentStock: 95, minStock: 30, merchantId: 'MCH-003', merchantName: 'Bugolobi Stall 12' },
  // Cleaning
  { productId: 'CL-01', productLabel: 'Soap Bar', brand: 'Movit', category: 'Cleaning', unit: 'bar', priceTier: 'budget', packageSize: 'sachet', unitCost: 600, unitPrice: 1000, currentStock: 300, minStock: 60, merchantId: 'MCH-001', merchantName: "Mama Johnson's" },
  { productId: 'CL-02', productLabel: 'Detergent 1kg', brand: 'Ariel', category: 'Cleaning', unit: '1kg', priceTier: 'mid-range', packageSize: 'medium', unitCost: 4000, unitPrice: 5500, currentStock: 85, minStock: 25, merchantId: 'MCH-002', merchantName: 'Kampala Corner' },
  { productId: 'CL-03', productLabel: 'Bleach 1L', brand: 'Jik', category: 'Cleaning', unit: '1L', priceTier: 'budget', packageSize: 'medium', unitCost: 1800, unitPrice: 2500, currentStock: 60, minStock: 20, merchantId: 'MCH-001', merchantName: "Mama Johnson's" },
  // Personal Care
  { productId: 'PC-01', productLabel: 'Toothpaste 100g', brand: 'Colgate', category: 'Personal Care', unit: '100g', priceTier: 'budget', packageSize: 'small', unitCost: 1500, unitPrice: 2200, currentStock: 110, minStock: 30, merchantId: 'MCH-001', merchantName: "Mama Johnson's" },
  { productId: 'PC-02', productLabel: 'Toilet Paper 4-roll', brand: 'Rose', category: 'Personal Care', unit: '4-roll', priceTier: 'budget', packageSize: 'medium', unitCost: 2000, unitPrice: 3000, currentStock: 75, minStock: 25, merchantId: 'MCH-002', merchantName: 'Kampala Corner' },
  { productId: 'PC-03', productLabel: 'Petroleum Jelly 100g', brand: 'Vaseline', category: 'Personal Care', unit: '100g', priceTier: 'budget', packageSize: 'small', unitCost: 1200, unitPrice: 1800, currentStock: 88, minStock: 30, merchantId: 'MCH-001', merchantName: "Mama Johnson's" },
];

const DEMO_SIGNALS = [
  { signalId: 'SIG-0001', productCategory: 'Beverages', productLabel: 'Soda 500ml', productId: 'BV-01', packageSize: 'small', priceTier: 'budget', quantity: 5, urgency: 'urgent', status: 'pending', neighborhood: 'Bugolobi Market' },
  { signalId: 'SIG-0002', productCategory: 'Groceries', productLabel: 'Cooking Oil 2L', productId: 'GR-05', packageSize: 'large', priceTier: 'mid-range', quantity: 3, urgency: 'urgent', status: 'pending', neighborhood: 'Bugolobi Market' },
  { signalId: 'SIG-0003', productCategory: 'Dairy', productLabel: 'Milk 1L', productId: 'DR-01', packageSize: 'medium', priceTier: 'budget', quantity: 10, urgency: 'normal', status: 'synced', neighborhood: 'Bugolobi Market', isSynced: true },
  { signalId: 'SIG-0004', productCategory: 'Bakery', productLabel: 'Bread', productId: 'BK-01', packageSize: 'medium', priceTier: 'budget', quantity: 20, urgency: 'normal', status: 'assigned', neighborhood: 'Bugolobi Market', isSynced: true },
  { signalId: 'SIG-0005', productCategory: 'Groceries', productLabel: 'Sugar 1kg', productId: 'GR-01', packageSize: 'medium', priceTier: 'budget', quantity: 8, urgency: 'low', status: 'in_transit', neighborhood: 'Bugolobi Market', isSynced: true },
  { signalId: 'SIG-0006', productCategory: 'Cleaning', productLabel: 'Detergent 1kg', productId: 'CL-02', packageSize: 'medium', priceTier: 'mid-range', quantity: 4, urgency: 'normal', status: 'delivered', neighborhood: 'Bugolobi Market', isSynced: true },
];

export async function POST() {
  try {
    // Seed products
    for (const product of PRODUCTS) {
      await db.product.upsert({
        where: { productId: product.productId },
        update: product,
        create: product,
      });
    }

    // Seed demo signals
    for (const signal of DEMO_SIGNALS) {
      await db.demandSignal.upsert({
        where: { signalId: signal.signalId },
        update: signal,
        create: signal,
      });
    }

    // Seed retailer profile
    await db.retailerProfile.upsert({
      where: { shopkeeperId: 'SK-RETAIL-001' },
      update: {},
      create: {
        shopkeeperId: 'SK-RETAIL-001',
        businessName: "Daniel's General Shop",
        contact: '+256 770 123456',
        email: 'daniel@bugolobi.shop',
        neighborhood: 'Bugolobi Market',
      },
    });

    return NextResponse.json({ success: true, message: 'Demo data seeded successfully', products: PRODUCTS.length, signals: DEMO_SIGNALS.length });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
