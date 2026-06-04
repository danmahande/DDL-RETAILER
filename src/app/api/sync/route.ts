import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  try {
    // Mark all unsynced signals as synced
    const result = await db.demandSignal.updateMany({
      where: { isSynced: false },
      data: {
        isSynced: true,
        syncedAt: new Date(),
        privacyApplied: true,
        status: 'synced',
      },
    });

    return NextResponse.json({
      success: true,
      synced: result.count,
      message: `${result.count} signal(s) synced successfully`,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
