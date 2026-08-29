'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { IconDashboard, IconContent, IconImpact, IconEvents, IconPartners, IconSettings, IconUsers, IconGlobe, IconLogout, IconCrown, IconWrench, IconDonation, IconGallery, IconPreview, IconVolunteer } from '@/components/Icons';

interface UserInfo {
  authenticated: boolean;
  id: number;
  username: string;
  role: 'owner' | 'admin';
  permissions: string[];
}

const baseLinks = [
  { href: '/admin', label: 'Dashboard', Icon: IconDashboard, perm: null },
  { href: '/admin/preview', label: 'Live Preview', Icon: IconPreview, perm: 'live_preview' },
  { href: '/admin/content', label: 'Site Content', Icon: IconContent, perm: 'content_edit' },
  { href: '/admin/impact', label: 'Impact Stats', Icon: IconImpact, perm: 'impact_edit' },
  { href: '/admin/events', label: 'Events', Icon: IconEvents, perm: 'events_edit' },
  { href: '/admin/partners', label: 'Partners', Icon: IconPartners, perm: 'partners_edit' },
  { href: '/admin/pages', label: 'Page Settings', Icon: IconSettings, perm: null },
  { href: '/admin/donations', label: 'Donations', Icon: IconDonation, perm: 'donations_view' },
  { href: '/admin/gallery', label: 'Gallery', Icon: IconGallery, perm: 'gallery_edit' },
  { href: '/admin/volunteer-hours', label: 'Volunteer Hours', Icon: IconVolunteer, perm: 'volunteer_hours' },
  { href: '/admin/users', label: 'User Management', Icon: IconUsers, perm: 'user_management' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    if (pathname === '/admin/login') return;
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) {
          window.location.href = '/admin/login';
          return;
        }
        return res.json();
      })
      .then(data => {
        if (data) setUser(data);
      });
  }, [pathname]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const isOwnerUser = user?.role === 'owner';
  const sidebarLinks = baseLinks.filter(link => {
    if (!link.perm) return true; // No permission required (Dashboard, Pages)
    if (isOwnerUser) return true; // Owners see everything
    return user?.permissions?.includes(link.perm) ?? false;
  });

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="admin-sidebar flex-shrink-0">
        <div className="mb-6">
          <Link href="/admin" className="flex items-center space-x-2">
            <Image src="/logo-nav.png" alt="PCAS" width={32} height={32} />
            <span className="font-bold text-lg">PCAS Admin</span>
          </Link>
        </div>

        {/* Role Badge */}
        {user && (
          <div className="mb-6 px-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-gray-400">Signed in as</span>
              <span className="text-sm font-semibold text-white">{user.username}</span>
            </div>
            <div className="mt-1">
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                  isOwnerUser
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}
              >
                {isOwnerUser ? (<><IconCrown size={14} /> Owner</>) : (<><IconWrench size={14} /> Admin</>)}
              </span>
            </div>
          </div>
        )}

        <nav className="space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all ${
                pathname === link.href
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <link.Icon size={18} />
              <span>{link.label}</span>

            </Link>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <Link
            href="/"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
          >
            <IconGlobe size={18} />
            <span>View Site</span>
          </Link>
          <button
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              window.location.href = '/admin/login';
            }}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-all w-full"
          >
            <IconLogout size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
