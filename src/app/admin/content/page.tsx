'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

interface ContentData {
  [section: string]: { [key: string]: string };
}

// Keys that should be treated as image fields
const IMAGE_KEYS = ['hero_image', 'about_image', 'background_image', 'photo', 'image'];

// Human-readable labels for all fields
const fieldLabels: Record<string, Record<string, string>> = {
  home: {
    hero_title: 'Hero Title',
    hero_subtitle: 'Hero Subtitle',
    hero_description: 'Hero Description',
    hero_image: 'Hero Background Image',
    mission: 'Mission Statement',
    tension_1: 'Tension Act - Line 1',
    tension_2: 'Tension Act - Line 2',
    tension_3: 'Tension Act - Line 3',
    tension_4: 'Tension Act - Line 4',
    response_1: 'Response Act - Paragraph 1',
    response_2: 'Response Act - Paragraph 2',
    response_3: 'Response Act - Paragraph 3',
    close_headline: 'Close Headline',
    close_body: 'Close Body Text',
  },
  programs: {
    section_title: 'Section Title',
    section_description: 'Section Description',
    hygiene_kits_title: 'Hygiene Kits Title',
    hygiene_kits_description: 'Hygiene Kits Description',
    donation_drives_title: 'Donation Drives Title',
    donation_drives_description: 'Donation Drives Description',
    volunteer_title: 'Volunteer Programs Title',
    volunteer_description: 'Volunteer Programs Description',
    outreach_title: 'Community Outreach Title',
    outreach_description: 'Community Outreach Description',
  },
  about: {
    story: 'Our Story',
    why_hygiene: 'Why Hygiene Equity Matters',
    youth_led: 'Youth-Led Description',
    about_image: 'About Page Image',
  },
  impact: {
    section_title: 'Section Title',
    section_description: 'Section Description',
  },
  events: {
    section_title: 'Section Title',
    section_description: 'Section Description',
  },
  partners: {
    section_title: 'Section Title',
    section_description: 'Section Description',
  },
  contact: {
    section_title: 'Section Title',
    section_description: 'Section Description',
    email: 'Email Address',
    instagram: 'Instagram Handle',
  },
  get_involved: {
    volunteer_title: 'Volunteer Section Title',
    volunteer_description: 'Volunteer Description',
    donate_title: 'Donate Section Title',
    donate_description: 'Donate Description',
    partner_title: 'Partner Section Title',
    partner_description: 'Partner Description',
    request_title: 'Request Support Title',
    request_description: 'Request Support Description',
    venmo_username: 'Venmo Username',
    paypal_email: 'PayPal Email',
    venmo_note: 'Donation Note (shown under Venmo)',
  },
};

function ImageField({ value, onChange, label }: { value: string; onChange: (url: string) => void; label: string }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'uploads');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
      }
    } catch (error) {
      console.error('Upload error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); }}
      />

      {value ? (
        <div className="relative w-full h-40 rounded-xl border-2 border-gray-200 overflow-hidden bg-gray-50 group">
          <Image src={value} alt={label} fill className="object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              className="p-2 bg-white/90 rounded-lg hover:bg-white text-gray-700"
              title="Change"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </button>
            <button
              onClick={() => onChange('')}
              className="p-2 bg-red-500/90 rounded-lg hover:bg-red-600 text-white"
              title="Remove"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-primary-400 hover:bg-primary-50/50 transition-all text-gray-400 hover:text-primary-600"
        >
          {uploading ? (
            <span className="text-sm">Uploading...</span>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span className="text-xs font-medium">Upload image</span>
            </>
          )}
        </button>
      )}

      <div className="mt-1.5">
        <input
          type="url"
          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-400"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Or paste image URL"
        />
      </div>
    </div>
  );
}

export default function AdminContent() {
  const [content, setContent] = useState<ContentData>({});
  const [activeSection, setActiveSection] = useState('home');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/auth/me').then(res => {
      if (!res.ok) window.location.href = '/admin/login';
    });
    fetch('/api/admin/content')
      .then(res => res.json())
      .then(setContent);
  }, []);

  const sections = [
    { id: 'home', label: 'Home Page', icon: '◆' },
    { id: 'about', label: 'About Us', icon: '◈' },
    { id: 'programs', label: 'Programs', icon: '◇' },
    { id: 'impact', label: 'Impact', icon: '▲' },
    { id: 'events', label: 'Events', icon: '■' },
    { id: 'partners', label: 'Partners', icon: '●' },
    { id: 'contact', label: 'Contact', icon: '◎' },
    { id: 'get_involved', label: 'Get Involved', icon: '▶' },
  ];

  const handleChange = (section: string, key: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: activeSection, data: content[activeSection] || {} }),
      });
      if (res.ok) {
        setMessage('Content saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Error saving content');
    } finally {
      setSaving(false);
    }
  };

  const currentSection = content[activeSection] || {};
  const labels = fieldLabels[activeSection] || {};

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Site Content</h1>

      <div className="flex gap-6">
        {/* Section Tabs */}
        <div className="w-48 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-2 space-y-1 sticky top-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center space-x-2 ${
                  activeSection === section.id
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xs opacity-70">{section.icon}</span>
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Editor */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {sections.find(s => s.id === activeSection)?.label}
              </h2>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all disabled:opacity-50 shadow-sm"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {message && (
              <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
                message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-primary-50 text-primary-700'
              }`}>
                {message}
              </div>
            )}

            <div className="space-y-6">
              {Object.entries(currentSection).map(([key, value]) => {
                const isImage = IMAGE_KEYS.some(ik => key.toLowerCase().includes(ik.toLowerCase()));
                const label = labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

                if (isImage) {
                  return (
                    <ImageField
                      key={key}
                      value={value}
                      onChange={(url) => handleChange(activeSection, key, url)}
                      label={label}
                    />
                  );
                }

                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    {value.length > 120 ? (
                      <textarea
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-y"
                        rows={4}
                        value={value}
                        onChange={e => handleChange(activeSection, key, e.target.value)}
                      />
                    ) : (
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                        value={value}
                        onChange={e => handleChange(activeSection, key, e.target.value)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
