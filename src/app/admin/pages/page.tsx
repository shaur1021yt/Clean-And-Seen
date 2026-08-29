'use client';

import { useEffect, useState } from 'react';

interface Program {
  id: number;
  title: string;
  description: string;
  details: string;
  icon: string;
  sort_order: number;
}

interface Signup {
  id: number;
  name: string;
  email: string;
  phone: string;
  interests: string;
  message: string;
  created_at: string;
}

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  type: string;
  created_at: string;
}

export default function AdminPages() {
  const [activeTab, setActiveTab] = useState('programs');
  const [programs, setPrograms] = useState<Program[]>([]);
  const [signups, setSignups] = useState<Signup[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [interestFilter, setInterestFilter] = useState('all');

  useEffect(() => {
    fetch('/api/auth/me').then(res => {
      if (!res.ok) window.location.href = '/admin/login';
    });
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [programsRes, signupsRes, contactsRes] = await Promise.all([
        fetch('/api/admin/programs'),
        fetch('/api/admin/signups'),
        fetch('/api/admin/contacts'),
      ]);
      const programsData = await programsRes.json();
      const signupsData = await signupsRes.json();
      const contactsData = await contactsRes.json();
      setPrograms(programsData);
      setSignups(signupsData);
      setContacts(contactsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProgram = async (id: number) => {
    if (!confirm('Delete this program?')) return;
    try {
      const res = await fetch(`/api/admin/programs?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPrograms(prev => prev.filter(p => p.id !== id));
        setMessage('Program deleted');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error deleting program');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading...</div></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Page Settings & Submissions</h1>

      {message && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
          message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-accent-50 text-accent-700'
        }`}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'programs', label: 'Programs', icon: '◇' },
          { id: 'signups', label: 'Volunteer Signups', icon: '●' },
          { id: 'contacts', label: 'Contact Submissions', icon: '◎' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Programs Tab */}
      {activeTab === 'programs' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Icon</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Title</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Description</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {programs.map((program) => (
                <tr key={program.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-2xl">{program.icon}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{program.title}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm line-clamp-2">{program.description}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteProgram(program.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Signups Tab */}
      {activeTab === 'signups' && (() => {
        const allInterests = Array.from(new Set(
          signups.flatMap(s => (s.interests || '').split(',').map(i => i.trim()).filter(Boolean))
        )).sort();
        const filtered = interestFilter === 'all'
          ? signups
          : signups.filter(s => (s.interests || '').toLowerCase().includes(interestFilter.toLowerCase()));

        const downloadCSV = () => {
          const headers = ['Name', 'Email', 'Phone', 'Interests', 'Message', 'Date'];
          const rows = filtered.map(s => [
            s.name,
            s.email,
            s.phone || '',
            s.interests || '',
            (s.message || '').replace(/"/g, '""'),
            new Date(s.created_at).toLocaleDateString(),
          ]);
          const csv = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(',')).
            join('\n');
          const blob = new Blob([csv], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `volunteers${interestFilter !== 'all' ? '-' + interestFilter : ''}-${new Date().toISOString().slice(0,10)}.csv`;
          a.click();
          URL.revokeObjectURL(url);
        };

        return (
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-600">Filter by interest:</label>
                <select
                  value={interestFilter}
                  onChange={e => setInterestFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                >
                  <option value="all">All Interests ({signups.length})</option>
                  {allInterests.map(interest => (
                    <option key={interest} value={interest}>{interest} ({signups.filter(s => (s.interests || '').toLowerCase().includes(interest.toLowerCase())).length})</option>
                  ))}
                </select>
              </div>
              <button
                onClick={downloadCSV}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                Download CSV ({filtered.length})
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Interests</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((signup) => (
                    <tr key={signup.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{signup.name}</td>
                      <td className="px-6 py-4 text-primary-600">{signup.email}</td>
                      <td className="px-6 py-4 text-gray-600">{signup.phone || '-'}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{signup.interests || '-'}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {new Date(signup.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        {interestFilter !== 'all' ? 'No volunteers with this interest.' : 'No volunteer signups yet.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                  <p className="text-primary-600 text-sm">{contact.email}</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                    {contact.type}
                  </span>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {contact.subject && (
                <p className="text-gray-700 font-medium mb-1">{contact.subject}</p>
              )}
              <p className="text-gray-600">{contact.message}</p>
            </div>
          ))}
          {contacts.length === 0 && (
            <div className="bg-gray-50 rounded-xl p-12 text-center text-gray-500">
              No contact submissions yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
