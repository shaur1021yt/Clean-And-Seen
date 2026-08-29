'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

interface Partner {
  id: number;
  name: string;
  description: string;
  logo_url: string;
  website_url: string;
  sort_order: number;
}

export default function AdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partial<Partner> | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/auth/me').then(res => {
      if (!res.ok) window.location.href = '/admin/login';
    });
    fetchPartners();
  }, []);

  const fetchPartners = () => {
    fetch('/api/admin/partners')
      .then(res => res.json())
      .then(setPartners)
      .finally(() => setLoading(false));
  };

  const handleLogoUpload = async (file: File) => {
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'uploads');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setEditingPartner(prev => ({ ...prev!, logo_url: data.url }));
      }
    } catch (error) {
      console.error('Upload error');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    if (!editingPartner?.name) return;
    try {
      const method = editingPartner.id ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/partners', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPartner),
      });
      if (res.ok) {
        fetchPartners();
        setShowForm(false);
        setEditingPartner(null);
        setMessage(editingPartner.id ? 'Partner updated!' : 'Partner added!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error saving partner');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this partner?')) return;
    try {
      const res = await fetch(`/api/admin/partners?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPartners(prev => prev.filter(p => p.id !== id));
        setMessage('Partner deleted');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error deleting partner');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading...</div></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Partners</h1>
        <button
          onClick={() => { setEditingPartner({ name: '', description: '', logo_url: '', website_url: '', sort_order: partners.length }); setShowForm(true); }}
          className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-sm"
        >
          + Add Partner
        </button>
      </div>

      {message && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
          message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-primary-50 text-primary-700'
        }`}>
          {message}
        </div>
      )}

      {/* Partner Form Modal */}
      {showForm && editingPartner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingPartner.id ? 'Edit Partner' : 'Add Partner'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  value={editingPartner.name || ''}
                  onChange={e => setEditingPartner(prev => ({ ...prev!, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  rows={3}
                  value={editingPartner.description || ''}
                  onChange={e => setEditingPartner(prev => ({ ...prev!, description: e.target.value }))}
                />
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    if (e.target.files?.[0]) handleLogoUpload(e.target.files[0]);
                  }}
                />

                {editingPartner.logo_url ? (
                  <div className="relative w-32 h-32 rounded-xl border-2 border-gray-200 overflow-hidden bg-gray-50">
                    <Image
                      src={editingPartner.logo_url}
                      alt="Partner logo"
                      fill
                      className="object-contain p-2"
                    />
                    <div className="absolute top-1 right-1 flex gap-1">
                      <button
                        onClick={() => logoInputRef.current?.click()}
                        className="p-1 bg-white/90 rounded-full hover:bg-white text-gray-600"
                        title="Change logo"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </button>
                      <button
                        onClick={() => setEditingPartner(prev => ({ ...prev!, logo_url: '' }))}
                        className="p-1 bg-white/90 rounded-full hover:bg-white text-red-500"
                        title="Remove logo"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary-400 hover:bg-primary-50/50 transition-all text-gray-400 hover:text-primary-600"
                  >
                    {uploadingLogo ? (
                      <div className="text-sm">Uploading...</div>
                    ) : (
                      <>
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-sm font-medium">Click to upload logo</span>
                        <span className="text-xs">JPG, PNG, WebP up to 5MB</span>
                      </>
                    )}
                  </button>
                )}

                {/* Or enter URL */}
                <div className="mt-2">
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-400"
                    value={editingPartner.logo_url || ''}
                    onChange={e => setEditingPartner(prev => ({ ...prev!, logo_url: e.target.value }))}
                    placeholder="Or paste image URL"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                <input
                  type="url"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  value={editingPartner.website_url || ''}
                  onChange={e => setEditingPartner(prev => ({ ...prev!, website_url: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <input
                  type="number"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  value={editingPartner.sort_order || 0}
                  onChange={e => setEditingPartner(prev => ({ ...prev!, sort_order: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="flex-1 px-5 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all">Save</button>
              <button onClick={() => { setShowForm(false); setEditingPartner(null); }} className="flex-1 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Partners Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.map((partner) => (
          <div key={partner.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
            {partner.logo_url && (
              <div className="h-40 bg-gray-50 relative">
                <Image
                  src={partner.logo_url}
                  alt={partner.name}
                  fill
                  className="object-contain p-4"
                />
              </div>
            )}
            <div className="p-5">
              <h3 className="font-bold text-gray-900 mb-1">{partner.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{partner.description || 'No description'}</p>
              {partner.website_url && (
                <a href={partner.website_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 text-sm hover:underline">
                  {partner.website_url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              )}
              <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => { setEditingPartner(partner); setShowForm(true); }}
                  className="text-primary-600 hover:text-primary-700 text-sm font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(partner.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {partners.length === 0 && (
          <div className="col-span-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <div className="text-4xl mb-3 opacity-30">🤝</div>
            <p className="text-gray-500 text-lg font-medium mb-2">No partners yet</p>
            <p className="text-gray-400 text-sm">Click &quot;Add Partner&quot; to add your first partner organization</p>
          </div>
        )}
      </div>
    </div>
  );
}
