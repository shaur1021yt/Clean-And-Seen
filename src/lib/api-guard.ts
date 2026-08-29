import { NextResponse } from 'next/server';
import { getAuthWithPermissions, type AuthUser } from './auth';
import type { PermissionKey } from './db';

export async function requireAuth(): Promise<{ user: AuthUser; error?: NextResponse }> {
  const user = await getAuthWithPermissions();
  if (!user) {
    return { user: null as unknown as AuthUser, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { user, error: undefined };
}

export async function requirePermission(permission: PermissionKey): Promise<{ user: AuthUser; error?: NextResponse }> {
  const { user, error } = await requireAuth();
  if (error) return { user, error };

  if (user.role !== 'owner' && !user.permissions.includes(permission)) {
    return { user, error: NextResponse.json({ error: `${permission} permission required` }, { status: 403 }) };
  }
  return { user, error: undefined };
}

export async function requireOwner(): Promise<{ user: AuthUser; error?: NextResponse }> {
  const { user, error } = await requireAuth();
  if (error) return { user, error };

  if (user.role !== 'owner') {
    return { user, error: NextResponse.json({ error: 'Owner access required' }, { status: 403 }) };
  }
  return { user, error: undefined };
}
