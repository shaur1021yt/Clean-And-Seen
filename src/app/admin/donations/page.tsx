'use client';

import { useEffect, useState } from 'react';
import { IconDonation } from '@/components/Icons';

interface Donation {
  id: number;
  donor_name: string;
  donor_email: string;
  amount: number;
  method: string;
  note: string;
  anonymous: number;
  created_at: string;
}

interface DonationSummary {
  total: number;
  count: number;
  recent: Donation[];
}

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [summary, setSummary] = useState<DonationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    donor_name: '',
    donor_email: '',
    amount: '',
    method: 'venmo',
    note: '',
    anonymous: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [venmoUsername, setVenmoUsername] = useState('@projectcleanseen');

  useEffect(() => {
    fetchDonations();
    fetch('/api/content/get_involved').then(r => r.json()).then(d => {
      if (d.venmo_username) setVenmoUsername(d.venmo_username);
    });
  }, []);

  async function fetchDonations() {
    try {
      const res = await fetch('/api/donations');
      const data = await res.json();
      setDonations(data.donations || []);
      setSummary(data.summary);
    } catch {
      setError('Failed to load donations');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          amount: parseFloat(form.amount),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to record');
        return;
      }
      setForm({ donor_name: '', donor_email: '', amount: '', method: 'venmo', note: '', anonymous: false });
      setShowAdd(false);
      fetchDonations();
    } catch {
      setError('Failed to record donation');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this donation record?')) return;
    try {
      await fetch('/api/donations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchDonations();
    } catch {
      setError('Failed to delete');
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">Loading donations...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
          <p className="text-sm text-gray-500 mt-1">Track Venmo and other donations</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary">
          + Record Donation
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm font-mono text-gray-500 uppercase tracking-wider">Total Raised</p>
            <p className="text-3xl font-bold text-primary-700 mt-1">${summary.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm font-mono text-gray-500 uppercase tracking-wider">Donations</p>
            <p className="text-3xl font-bold text-primary-700 mt-1">{summary.count}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm font-mono text-gray-500 uppercase tracking-wider">Average</p>
            <p className="text-3xl font-bold text-primary-700 mt-1">
              ${summary.count > 0 ? (summary.total / summary.count).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>
      )}

      {/* Venmo Info */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 mb-6 border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2">Venmo Donations</h3>
        <p className="text-blue-700 text-sm mb-3">
          When someone donates via Venmo, record it here to keep track. Share your Venmo username or QR code on the donate page.
        </p>
        <p className="text-blue-800 font-mono text-sm">Venmo: <span className="font-bold">{venmoUsername}</span></p>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Record a Donation</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Donor Name *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={form.donor_name}
                  onChange={e => setForm(p => ({ ...p, donor_name: e.target.value }))}
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="input-field"
                  value={form.donor_email}
                  onChange={e => setForm(p => ({ ...p, donor_email: e.target.value }))}
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  className="input-field"
                  value={form.amount}
                  onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                  placeholder="25.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                <select
                  className="input-field"
                  value={form.method}
                  onChange={e => setForm(p => ({ ...p, method: e.target.value }))}
                >
                  <option value="venmo">Venmo</option>
                  <option value="paypal">PayPal</option>
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
              <input
                type="text"
                className="input-field"
                value={form.note}
                onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                placeholder="e.g. From school drive, Monthly donation..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={form.anonymous}
                onChange={e => setForm(p => ({ ...p, anonymous: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <label htmlFor="anonymous" className="text-sm text-gray-700">Display as anonymous</label>
            </div>
            <div className="flex space-x-3">
              <button type="submit" disabled={saving} className="btn-save">
                {saving ? 'Saving...' : 'Record Donation'}
              </button>
              <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Donations Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Donor</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Amount</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Method</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Date</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Note</th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {donations.map(d => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">
                    {d.anonymous ? 'Anonymous' : d.donor_name}
                  </div>
                  {!d.anonymous && d.donor_email && (
                    <div className="text-xs text-gray-500">{d.donor_email}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-lg font-bold text-green-700">
                    ${d.amount.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 capitalize">
                    {d.method}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(d.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">
                  {d.note || '—'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {donations.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <IconDonation size={40} className="mx-auto mb-3 text-gray-300" />
            <p>No donations recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
