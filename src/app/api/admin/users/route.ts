import { NextResponse } from 'next/server';
import { getAuthFromCookies, isOwner } from '@/lib/auth';
import { getAllAdminUsers, createAdminUser, deleteAdminUser, updateAdminUserRole } from '@/lib/db';

// GET: List all admin users (owner only)
export async function GET() {
  const user = await getAuthFromCookies();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isOwner(user)) {
    return NextResponse.json({ error: 'Owner access required' }, { status: 403 });
  }

  const users = await getAllAdminUsers();
  return NextResponse.json({ users });
}

// POST: Create a new admin user (owner only)
export async function POST(request: Request) {
  const user = await getAuthFromCookies();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isOwner(user)) {
    return NextResponse.json({ error: 'Owner access required' }, { status: 403 });
  }

  try {
    const { username, password, role } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    if (username.length < 3) {
      return NextResponse.json({ error: 'Username must be at least 3 characters' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const userRole = role === 'owner' ? 'owner' : 'admin';
    await createAdminUser(username, password, userRole);

    return NextResponse.json({ success: true, message: `User ${username} created as ${userRole}` });
  } catch (error: any) {
    if (error?.message?.includes('UNIQUE') || error?.code === '23505') {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
    }
    console.error('Create user error:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

// DELETE: Remove an admin user (owner only)
export async function DELETE(request: Request) {
  const user = await getAuthFromCookies();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isOwner(user)) {
    return NextResponse.json({ error: 'Owner access required' }, { status: 403 });
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    await deleteAdminUser(id);
    return NextResponse.json({ success: true, message: 'User deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete user' }, { status: 400 });
  }
}

// PATCH: Update a user's role (owner only)
export async function PATCH(request: Request) {
  const user = await getAuthFromCookies();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isOwner(user)) {
    return NextResponse.json({ error: 'Owner access required' }, { status: 403 });
  }

  try {
    const { id, role } = await request.json();

    if (!id || !role) {
      return NextResponse.json({ error: 'User ID and role required' }, { status: 400 });
    }

    if (role !== 'owner' && role !== 'admin') {
      return NextResponse.json({ error: 'Role must be owner or admin' }, { status: 400 });
    }

    await updateAdminUserRole(id, role);
    return NextResponse.json({ success: true, message: `User role updated to ${role}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 500 });
  }
}
