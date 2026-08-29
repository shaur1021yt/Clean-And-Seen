'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconContent, IconImpact, IconEvents, IconPartners, IconSettings, IconDonation, IconGallery } from '@/components/Icons';

interface DashboardStats {
  stats: { id: number; label: string; value: number }[];
  events: number;
  partners: number;
  volunteers: number;
  contacts: number;
  donations: number;
  donationCount: number;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me').then(res => {
      if (!res.ok) {
        window.location.href = '/admin/login';
      }
    });

    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {data?.stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500">{stat.label}</div>
            <div className="text-2xl font-bold text-primary-600">{stat.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500">Events</div>
          <div className="text-2xl font-bold text-accent-600">{data?.events || 0}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500">Partners</div>
          <div className="text-2xl font-bold text-warm-500">{data?.partners || 0}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500">Volunteer Signups</div>
          <div className="text-2xl font-bold text-primary-600">{data?.volunteers || 0}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500">Contact Submissions</div>
          <div className="text-2xl font-bold text-warm-500">{data?.contacts || 0}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500">Total Donations</div>
          <div className="text-2xl font-bold text-green-600">${(data?.donations || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500">Donation Count</div>
          <div className="text-2xl font-bold text-green-600">{data?.donationCount || 0}</div>
        </div>
      </div>

      {/* Quick Links */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { href: '/admin/content', label: 'Edit Site Content', Icon: IconContent, desc: 'Update text across all pages' },
          { href: '/admin/impact', label: 'Update Impact Stats', Icon: IconImpact, desc: 'Edit numbers and labels' },
          { href: '/admin/events', label: 'Manage Events', Icon: IconEvents, desc: 'Add or edit events' },
          { href: '/admin/partners', label: 'Manage Partners', Icon: IconPartners, desc: 'Add or edit partner organizations' },
          { href: '/admin/pages', label: 'Page Settings', Icon: IconSettings, desc: 'Configure page content' },
          { href: '/admin/donations', label: 'Track Donations', Icon: IconDonation, desc: 'Record Venmo & other donations' },
          { href: '/admin/gallery', label: 'Image Gallery', Icon: IconGallery, desc: 'Upload & manage site images' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all block"
          >
            <div className="flex items-center space-x-3">
              <item.Icon size={24} className="text-primary-600" />
              <div>
                <div className="font-semibold text-gray-900">{item.label}</div>
                <div className="text-sm text-gray-500">{item.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
