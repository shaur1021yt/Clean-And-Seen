'use client';

import { useEffect, useState } from 'react';

interface Stat {
  id: number;
  label: string;
  value: number;
  icon: string;
  sort_order: number;
}

export default function AdminImpact() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [newStat, setNewStat] = useState({ label: '', value: 0, icon: '▲', sort_order: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/auth/me').then(res => {
      if (!res.ok) window.location.href = '/admin/login';
    });
    fetchStats();
  }, []);

  const fetchStats = () => {
    fetch('/api/admin/impact')
      .then(res => res.json())
      .then(setStats)
      .finally(() => setLoading(false));
  };

  const handleUpdate = async (id: number, value: number) => {
    try {
      const res = await fetch('/api/admin/impact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, value }),
      });
      if (res.ok) {
        setStats(prev => prev.map(s => s.id === id ? { ...s, value } : s));
        setMessage('Stat updated!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error updating stat');
    }
  };

  const handleAdd = async () => {
    if (!newStat.label) return;
    try {
      const res = await fetch('/api/admin/impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStat),
      });
      if (res.ok) {
        fetchStats();
        setNewStat({ label: '', value: 0, icon: '▲', sort_order: stats.length + 1 });
        setMessage('Stat added!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error adding stat');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this stat?')) return;
    try {
      const res = await fetch(`/api/admin/impact?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStats(prev => prev.filter(s => s.id !== id));
        setMessage('Stat deleted');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error deleting stat');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading...</div></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Impact Stats</h1>

      {message && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
          message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-accent-50 text-accent-700'
        }`}>
          {message}
        </div>
      )}

      {/* Current Stats */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Stats</h2>
        <div className="space-y-4">
          {stats.map((stat) => (
            <div key={stat.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="text-2xl">{stat.icon}</span>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{stat.label}</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="input-field w-32"
                  value={editingId === stat.id ? undefined : stat.value}
                  onFocus={() => setEditingId(stat.id)}
                  onBlur={(e) => {
                    handleUpdate(stat.id, parseInt(e.target.value) || 0);
                    setEditingId(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUpdate(stat.id, parseInt((e.target as HTMLInputElement).value) || 0);
                      setEditingId(null);
                    }
                  }}
                />
                <button
                  onClick={() => handleDelete(stat.id)}
                  className="btn-danger text-sm px-3 py-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Stat */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Stat</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <input
              type="text"
              className="input-field"
              value={newStat.label}
              onChange={e => setNewStat(prev => ({ ...prev, label: e.target.value }))}
              placeholder="e.g., Hygiene Kits Assembled"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
            <input
              type="number"
              className="input-field"
              value={newStat.value || ''}
              onChange={e => setNewStat(prev => ({ ...prev, value: parseInt(e.target.value) || 0 }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji)</label>
            <input
              type="text"
              className="input-field"
              value={newStat.icon}
              onChange={e => setNewStat(prev => ({ ...prev, icon: e.target.value }))}
            />
          </div>
          <div className="flex items-end">
            <button onClick={handleAdd} className="btn-primary w-full">
              Add Stat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
