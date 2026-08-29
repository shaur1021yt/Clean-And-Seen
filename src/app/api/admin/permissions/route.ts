import { NextResponse } from 'next/server';
import { getAuthWithPermissions } from '@/lib/auth';
import { getUserPermissions, setUserPermissions, getAllAdminUsers, ALL_PERMISSIONS, type PermissionKey } from '@/lib/db';

// GET: Get permissions for a user (owner only)
export async function GET(request: Request) {
  const user = await getAuthWithPermissions();
  if (!user || user.role !== 'owner') {
    return NextResponse.json({ error: 'Owner access required' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (userId) {
    const permissions = await getUserPermissions(parseInt(userId));
    return NextResponse.json({ permissions, allPermissions: ALL_PERMISSIONS });
  }

  // Return all users with their permissions
  const users = await getAllAdminUsers() as { id: number; username: string; role: string }[];
  const usersWithPerms = await Promise.all(
    users.map(async u => ({
      ...u,
      permissions: u.role === 'owner'
        ? ALL_PERMISSIONS.map(p => p.key)
        : await getUserPermissions(u.id),
    }))
  );

  return NextResponse.json({ users: usersWithPerms, allPermissions: ALL_PERMISSIONS });
}

// PUT: Set permissions for a user (owner only)
export async function PUT(request: Request) {
  const user = await getAuthWithPermissions();
  if (!user || user.role !== 'owner') {
    return NextResponse.json({ error: 'Owner access required' }, { status: 403 });
  }

  try {
    const { userId, permissions } = await request.json();

    if (!userId || !Array.isArray(permissions)) {
      return NextResponse.json({ error: 'userId and permissions array required' }, { status: 400 });
    }

    // Validate all permission keys
    const validKeys: string[] = ALL_PERMISSIONS.map(p => p.key);
    const invalidPerms = permissions.filter((p: string) => !validKeys.includes(p));
    if (invalidPerms.length > 0) {
      return NextResponse.json({ error: `Invalid permissions: ${invalidPerms.join(', ')}` }, { status: 400 });
    }

    await setUserPermissions(userId, permissions as PermissionKey[]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Set permissions error:', error);
    return NextResponse.json({ error: 'Failed to set permissions' }, { status: 500 });
  }
}
