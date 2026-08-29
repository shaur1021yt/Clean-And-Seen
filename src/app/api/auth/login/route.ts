import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getAdminUser } from '@/lib/db';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    console.log('[LOGIN] Attempting login for:', username);
    console.log('[LOGIN] SUPABASE_URL set:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('[LOGIN] SERVICE_ROLE_KEY set:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    const user = await getAdminUser(username) as { id: number; username: string; password_hash: string; role: string } | undefined;

    console.log('[LOGIN] User found:', !!user, user?.username, user?.role);

    if (!user) {
      console.log('[LOGIN] No user found for:', username);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = bcrypt.compareSync(password, user.password_hash);
    console.log('[LOGIN] Password valid:', valid);

    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const role = (user.role === 'owner' ? 'owner' : 'admin') as 'owner' | 'admin';
    const token = await signToken(user.id, user.username, role);
    await setAuthCookie(token);

    console.log('[LOGIN] Success for:', username, 'role:', role);
    return NextResponse.json({ success: true, username: user.username, role });
  } catch (error) {
    console.error('[LOGIN] Error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
