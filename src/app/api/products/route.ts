import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const products = await db.product.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { productLabel: 'asc' }],
    });
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
