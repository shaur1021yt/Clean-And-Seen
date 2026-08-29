'use client';

import SitePreview from '@/components/SitePreview';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconLock } from '@/components/Icons';

export default function AdminPreviewPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/auth/me').then(res => {
      if (!res.ok) { window.location.href = '/admin/login'; return; }
      return res.json();
    }).then(data => {
      if (!data || data.role !== 'owner') {
        setAuthorized(false);
      } else {
        setAuthorized(true);
      }
    }).catch(() => { window.location.href = '/admin/login'; });
  }, []);

  if (authorized === null) return <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>;

  if (!authorized) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="mb-4 flex justify-center"><IconLock size={40} className="text-amber-500" /></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Owner Access Required</h2>
          <p className="text-gray-500">Only owners can use the Live Preview editor.</p>
          <button onClick={() => router.push('/admin')} className="mt-4 btn-primary">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="-m-6">
      <SitePreview />
    </div>
  );
}
