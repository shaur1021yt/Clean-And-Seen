import { NextResponse } from 'next/server';
import { getImpactStats } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const stats = await getImpactStats();
  return NextResponse.json(stats);
}
