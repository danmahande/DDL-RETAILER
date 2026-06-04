import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const signals = await db.demandSignal.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: signals });
  } catch (error) {
    console.error('Signals fetch error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productLabel, productId, productCategory, packageSize, priceTier, quantity, urgency, neighborhood, notes } = body;

    if (!productLabel || !productId || !productCategory || !urgency) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const signalId = `SIG-${String(Date.now()).slice(-6)}`;

    const signal = await db.demandSignal.create({
      data: {
        signalId,
        shopkeeperId: 'SK-RETAIL-001',
        neighborhood: neighborhood || 'Bugolobi Market',
        productCategory,
        productLabel,
        productId,
        packageSize: packageSize || 'medium',
        priceTier: priceTier || 'budget',
        quantity: quantity || 1,
        urgency,
        status: 'pending',
        isSynced: false,
        privacyApplied: false,
        notes,
      },
    });

    return NextResponse.json({ success: true, data: signal });
  } catch (error) {
    console.error('Signal create error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
