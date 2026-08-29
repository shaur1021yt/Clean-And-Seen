import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { getUserPermissions, type PermissionKey } from './db';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'pcas-secret-key-change-in-production-2025'
);

const COOKIE_NAME = 'pcas_admin_token';

export interface JWTPayload {
  id: number;
  username: string;
  role: 'owner' | 'admin';
  iat: number;
  exp: number;
}

export interface AuthUser extends JWTPayload {
  permissions: PermissionKey[];
}

export async function signToken(id: number, username: string, role: 'owner' | 'admin'): Promise<string> {
  return new SignJWT({ id, username, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAuthFromCookies(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME);
  if (!token) return null;
  return verifyToken(token.value);
}

export async function getAuthWithPermissions(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME);
  if (!token) return null;
  const payload = await verifyToken(token.value);
  if (!payload) return null;
  // Owners always get all permissions
  const permissions = payload.role === 'owner'
    ? (ALL_PERMISSION_KEYS)
    : await getUserPermissions(payload.id);
  return { ...payload, permissions };
}

// All permission keys for owner override
const ALL_PERMISSION_KEYS: PermissionKey[] = [
  'content_edit', 'impact_edit', 'events_edit', 'partners_edit',
  'donations_view', 'gallery_edit', 'live_preview', 'user_management',
  'volunteer_hours',
];

export function isOwner(payload: JWTPayload | null): boolean {
  return payload?.role === 'owner';
}

export function hasPermission(user: AuthUser | null, permission: PermissionKey): boolean {
  if (!user) return false;
  if (user.role === 'owner') return true;
  return user.permissions.includes(permission);
}
