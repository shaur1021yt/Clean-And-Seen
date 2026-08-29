import { NextResponse } from 'next/server';
import { getAuthWithPermissions } from '@/lib/auth';

export async function GET() {
  const user = await getAuthWithPermissions();
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    id: user.id,
    username: user.username,
    role: user.role,
    permissions: user.permissions,
  });
}
