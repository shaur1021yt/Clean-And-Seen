'use client';

import { useState, useEffect } from 'react';
import { IconVolunteer, IconDonation, IconPartners, IconContent, IconCheck, IconCelebration } from '@/components/Icons';

interface ContentData {
  volunteer_title?: string;
  volunteer_description?: string;
  donate_title?: string;
  donate_description?: string;
  partner_title?: string;
  partner_description?: string;
  request_title?: string;
  request_description?: string;
  venmo_username?: string;
  paypal_email?: string;
  venmo_note?: string;
}

function DonationForm() {
  const [form, setForm] = useState({ name: '', email: '', amount: '', note: '', anonymous: false });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donor_name: form.name,
          donor_email: form.email,
          amount: parseFloat(form.amount),
          method: 'venmo',
          note: form.note,
          anonymous: form.anonymous,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setForm({ name: '', email: '', amount: '', note: '', anonymous: false });
      }
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  if (saved) {
    return (
      <div className="text-center py-4">
        <p className="text-primary-800 font-semibold">Thank you for your donation!</p>
        <button onClick={() => setSaved(false)} className="text-primary-600 text-sm mt-2 hover:underline">Record another</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input type="text" required placeholder="Your name" className="input-field text-sm" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} />
        <input type="email" placeholder="Email (optional)" className="input-field text-sm" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input type="number" step="0.01" min="0.01" required placeholder="Amount ($)*" className="input-field text-sm" value={form.amount} onChange={e => setForm(p => ({...p, amount: e.target.value}))} />
        <input type="text" placeholder="Note (optional)" className="input-field text-sm" value={form.note} onChange={e => setForm(p => ({...p, note: e.target.value}))} />
      </div>
      <label className="flex items-center space-x-2 text-sm text-gray-600">
        <input type="checkbox" checked={form.anonymous} onChange={e => setForm(p => ({...p, anonymous: e.target.checked}))} className="rounded" />
        <span>Display as anonymous</span>
      </label>
      <button type="submit" disabled={saving} className="btn-primary text-sm w-full disabled:opacity-50">
        {saving ? 'Saving...' : 'Record My Donation'}
      </button>
    </form>
  );
}

export default function GetInvolvedPage() {
  const [content, setContent] = useState<ContentData>({});
  const [activeTab, setActiveTab] = useState('volunteer');

  useEffect(() => {
    fetch('/api/content/get_involved').then(r => r.json()).then(setContent);
  }, []);
  const [volunteerForm, setVolunteerForm] = useState({
    name: '',
    email: '',
    phone: '',
    interests: [] as string[],
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(volunteerForm),
      });
      if (res.ok) {
        setSubmitted(true);
        setVolunteerForm({ name: '', email: '', phone: '', interests: [], message: '' });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setVolunteerForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0D1626] py-20 md:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-accent-500/6 blur-[100px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent-400/60 mb-4">Get Involved</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">Get Involved</h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed">
            There are many ways to support Project Clean & Seen and help advance hygiene equity.
          </p>
        </div>
      </section>

      {/* Options */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { Icon: IconVolunteer, title: content.volunteer_title || 'Volunteer', desc: content.volunteer_description || 'Join our team to sort, assemble, and distribute hygiene products.', tab: 'volunteer' },
              { Icon: IconDonation, title: content.donate_title || 'Donate', desc: content.donate_description || 'Support our hygiene programs through product or monetary donations.', tab: 'donate' },
              { Icon: IconPartners, title: content.partner_title || 'Partner', desc: content.partner_description || 'Organizations can collaborate with us on programs and drives.', tab: 'partner' },
              { Icon: IconContent, title: content.request_title || 'Request Support', desc: content.request_description || 'Organizations serving communities in need can request hygiene-product support.', tab: 'request' },
            ].map((item) => (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`bg-white rounded-xl p-6 shadow-sm text-center transition-all ${
                  activeTab === item.tab
                    ? 'ring-2 ring-primary-500 shadow-lg'
                    : 'hover:shadow-md'
                }`}
              >
                <div className="mb-3 flex justify-center"><item.Icon size={32} className="text-primary-600" /></div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-w-2xl mx-auto">
            {/* Volunteer Tab */}
            {activeTab === 'volunteer' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Volunteer With Us</h2>
                <p className="text-gray-600 mb-6">
                  Volunteers are the heart of PCAS. Whether sorting donations, assembling kits, organizing drives, or supporting events — every volunteer makes a difference.
                </p>

                {submitted ? (
                  <div className="bg-accent-50 border border-accent-200 rounded-xl p-8 text-center">
                    <div className="mb-4 flex justify-center"><IconCelebration size={40} className="text-accent-500" /></div>
                    <h3 className="text-xl font-semibold text-accent-800 mb-2">Thank You!</h3>
                    <p className="text-accent-700">We&apos;ve received your volunteer application. We&apos;ll be in touch soon!</p>
                  </div>
                ) : (
                  <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                      <input
                        type="text"
                        required
                        className="input-field"
                        value={volunteerForm.name}
                        onChange={e => setVolunteerForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        className="input-field"
                        value={volunteerForm.email}
                        onChange={e => setVolunteerForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        className="input-field"
                        value={volunteerForm.phone}
                        onChange={e => setVolunteerForm(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                      <div className="flex flex-wrap gap-2">
                        {['Kit Assembly', 'Donation Drives', 'Events', 'Outreach', 'Operations'].map(interest => (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => toggleInterest(interest)}
                            className={`px-3 py-1 rounded-full text-sm transition-all ${
                              volunteerForm.interests.includes(interest)
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {interest}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea
                        className="textarea-field"
                        rows={3}
                        placeholder="Tell us about yourself or any questions..."
                        value={volunteerForm.message}
                        onChange={e => setVolunteerForm(prev => ({ ...prev, message: e.target.value }))}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Sign Up to Volunteer'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Donate Tab */}
            {activeTab === 'donate' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Make a Donation</h2>
                <p className="text-gray-600 mb-6">
                  Your donation helps us provide essential hygiene products to those in need. Every contribution makes a difference.
                </p>

                {/* Venmo Section */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 mb-6 text-white">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                      <span className="text-blue-700 font-bold text-lg">V</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Donate via Venmo</h3>
                      <p className="text-blue-200 text-sm">Fast, easy, and secure</p>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 mb-4">
                    <p className="text-blue-100 text-sm mb-1">Send to:</p>
                    <p className="font-mono text-xl font-bold">{content.venmo_username || '@projectcleanseen'}</p>
                  </div>
                  <p className="text-blue-200 text-sm">
                    {content.venmo_note || 'After sending your donation, please fill out the form below so we can track and thank you properly.'}
                  </p>
                </div>

                {/* Other methods */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Other Ways to Give:</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center space-x-2">
                      <span className="text-accent-500"><IconCheck size={16} /></span>
                      <span>PayPal — {content.paypal_email || 'projectcleanseen@gmail.com'}</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-accent-500"><IconCheck size={16} /></span>
                      <span>New, unused hygiene products</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-accent-500"><IconCheck size={16} /></span>
                      <span>Travel-size hygiene items</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-accent-500"><IconCheck size={16} /></span>
                      <span>New socks and basic clothing items</span>
                    </li>
                  </ul>
                </div>

                {/* Donation Tracking Form */}
                <div className="bg-primary-50 rounded-xl p-6">
                  <h3 className="font-semibold text-primary-900 mb-3">Let Us Know About Your Donation</h3>
                  <p className="text-primary-700 text-sm mb-4">
                    After donating, fill this out so we can track your contribution and send you a thank-you.
                  </p>
                  <DonationForm />
                </div>
              </div>
            )}

            {/* Partner Tab */}
            {activeTab === 'partner' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Partner With Us</h2>
                <p className="text-gray-600 mb-6">
                  We collaborate with nonprofits, schools, community organizations, student groups, businesses, and other organizations to expand our impact.
                </p>
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Partnership Opportunities:</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center space-x-2">
                      <span className="text-accent-500"><IconCheck size={16} /></span>
                      <span>Run donation drives together</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-accent-500"><IconCheck size={16} /></span>
                      <span>Create hygiene kits for your community</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-accent-500"><IconCheck size={16} /></span>
                      <span>Receive product donations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-accent-500"><IconCheck size={16} /></span>
                      <span>Host volunteer events</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-accent-500"><IconCheck size={16} /></span>
                      <span>Support your organization&apos;s specific needs</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-accent-500"><IconCheck size={16} /></span>
                      <span>Educate the community about hygiene equity</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-primary-50 rounded-xl p-6">
                  <p className="text-primary-800 font-medium">
                    Interested in partnering? Reach out at projectcleanseen@gmail.com or DM @projectcleanseen
                  </p>
                </div>
              </div>
            )}

            {/* Request Support Tab */}
            {activeTab === 'request' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Request Support</h2>
                <p className="text-gray-600 mb-6">
                  If your organization serves communities experiencing homelessness, financial hardship, or limited access to hygiene products, we may be able to help.
                </p>
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">We Can Provide:</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center space-x-2">
                      <span className="text-accent-500"><IconCheck size={16} /></span>
                      <span>Hygiene kits for distribution</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-accent-500"><IconCheck size={16} /></span>
                      <span>Individual hygiene products</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-accent-500"><IconCheck size={16} /></span>
                      <span>Support for your own donation drives</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-primary-50 rounded-xl p-6">
                  <p className="text-primary-800 font-medium">
                    To request support, please contact us at projectcleanseen@gmail.com with details about your organization and needs.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
