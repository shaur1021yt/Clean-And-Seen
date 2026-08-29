'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconLock, IconCrown, IconWrench } from '@/components/Icons';

interface Permission {
  key: string;
  label: string;
  description: string;
}

interface AdminUser {
  id: number;
  username: string;
  role: 'owner' | 'admin';
  created_at: string;
  permissions: string[];
}

export default function UserManagementPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'owner' | 'admin'>('admin');
  const [creating, setCreating] = useState(false);
  const [editingPerms, setEditingPerms] = useState<number | null>(null);
  const [savingPerms, setSavingPerms] = useState(false);
  const [permMessage, setPermMessage] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/permissions');
      if (res.status === 403) {
        setError('Owner access required');
        setLoading(false);
        return;
      }
      if (!res.ok) { window.location.href = '/admin/login'; return; }
      const data = await res.json();
      setUsers(data.users);
      setAllPermissions(data.allPermissions);
    } catch { setError('Failed to load users'); }
    finally { setLoading(false); }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername, password: newPassword, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to create user'); return; }
      setNewUsername(''); setNewPassword(''); setNewRole('admin'); setShowCreate(false);
      fetchUsers();
    } catch { setError('Failed to create user'); }
    finally { setCreating(false); }
  }

  async function handleDelete(id: number, username: string) {
    if (!confirm(`Delete user "${username}"? This cannot be undone.`)) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to delete'); return; }
      fetchUsers();
    } catch { setError('Failed to delete user'); }
  }

  async function handleRoleChange(id: number, newRole: 'owner' | 'admin') {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to update role'); return; }
      fetchUsers();
    } catch { setError('Failed to update role'); }
  }

  async function handlePermToggle(userId: number, permKey: string, current: boolean) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const newPerms = current
      ? user.permissions.filter(p => p !== permKey)
      : [...user.permissions, permKey];
    // Optimistic update
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, permissions: newPerms } : u));
  }

  async function handleSavePerms(userId: number) {
    setSavingPerms(true);
    setPermMessage('');
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;
      const res = await fetch('/api/admin/permissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, permissions: user.permissions }),
      });
      if (!res.ok) {
        const data = await res.json();
        setPermMessage(data.error || 'Failed to save');
        return;
      }
      setPermMessage('Permissions saved!');
      setTimeout(() => { setPermMessage(''); setEditingPerms(null); }, 1500);
    } catch { setPermMessage('Failed to save permissions'); }
    finally { setSavingPerms(false); }
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Loading users...</div>;

  if (error === 'Owner access required') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="mb-4 flex justify-center"><IconLock size={40} className="text-primary-500" /></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Owner Access Required</h2>
          <p className="text-gray-500">Only owners can manage users.</p>
          <button onClick={() => router.push('/admin')} className="mt-4 btn-primary">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage admin accounts, roles, and permissions</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary">+ Add User</button>
      </div>

      {error && error !== 'Owner access required' && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
      )}

      {/* Permission Legend */}
      <div className="bg-white rounded-xl p-5 shadow-sm mb-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Available Permissions</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {allPermissions.map(perm => (
            <div key={perm.key} className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-bold text-gray-700">{perm.label}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{perm.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Create User Form */}
      {showCreate && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Create New User</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} className="input-field" required minLength={3} placeholder="e.g. volunteer_lead" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input-field" required minLength={6} placeholder="Min 6 characters" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select value={newRole} onChange={e => setNewRole(e.target.value as 'owner' | 'admin')} className="input-field">
                  <option value="admin">Admin - Custom permissions</option>
                  <option value="owner">Owner - Full access</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3">
              <button type="submit" disabled={creating} className="btn-save">{creating ? 'Creating...' : 'Create User'}</button>
              <button type="button" onClick={() => { setShowCreate(false); setError(''); }} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Users List with Permissions */}
      <div className="space-y-4">
        {users.map(u => (
          <div key={u.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* User Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  {u.role === 'owner' ? <IconCrown size={18} className="text-amber-500" /> : <IconWrench size={18} className="text-blue-500" />}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{u.username}</div>
                  <div className="text-xs text-gray-500">Created {new Date(u.created_at).toLocaleDateString()}</div>
                </div>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                  u.role === 'owner' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {u.role === 'owner' ? '👑 Owner' : '🔧 Admin'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {u.role !== 'owner' && (
                  <>
                    <select
                      value={u.role}
                      onChange={e => handleRoleChange(u.id, e.target.value as 'owner' | 'admin')}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
                    >
                      <option value="admin">Admin</option>
                      <option value="owner">Owner</option>
                    </select>
                    <button onClick={() => setEditingPerms(editingPerms === u.id ? null : u.id)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium">
                      {editingPerms === u.id ? 'Close' : '⚡ Permissions'}
                    </button>
                    <button onClick={() => handleDelete(u.id, u.username)} className="text-red-500 hover:text-red-700 text-xs px-2 py-1.5 rounded-lg hover:bg-red-50">Delete</button>
                  </>
                )}
                {u.role === 'owner' && (
                  <span className="text-xs text-amber-600 font-medium px-3 py-1.5 bg-amber-50 rounded-lg">Full Access</span>
                )}
              </div>
            </div>

            {/* Permission Editor (expandable) */}
            {editingPerms === u.id && u.role !== 'owner' && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-700">Permissions for {u.username}</h4>
                  {permMessage && (
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      permMessage.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>{permMessage}</span>
                  )}
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  {allPermissions.map(perm => {
                    const enabled = u.permissions.includes(perm.key);
                    return (
                      <button
                        key={perm.key}
                        onClick={() => handlePermToggle(u.id, perm.key, enabled)}
                        className={`text-left p-3 rounded-xl border-2 transition-all ${
                          enabled
                            ? 'border-primary-400 bg-primary-50 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-gray-800">{perm.label}</span>
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                            enabled ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-400'
                          }`}>{enabled ? '✓' : ''}</span>
                        </div>
                        <p className="text-[10px] text-gray-500">{perm.description}</p>
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => handleSavePerms(u.id)}
                  disabled={savingPerms}
                  className="btn-save text-sm"
                >
                  {savingPerms ? 'Saving...' : 'Save Permissions'}
                </button>
              </div>
            )}

            {/* Quick Permission Summary */}
            {editingPerms !== u.id && u.role !== 'owner' && (
              <div className="px-6 py-3 flex flex-wrap gap-1.5">
                {allPermissions.map(perm => {
                  const enabled = u.permissions.includes(perm.key);
                  return (
                    <span key={perm.key} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      enabled ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-400 line-through'
                    }`}>{perm.label}</span>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
