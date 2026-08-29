"use client";

import { useState, useEffect } from 'react';

interface VolunteerHourLog {
  id: number;
  volunteer_name: string;
  volunteer_email: string;
  hours: number;
  activity: string;
  date: string;
  notes: string;
  status: string;
  approved_by: string;
  created_at: string;
}

interface HoursStats {
  totalApprovedHours: number;
  pendingCount: number;
  uniqueVolunteers: number;
  totalLogs: number;
}

export default function AdminVolunteerHoursPage() {
  const [logs, setLogs] = useState<VolunteerHourLog[]>([]);
  const [stats, setStats] = useState<HoursStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchHours();
  }, []);

  async function fetchHours() {
    try {
      const res = await fetch('/api/admin/volunteer-hours');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.hours || []);
        setStats(data.stats || null);
      }
    } catch (err) {
      console.error('Failed to fetch hours:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id: number, action: 'approve' | 'reject') {
    setActionLoading(id);
    try {
      const res = await fetch('/api/admin/volunteer-hours', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        await fetchHours();
      }
    } catch (err) {
      console.error('Action failed:', err);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this entry?')) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/volunteer-hours?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchHours();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setActionLoading(null);
    }
  }

  const filtered = filter === 'all' ? logs : logs.filter(l => l.status === filter);
  const pendingLogs = logs.filter(l => l.status === 'pending');

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto" />
        <p className="mt-4 text-gray-500">Loading volunteer hours...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Volunteer Hours</h1>
        <p className="text-gray-600 mt-1">Review and approve volunteer hour submissions</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-500">Total Approved</div>
            <div className="text-2xl font-bold text-primary-600">{stats.totalApprovedHours}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-500">Pending Review</div>
            <div className="text-2xl font-bold text-amber-600">{stats.pendingCount}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-500">Unique Volunteers</div>
            <div className="text-2xl font-bold text-emerald-600">{stats.uniqueVolunteers}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-500">Total Submissions</div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalLogs}</div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { key: 'all', label: `All (${logs.length})` },
          { key: 'pending', label: `Pending (${pendingLogs.length})` },
          { key: 'approved', label: `Approved (${logs.filter(l => l.status === 'approved').length})` },
          { key: 'rejected', label: `Rejected (${logs.filter(l => l.status === 'rejected').length})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No volunteer hour submissions found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Volunteer</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Activity</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Hours</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Notes</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{log.volunteer_name}</div>
                      <div className="text-xs text-gray-500">{log.volunteer_email}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{log.activity}</td>
                    <td className="px-4 py-3">
                      <span className="text-lg font-bold text-primary-700">{log.hours}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{log.date}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        log.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate">
                      {log.notes || '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {log.status === 'pending' ? (
                        <div className="flex gap-1 justify-end">
                          <button
                            onClick={() => handleAction(log.id, 'approve')}
                            disabled={actionLoading === log.id}
                            className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(log.id, 'reject')}
                            disabled={actionLoading === log.id}
                            className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 disabled:opacity-50 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleDelete(log.id)}
                          disabled={actionLoading === log.id}
                          className="text-gray-400 hover:text-red-600 text-xs transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
