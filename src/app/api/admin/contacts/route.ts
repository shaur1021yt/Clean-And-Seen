import { NextResponse } from 'next/server';
import { getContactSubmissions } from '@/lib/db';
import { getAuthFromCookies } from '@/lib/auth';

export async function GET() {
  const user = await getAuthFromCookies();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const contacts = await getContactSubmissions();
  return NextResponse.json(contacts);
}
