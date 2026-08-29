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

    const user = await getAdminUser(username) as { id: number; username: string; password_hash: string; role: string } | undefined;
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const role = (user.role === 'owner' ? 'owner' : 'admin') as 'owner' | 'admin';
    const token = await signToken(user.id, user.username, role);
    await setAuthCookie(token);

    return NextResponse.json({ success: true, username: user.username, role });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
