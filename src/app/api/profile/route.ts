import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const profile = await db.retailerProfile.findUnique({
      where: { shopkeeperId: 'SK-RETAIL-001' },
    });
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const profile = await db.retailerProfile.update({
      where: { shopkeeperId: 'SK-RETAIL-001' },
      data: body,
    });
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
