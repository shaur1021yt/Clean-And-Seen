"use client";

import { useState } from 'react';
import { IconVolunteer, IconCheckCircle, IconCalendar } from '@/components/Icons';
import ScrollReveal from '@/components/ScrollReveal';

interface HourLog {
  id: number;
  volunteer_name: string;
  hours: number;
  activity: string;
  date: string;
  notes: string;
  status: string;
  approved_by: string;
  created_at: string;
}

export default function VolunteerHoursPage() {
  const [formData, setFormData] = useState({
    volunteer_name: '',
    volunteer_email: '',
    hours: '',
    activity: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // History lookup
  const [lookupEmail, setLookupEmail] = useState('');
  const [history, setHistory] = useState<HourLog[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState('');

  const activities = [
    'Hygiene Kit Assembly',
    'Donation Drive',
    'Community Outreach',
    'Event Support',
    'Administrative Work',
    'Donation Sorting',
    'Transportation',
    'Other',
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/volunteer-hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          hours: parseFloat(formData.hours),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to submit hours');
        return;
      }

      setSubmitted(true);
      setFormData({
        volunteer_name: '',
        volunteer_email: '',
        hours: '',
        activity: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!lookupEmail) return;
    setLoadingHistory(true);
    setHistoryError('');

    try {
      const res = await fetch(`/api/volunteer-hours?email=${encodeURIComponent(lookupEmail)}`);
      const data = await res.json();
      setHistory(data);
    } catch {
      setHistoryError('Failed to load history');
    } finally {
      setLoadingHistory(false);
    }
  }

  const totalApproved = history.filter(h => h.status === 'approved').reduce((sum, h) => sum + h.hours, 0);
  const totalPending = history.filter(h => h.status === 'pending').reduce((sum, h) => sum + h.hours, 0);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0D1626] py-20 md:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary-400/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <p className="text-primary-400 text-sm font-mono uppercase tracking-[0.2em] mb-4">Track Your Impact</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Volunteer Hours
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Log your volunteer hours to track your impact and help us grow our community&apos;s contribution.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Log Hours Form */}
          <ScrollReveal>
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                  <IconVolunteer size={20} className="text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Log Hours</h2>
              </div>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <IconCheckCircle size={32} className="text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Hours Submitted!</h3>
                  <p className="text-gray-600 mb-6">
                    Your hours have been submitted for review. An admin will approve them shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
                  >
                    Log More Hours →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.volunteer_name}
                      onChange={e => setFormData(f => ({ ...f, volunteer_name: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                      placeholder="Full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.volunteer_email}
                      onChange={e => setFormData(f => ({ ...f, volunteer_email: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                      placeholder="you@email.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
                      <input
                        type="number"
                        required
                        min="0.5"
                        max="24"
                        step="0.5"
                        value={formData.hours}
                        onChange={e => setFormData(f => ({ ...f, hours: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                        placeholder="0.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={e => setFormData(f => ({ ...f, date: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
                    <select
                      required
                      value={formData.activity}
                      onChange={e => setFormData(f => ({ ...f, activity: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                    >
                      <option value="">Select activity...</option>
                      {activities.map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                    <textarea
                      value={formData.notes}
                      onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm resize-none"
                      placeholder="What did you do? Any details..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                  >
                    {submitting ? 'Submitting...' : 'Submit Hours'}
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>

          {/* History Lookup */}
          <ScrollReveal>
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                  <IconCalendar size={20} className="text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Your History</h2>
              </div>

              <form onSubmit={handleLookup} className="flex gap-3 mb-6">
                <input
                  type="email"
                  value={lookupEmail}
                  onChange={e => setLookupEmail(e.target.value)}
                  placeholder="Enter your email to view history..."
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                />
                <button
                  type="submit"
                  disabled={loadingHistory}
                  className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  {loadingHistory ? '...' : 'Look Up'}
                </button>
              </form>

              {historyError && (
                <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">{historyError}</div>
              )}

              {history.length > 0 && (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-emerald-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-emerald-700">{totalApproved}</div>
                      <div className="text-xs text-emerald-600 font-medium">Approved Hours</div>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-amber-700">{totalPending}</div>
                      <div className="text-xs text-amber-600 font-medium">Pending Hours</div>
                    </div>
                  </div>

                  {/* Log List */}
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {history.map(log => (
                      <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{log.activity}</div>
                          <div className="text-xs text-gray-500">{log.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-primary-700">{log.hours}h</div>
                          <span className={`text-xs font-medium ${
                            log.status === 'approved' ? 'text-emerald-600' :
                            log.status === 'rejected' ? 'text-red-600' : 'text-amber-600'
                          }`}>
                            {log.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {history.length === 0 && !loadingHistory && lookupEmail && !historyError && (
                <div className="text-center py-8 text-gray-500">
                  <p>No volunteer hours found for this email.</p>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
