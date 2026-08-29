import { NextResponse } from 'next/server';
import { getVolunteerSignups } from '@/lib/db';
import { getAuthFromCookies } from '@/lib/auth';

export async function GET() {
  const user = await getAuthFromCookies();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const signups = await getVolunteerSignups();
  return NextResponse.json(signups);
}
