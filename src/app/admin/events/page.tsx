'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  status: string;
  cover_image?: string;
}

const defaultEvent: Partial<Event> = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  type: 'volunteer',
  status: 'upcoming',
  cover_image: '',
};

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/auth/me').then(res => {
      if (!res.ok) window.location.href = '/admin/login';
    });
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    fetch('/api/admin/events')
      .then(res => res.json())
      .then(setEvents)
      .finally(() => setLoading(false));
  };

  const handleCoverUpload = async (file: File) => {
    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'uploads');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setEditingEvent(prev => ({ ...prev!, cover_image: data.url }));
      }
    } catch (error) {
      console.error('Upload error');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSave = async () => {
    if (!editingEvent?.title || !editingEvent?.date) return;
    try {
      const method = editingEvent.id ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/events', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEvent),
      });
      if (res.ok) {
        fetchEvents();
        setShowForm(false);
        setEditingEvent(null);
        setMessage(editingEvent.id ? 'Event updated!' : 'Event added!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error saving event');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this event?')) return;
    try {
      const res = await fetch(`/api/admin/events?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEvents(prev => prev.filter(e => e.id !== id));
        setMessage('Event deleted');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error deleting event');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading...</div></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Events</h1>
        <button
          onClick={() => { setEditingEvent({ ...defaultEvent }); setShowForm(true); }}
          className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-sm"
        >
          + Add Event
        </button>
      </div>

      {message && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
          message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-primary-50 text-primary-700'
        }`}>
          {message}
        </div>
      )}

      {/* Event Form Modal */}
      {showForm && editingEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingEvent.id ? 'Edit Event' : 'Add Event'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  value={editingEvent.title || ''}
                  onChange={e => setEditingEvent(prev => ({ ...prev!, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  rows={3}
                  value={editingEvent.description || ''}
                  onChange={e => setEditingEvent(prev => ({ ...prev!, description: e.target.value }))}
                />
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    if (e.target.files?.[0]) handleCoverUpload(e.target.files[0]);
                  }}
                />

                {editingEvent.cover_image ? (
                  <div className="relative w-full h-40 rounded-xl border-2 border-gray-200 overflow-hidden bg-gray-50">
                    <Image
                      src={editingEvent.cover_image}
                      alt="Event cover"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={() => coverInputRef.current?.click()}
                        className="p-1.5 bg-white/90 rounded-lg hover:bg-white text-gray-600"
                        title="Change image"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </button>
                      <button
                        onClick={() => setEditingEvent(prev => ({ ...prev!, cover_image: '' }))}
                        className="p-1.5 bg-white/90 rounded-lg hover:bg-white text-red-500"
                        title="Remove image"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => coverInputRef.current?.click()}
                    disabled={uploadingCover}
                    className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary-400 hover:bg-primary-50/50 transition-all text-gray-400 hover:text-primary-600"
                  >
                    {uploadingCover ? (
                      <div className="text-sm">Uploading...</div>
                    ) : (
                      <>
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-sm font-medium">Click to upload cover image</span>
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
                    value={editingEvent.cover_image || ''}
                    onChange={e => setEditingEvent(prev => ({ ...prev!, cover_image: e.target.value }))}
                    placeholder="Or paste image URL"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    value={editingEvent.date || ''}
                    onChange={e => setEditingEvent(prev => ({ ...prev!, date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    value={editingEvent.time || ''}
                    onChange={e => setEditingEvent(prev => ({ ...prev!, time: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  value={editingEvent.location || ''}
                  onChange={e => setEditingEvent(prev => ({ ...prev!, location: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    value={editingEvent.type || 'volunteer'}
                    onChange={e => setEditingEvent(prev => ({ ...prev!, type: e.target.value }))}
                  >
                    <option value="volunteer">Volunteer</option>
                    <option value="donation_drive">Donation Drive</option>
                    <option value="kit_assembly">Kit Assembly</option>
                    <option value="community">Community Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    value={editingEvent.status || 'upcoming'}
                    onChange={e => setEditingEvent(prev => ({ ...prev!, status: e.target.value }))}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="flex-1 px-5 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all">Save</button>
              <button onClick={() => { setShowForm(false); setEditingEvent(null); }} className="flex-1 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="grid gap-4">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
            <div className="flex">
              {event.cover_image && (
                <div className="w-40 h-32 flex-shrink-0 relative bg-gray-50">
                  <Image
                    src={event.cover_image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{event.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span>📅 {event.date}</span>
                      {event.time && <span>🕐 {event.time}</span>}
                      {event.location && <span>📍 {event.location}</span>}
                    </div>
                    {event.description && (
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">{event.description}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        event.type === 'volunteer' ? 'bg-primary-100 text-primary-800' :
                        event.type === 'donation_drive' ? 'bg-amber-100 text-amber-800' :
                        event.type === 'kit_assembly' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {event.type.replace('_', ' ')}
                      </span>
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        event.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                        event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() => { setEditingEvent(event); setShowForm(true); }}
                        className="text-primary-600 hover:text-primary-700 text-sm font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <div className="text-4xl mb-3 opacity-30">📅</div>
            <p className="text-gray-500 text-lg font-medium mb-2">No events yet</p>
            <p className="text-gray-400 text-sm">Click &quot;Add Event&quot; to create your first event</p>
          </div>
        )}
      </div>
    </div>
  );
}
